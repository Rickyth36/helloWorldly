const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const gravatar = require('gravatar');   
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/Users')

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with atleast 6 characters').isLength({min:6})
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password} = req.body;
    try {
        // See if user exist 
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'User already exist'}]});
        }

        // Get users avatar 
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })

        // Encrypt password 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        // Return jsonwebtoken
        const payload = {
            user:{
                id:user.id
            }
        } 
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            }

        )
        console.log(req.body);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }


    res.send('User route');
})

module.exports = router;