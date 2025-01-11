const Field = require("../model/field")
const User = require('../model/user')

const getUserFields = async (req, res, next) => {
  try{
    const user = await User.findById(req.user_Id)
    if(!user){
      return res.status(400).json({message: 'User Not Found'})
    }
    const fields = await Field.find({ userId: user._id })
    return res.status(200).json(fields)
  }
  catch(err){
    return next(err)
  }
}

const getOtherFields = async (req, res, next) => {
  try{
    const user = await User.findById(req.user_Id)
    if(!user){
      return res.status(400).json({message: 'User Not Found'})
    }
    const fields = await Field.find({ userId: { $ne: user._id } })
    return res.status(200).json(fields)
  }
  catch(err){
    return next(err)
  }
}

const createField = async (req, res, next) => {
  try{
    const user = await User.findById(req.user_Id)
    if(!user){
      return res.status(400).json({message: 'User Not Found'})
    }
    const { fieldName, location, cropType, areaSize } = req.body
    const field = new Field({ fieldName, location, cropType, areaSize, userId: user._id })
    const newField = await field.save()
    return res.status(200).json({message: 'Field created successfully', newField})
  }
  catch(err){
    return next(err)
  }
}

const updateField = async (req, res) => {
  try {
    const user = await User.findById(req.user_Id)
    if(!user){
      return res.status(400).json({message: 'User Not Found'})
    }
    const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedField){
      return res.status(400).json({ message: 'Field not found' })
    }
    return res.status(200).json({message: "Field updated successfully", updatedField})
  } 
  catch (error) {
    return next(err)
  }
}

const deleteField = async (req, res) => {
  try {
    const user = await User.findById(req.user_Id)
    if(!user){
      return res.status(400).json({message: 'User Not Found'})
    }
    const field = await Field.findById(req.params.id)
    if(!field){
      return res.status(400).json({message: "Field is not found"})
    }
    await Field.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Field got deleted' })
  } 
  catch (error) {
    return next(err)
  }
}

module.exports = {getUserFields, createField, getOtherFields, updateField, deleteField}
