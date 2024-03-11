const mongoose = require('mongoose');
const ProjectSchema =  mongoose.Schema({
     projectName:{
          type: String,
          require:true,
     },
     description:{
          type: String,
          require:false,
     },
     links:[
          {
          type: String,
          },
     ],
});

const  Project = mongoose.model('Project', ProjectSchema);

module.exports =  Project;