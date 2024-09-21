const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    username:{
    type:String,
    required:[true,'Please enter a username'],    
    unique:[true,'Username already exists!']
    },
    email:{
    type:String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
    },
    password:{
    type:String,
    required:[true, 'Please enter a password'],
    minlength: [6, 'Password is too short!']},
    tasks:{
    type:[String]
    }
})
userSchema.pre('save', async function(doc){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    console.log('new user was created & saved', doc)
}) 



module.exports = mongoose.model("users",userSchema);
