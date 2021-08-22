const express = require('express')
const router = express.Router()
const mongoose =require('mongoose')
const User =mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} =require('../keys')

router.get('/',(req,res) =>{
    res.send("Hello")
})

router.get('/protected',(req,res) =>{
    res.send("Hello user")
})


router.post('/signup',(req,res) =>{
    const{name,email,password} = req.body
    if(!name || !password || !email){
     return res.status(422).json({errors:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({errors:"user already exists with that email"})
        }

bcrypt.hash(password,12)
.then(hashedPassword=>{
    const user = new User({email,
        password:hashedPassword,
        name})
        user.save()
        .then(user => {
            res.json({message:"saved successfully"})
        })
        .catch((err) => {
            console.log(err)
        })
})       
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email,password} = req.body
   if(!email || !password) {
       return res.status(422).json({error:"Please add email or password"})
   }
User.findOne({email:email})
.then(savedUser=>{
if(!savedUser) {
    return res.status(422).json({error:"Invalid email or password"})
}
bcrypt.compare(password,savedUser.password)
.then(doMath=>{
    if(doMath) {
//res.json({message:"successfully signed in"})

const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
res.json({token})

    }
    else{
        return res.status(422).json({error:"Invalid email or password"})
    }
})
.catch(err => {
    console.log(err)
})
})



},)


module.exports = router