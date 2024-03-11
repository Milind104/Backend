const express=require("express");
const passport=require("passport");
const skill =require("../models/Skill");

const router=express.Router();

router.post("/create",
passport.authenticate("jwt",{session: false}),
async(req,res)=>{
     const user=req.user;
     //Create the skill object
     const {skillName}=req.body;
     if(!skillName){
          return res.status(402).json({err:"Invalid details"});
     }

     const skillObj={skillName};
     const createdSkill=await skill.create(skillObj);

     //Add skill to user
     user.skills.push(createdSkill._id);
     await user.save();

     //return a result to user
     return res.status(200).json(createdSkill);
});

module.exports=router;