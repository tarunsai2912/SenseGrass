const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config()

const userRegister = async (req, res, next) => {
    try{
        const { name, email, password, role } = req.body
        const oldUser = await User.findOne({email})
        if(oldUser){
            return res.status(400).json({message: "User Already Exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({ name, email, password: hashedPassword, role })
        await newUser.save()
        return res.status(200).json({ message: "User registered successfully", newUser})
    }
    catch(err){
        return next(err)
    }
}

const userLogin = async (req, res, next) => {
    try{
        const {email, password} = req.body
        const oldUser = await User.findOne({email})
        if(!oldUser){
            return res.status(400).json({message: 'User doesnot exists'})
        }
        const passMatch = await bcrypt.compare(password, oldUser.password)
        if(!passMatch){
            return res.status(400).json({message: 'Password is Incorrect'})
        }
        const user = oldUser._id
        const name = oldUser.name
        const role = oldUser.role
        const pro = oldUser.pro
        const token = jwt.sign({user_Id: oldUser._id}, process.env.JWT_SECRET)
        return res.status(200).json({message: 'User got LoggedIn', token, user, name, email, role, pro})
    }
    catch(err){
        return next(err)
    }
}

module.exports = {userRegister, userLogin}