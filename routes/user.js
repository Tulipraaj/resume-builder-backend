const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth");

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            authProvider: 'local'  // Add this field to track auth method
        })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(201).json({
            message: "User registered successfully",
            token,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error registering user"})
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user || user.authProvider !== 'local'){
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
            message: "Login success",
            token,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error logging in user"})
    }
});

// New route for Google OAuth
router.post("/google-login", async (req, res) => {
    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if they don't exist
            user = new User({
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
                authProvider: 'google',
                profilePicture: picture
            });
            await user.save();
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Google login success",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error with Google login" });
    }
});

router.get('/user/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            name: user.name, 
            email: user.email,
            authProvider: user.authProvider,
            profilePicture: user.profilePicture 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

module.exports = router;