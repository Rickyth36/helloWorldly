const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')
const User = require('../../models/Users')


// create post
router.post('/',[auth,[
    check('text','Text is required')
    .not()
    .isEmpty()
]],async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        })
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serve error')
    }
    
})

// Get all posts
router.get('/',auth,async(req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serve error')
    }
})

// Get posts By Id
router.get('/:id',auth,async(req,res)=>{
    try {
        const posts = await Post.findById(req.params.id).sort({date:-1});
        
        if(!posts){
            return res.status(404).json({msg:'Posts not found'})
        }
        res.json(posts);        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Posts not found'})
        }
        res.status(500).send('Serve error')
    }
})

// delete a post
router.delete('/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
        if(post.user.toString() != req.user.id) {
            return res.status(401).json({msg:'User not authorized'});
        }
        await post.remove();
        res.json({msg:'Post removed'});        
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Posts not found'});
        }
        res.status(500).send('Serve error')
    }
})

// like a post
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        
        // checking if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
            return res.status(400).json({msg:'Post already liked'})
        }

        post.likes.unshift(req.user.id);

        await post.save();

        res.json(post.likes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})
// like a post
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        
        // checking if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
            return res.status(400).json({msg:'Post already liked'})
        }

        post.likes.unshift(req.user.id);

        await post.save();

        res.json(post.likes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

// like a post
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        
        // checking if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
            return res.status(400).json({msg:'Post already liked'})
        }

        post.likes.unshift(req.user.id);

        await post.save();

        res.json(post.likes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

// unlike a post
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        
        // checking if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:'Post has not yet been liked'})
        }

        // remove index
        const removedIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));

        post.likes.splice(removedIndex,1);

        await post.save();

        res.json(post.likes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

// comment post
router.post('/comment/:id',[auth,[
    check('text','Text is required')
    .not()
    .isEmpty()
]],async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        }

        post.comments.unshift(newComment);

        post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serve error')
    }
    
})

// delete comment 
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
        const post = Post.findById(req.params.id);
        
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        }
        // Check user
        if(comment.user.toString() != req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        // remove index
        const removedIndex = post.comments
        .map(comment => comment.user.toString().indexOf(req.user.id));
        
        post.comments.splice(removedIndex,1);    
        
        res.json(post.comments);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serve error');    
    }
})
module.exports = router;