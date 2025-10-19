const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const {check,validationResult} = require('express-validator');


router.get('/',auth,(req,res)=>{
    try {
        const profile = Profile.findOne({
            user:req.user.id
        }).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})      

// create or update user profile 

router.post('/',[auth,[
    check('status','Status is required')
    .not()
    .isEmpty(),
    check('skill','Skill is required')
    .not()
    .isEmpty()

]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;


    // Build profile object
    const ProfileFields = {};
    ProfileFields.user = req.user.id;
    ProfileFields.company = company;
    ProfileFields.website = website;
    ProfileFields.loaction = location;
    ProfileFields.bio = bio;
    ProfileFields.status = status;
    ProfileFields.githubusername = githubusername;
    if(skills){
        ProfileFields.skills = skills.split(',').map(item => item.trim());
    }

    // Build social object
    ProfileFields.socials = {};
    if(youtube) ProfileFields.socials.youtube = youtube;
    if(twitter) ProfileFields.socials.twitter = twitter;
    if(facebook) ProfileFields.socials.facebook = facebook;
    if(linkedin) ProfileFields.socials.linkedin = linkedin;
    if(instagram) ProfileFields.socials.instagram = instagram;
    console.log(ProfileFields.skills)
    res.send("Hello");

    try {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:ProfileFields},
                {new:true}
            );
            return res.json(profile);
        }
        
    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server Error');
    }
})


// Get all profiles
router.get('/',async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
        
    }
})

// Get profile by user id
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profiles = await Profile.findOne({
            user: req.params.user_id
        }).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg:'Profile not found'});
        }

        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({msg:'Profile not found'})
        }
        res.status(500).send('Server error');
        
    }
})


// delete profile,user and post
router.delete('/',auth,async(req,res)=>{
    try {
        // remove profile
        await Profile.findOneAndDelete({
            user:req.user.id
        })

        await User.findOneAndDelete({
            _id:req.user.id
        })

        if(!profile){
            return res.status(400).json({msg:'Profile not found'});
        }

        res.json("User removed");
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({msg:'Profile not found'})
        }
        res.status(500).send('Server error');
        
    }
})

// add profile experience
router.put('/experience',[auth,[
    check('title','Title is requried').not().isEmpty(),
    check('company','Company is requried').not().isEmpty(),
    check('from','From date is requried').not().isEmpty(),
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        descriptions
    } = req.body;
    
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        descriptions
    }
    try {
        const profile = await Profile.findOne({
            user:req.user.id
        })
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server error');
    }
})

// delete experience
router.delete('/experience/:id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({
            user:req.user.id
        })

        const removedIndex = profile.experience.map((item)=>item.id)
        .indexOf(req.params.exp_id);
        profile.experience.splice(removedIndex,1);
        await profile.save();

    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server error')
        
    }
})


// add profile education
router.put('/education',[auth,[
    check('school','School is requried').not().isEmpty(),
    check('degree','Degree is requried').not().isEmpty(),
    check('fieldofstudy','Field of study is requried').not().isEmpty(),
    check('from','From date is requried').not().isEmpty(),
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;
    
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user:req.user.id
        })
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server error');
    }
})

// delete education
router.delete('/education/:edu_id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({
            user:req.user.id
        })

        const removedIndex = profile.experience.map((item)=>item.id)
        .indexOf(req.params.edu_id);
        profile.education.splice(removedIndex,1);
        await profile.save();

    } catch (error) {
        console.error(error.message);
        res.send(500).send('Server error')
        
    }
})

// github username
router.get('/github/:username',(req,res)=>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get(githubClientId)}&
            client_secret=${config.get(githubSecret)}`,
            method:'GET',
            headers:{
                'user-agent':'node.js'
            }
        }

        request(options,(error,response,body)=>{
            if(error) console.error(error);

            if(response.statusCode != 200){
                return res.status(404).json({
                    msg:'No github profile found'
                })
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})




module.exports = router;