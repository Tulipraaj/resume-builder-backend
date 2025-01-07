const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})

        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        const token =jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(201).json({
            message: "User registered succesfully",
            token,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error registerng user"})
        
    }
});


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "Invalid email or password"});
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message : "Invalid email or password"});
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        res.status(200).json({
            message: "Login sucesss",
            token,
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error logging in user"})
        
    }
})

router.get('/user/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ name: user.name, email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

module.exports = router;