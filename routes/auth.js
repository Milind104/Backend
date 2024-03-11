const express=require('express');
const User=require("../models/User");
const bcrypt=require("bcrypt");
const{getToken}=require("../utils/helpers");

const router=express.Router();

router.post("/register",async(req,res) =>{
     //This is the function that will handle the register user logic

     //step 1: Get the details from req.body
     const {firstName,lastName ,email,password}=req.body;
     if(!firstName || !email || !password){
          return res.status(400).json({err: "Invalid request body"});
     }

     //step 2: we will check if a user with that email already exists.this is not allowed.
     const existingUser = await User.findOne({email: email});
     if(existingUser){
          return res.status(402).json({err: "A user with this email already exists"});
     }


     //step 3: This is a legitimate user request, now we will create the user
     //If you gave me the password abc@123
     //i will not store it in my db as abc@123
     //i will perform an operation on it to "encrypt" it
     //abc@123 --> abbajnasjhjaHD0KNKD
     //i will store these characters in my db.
     //wecannot decipher the plaintext password from these characters ,that is , i can never figure out that abc@123 was actual password. 
     //At a later point of time if the user sends his/her password for authentication in logic , we will encrypt their entry yet again and if the encryption matches the one in db means the password is correct.

     const hashedPassword =await bcrypt.hash(password,10);
     const newUserDetails={
          firstName,lastName,password:hashedPassword,email,
     };
     const newUser=await User.create(newUserDetails);

     //step 4: I can use the newUser to create a jwt and return the token to the user.
     const token = await getToken(email,newUser);
     //we want to return the followinf to the user:
     //1. the actual user created.
     //2. the token.
     const userToReturn = {...newUser.toJSON(),token};
     delete userToReturn.password;
     return res.status(200).json(userToReturn);
});

router.post("/login",async(req,res) =>{
     //step 1: we get the details fro the req.body
     const {email,password}=req.body;
     if(!email || !password){
          return res.status(401).json({err:"Invalid username or password"});

     }

     // step 2: verify if a user exists with that email
     const user=await User.findOne({email:email});
     if(!user){
          return res.status(401).json({err:"Invalid username or password"});
     }

     //step 3: verify if the password provided by the user for login is correct.
     //this is tricky part
     //Direct password comparision will not work . password == user.password
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
         return res.status(401).json({ err: "Invalid username or password" });
     }
     if (!password) {
         return res.status(401).json({ err: "Password cannot be empty" });
     }
     

     //step 4: Generate a token for the user and return it.
     const token = await getToken(email,user);
     const userToReturn = {...user.toJSON(),token};
     delete userToReturn.password;
     return res.status(200).json(userToReturn);
 
});

module.exports = router;