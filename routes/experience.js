const express=require("express");
const passport=require("passport");
const Experience=require("../models/Experience");

const router = express.Router();

//route to create a new experience.
router.post("/create",passport.authenticate("jwt",{session: false}),
async(req,res) =>{
     //1. identify the user who is calling it
     // due to password.authenticate , my rq,user will get populated with current user details.
     const user=req.user;
     //2. create the experience object
     const {companyName,position,startDate,endDate,description}=req.body;
     if(!companyName || !position){
          return res.status(402).json({err:"Invalid Details"});
     }

     const experienceObj={
          companyName,
          position,
          startDate,
          endDate,
          description,
     }
     const experience=await Experience.create(experienceObj);

     //3. add experience to user 
     //The experience field of my user will hold the ids of all experience of the user.

     user.experiences.push(experience._id);
     await user.save();

     //4. return a response
     return res.status(200).json(experience);

});

module.exports=router;