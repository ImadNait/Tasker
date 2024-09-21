const express = require('express')
const router = express.Router()
require('dotenv').config()
const User = require("../models/userModel")
const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')
const bcrypt = require('bcrypt')
const secretKey = process.env.secret_key
const getAllUsers = async (req, res)=>{
    try{
    const data = await User.find();
    res.json(data)
}
    catch(err){
        res.status(500).json({ error: error.message })
    }

}
const maxAge = 7 * 24 * 60 * 60
function authToken(id) {
    const token = jwt.sign({ id }, secretKey, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id }, secretKey, { expiresIn: '20d' }); 
    return { token, refreshToken };
}
const createUser = async (req, res)=>{
    try{
    const newUser = new User(req.body);
    const {token} = authToken(newUser._id)
    console.log(newUser, token)
    res.cookie('jwt', token, { httpOnly:true, maxAge: maxAge*1000})
    await newUser.save();
    res.status(200).json(`${newUser.username} was created!`);
    console.log(`${newUser.username} was created!`);
    
} catch(err){
    const errors = errorHandler(err)
    res.status(400).json({ errors })
}}

const loginUser = async (req, res)=>{
    try{    
    console.log(req.body)    
    const { credentials, password } = req.body
    let user;
    class CustomError extends Error {
        constructor(message, code) {
          super(message);
          this.name = 'CustomError';
          this.code = code;
        }
      }
    if(credentials ==='' && password ===''){
    throw new CustomError('Enter your Username/Email', 408);    
    }
    if(credentials.includes('@')){
    user = await User.findOne({ email:credentials })    
    }
    else if(credentials ===''){
    throw new CustomError('Enter your Username/Email', 406);

    }
    else{
    user = await User.findOne({ username:credentials })
    }
    if(!user){
    throw new CustomError('User not found!', 409);
    }else{
    if(password ===''){
    throw new CustomError('Enter your password', 407);
        
    }else{
    const Match = await bcrypt.compare(password, user.password);
    if (!Match) {
    throw new CustomError('Invalid password!', 410);
    }else{
    const {refreshToken} =  authToken(user.id)

    localStorage.setItem('token', refreshToken)
    res.status(200).json({ refreshToken });
    console.log(user, refreshToken);
    }}
    }
} catch(err){
    console.log(err);
    const errs = errorHandler(err)
    res.status(400).json({ errs })
}}

const addTasks = async(req, res)=>{
 try {
    const token = req.params.token
    console.log(token);
    
    const decodedToken = jwt.verify(token, secretKey);
    decodedToken.exp = Math.floor(Date.now() / 1000) + 60 * 60*3;
    console.log(decodedToken);
    const userId = decodedToken.userId
    console.log(userId)
    const newTask = req.body;    
    const user = await User.findById(userId, req.params);
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    }
    
    user.tasks.push(newTask)
    await user.save();
    res.status(200).json({ message: 'Task added successfully' });
    console.log('Task added successfully');
} catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        console.log(error);
        console.error('Token expired');
    } else {
        console.error('Error decoding token:', error);
    }
    res.status(500).json({ error: 'Server Error' });
      }
    
}



const Delete = async (req, res)=>{
    try{
    const {id} = req.params;
    const selUser = await User.findByIdAndDelete(id);
    if(!selUser){
        res(404).send('User not found!')    
    }
    res.status(200).json({ message:`User deleted successfully` });
} catch(error){
    res.status(400).json({
        error: error.message
    })
}}

const errorHandler = (err)=>{
//Signup errors
    let Signerrors = { email:'', username:'', password:'' }
//treating all possible signup errors
    if(err.code === 11000){     
    Signerrors.password = "Username or Email already used!"
    console.log(Signerrors); 
    return Signerrors;
    }
    if(err._message==='users validation failed'){
        Object.values(err.errors).forEach(({ properties }) => {
            Signerrors[properties.path]=properties.message;
         });
         console.log(Signerrors);
    return Signerrors;
    }
//Login errors
    let Logerrors = { credentials:'', password:'' }  
//treating all possible login errors
    if(err.code === 406){
        Logerrors.credentials = err.message
        console.log(Logerrors);
        return Logerrors;
    }
    if(err.code === 407){
        Logerrors.password = err.message
        console.log(Logerrors);
        return Logerrors;
    }
    if(err.code === 410){
        Logerrors.password = err.message
        console.log(Logerrors);
        return Logerrors;
    }
    if(err.code === 408){
        Logerrors.credentials = err.message
        Logerrors.password = "Enter your password"
        console.log(Logerrors);
        return Logerrors;
    }
    if(err.code === 409){
        Logerrors.credentials = err.message
        console.log(Logerrors);
        return Logerrors;
    }
    
}



router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');   
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });




exports.router = router
exports.createUser = createUser
exports.loginUser = loginUser
exports.getAllUsers = getAllUsers
exports.Delete = Delete
exports.errorHandler = errorHandler
exports.addTasks = addTasks
