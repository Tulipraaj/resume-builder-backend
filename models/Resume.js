const mongoose = require("mongoose")
const { dropSearchIndex } = require("./User")

const resumeSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    personalDetails: {
        fullName: {type: String, required: true},
        phone: {type:String},
        email: {type:String},
        address: {type:String},
        linkedin: {type:String},
        github: {type:String}
    },
    objective: {type:String},
    skills: [{type:String}],
    education: [{
        degree: {type:String},
        institution: {type:String},
        yearOfGraduation: {type:String},
        percentage: {type:String}
    }],
    experience: [{
        jobTitle: {type:String},
        companyName : {type:String},
        startDate: {type:Date},
        endDate: {type:Date},
        description: {type:String},
    }],
    projects: [{
        projName: {type:String},
        projDescription: {type:String},
    }],
    achievements: [{type: String}],
    templates : {type: String, default: "default-template"},
    createdAt: {type:Date, default: Date.now}
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;