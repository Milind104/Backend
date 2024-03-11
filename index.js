const express= require("express");
const passport=require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const authRoutes=require("./routes/auth");
const experienceRoutes=require("./routes/experience");
const skillRoutes=require("./routes/skill");
const projectRoutes=require("./routes/project");
 const User=require("./models/User");


require("dotenv").config();



const app =express();
app.use(express.json());

//to connect to mongodb from node we need to use mongoose,connect()
//it will take 2 arguments : 1. connection string 2. connection option
mongoose.connect(
     "mongodb+srv://milindpatel:"+ process.env.MONGO_PASSWORD +"@cluster0.qseek2h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

)
.then((x) => {
     console.log("Connected to mongo!");
})
.catch((err)=>{
     console.log("Error occured while connecting to mongo");
     console.log(err);
});

//passport-jwt setup.
//jwt_payload :{identifier :userid}
let  opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
passport.use(
     new JwtStrategy(opts, async function(jwt_payload, done) {

          try{
              const user= await User.findOne({_id: jwt_payload.identifier}); 
                    if (user) {
                          done(null, user);
                    } else {
                          done(null, false);
     
                    }
          } catch(err){
               if (err) {
                    done(err, false);
              }
          }   
     })
);

app.get("/",(req,res)=>{
     res.send("I am working");
});

app.get("/home",(req,res)=>{
     res.send("Hello world, i am a new router");
});

//app.use will taake 2 arguments . first will be the prefix to the route.second will be the routes objects.
app.use("/auth",authRoutes);
app.use("/experience",experienceRoutes);
app.use("/skill",skillRoutes);
app.use("/project",projectRoutes);

app.listen(8000,()=>{
     console.log("server running on port number 8000");
});