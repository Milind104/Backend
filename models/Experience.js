const mongoose = require('mongoose');
const ExperienceSchema =  mongoose.Schema({
     companyName:{
          type: String,
          require:true,
     },
     position:{
          type: String,
          require:true,
     },
     startDate:{
          type: Date,
          require:false,
     },
     endDate:{
          type: Date,
          require:false,
     },
     description:{
          type: String,
          require:false,
     }, 
});

const Experience = mongoose.model('Experience',ExperienceSchema);

module.exports = Experience;