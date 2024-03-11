const mongoose = require('mongoose');
const SkillSchema =  mongoose.Schema({
     skillName:{
          type: String,
          require:true,
     },
});

const  Skill = mongoose.model(' Skill', SkillSchema);

module.exports =  Skill;