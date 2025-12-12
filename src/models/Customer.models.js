import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const CustomerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true,
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  age:{
    type:Number,
    required:true,
  },
  username:{
    type:String,
    lowercase:true,
    trim:true
  }
},
{timestamps:true}
)

CustomerSchema.pre("save", async function (next) {
  if(!this.password.isModified("password")){
    return next();
  }
  this.password = await bcrypt.hash(this.password,10)
  next();
})

CustomerSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

CustomerSchema.methods.generateAccessToken = function (){
  return jwt({
    _id:this._id,
    name:this.name,
    email:this.email
  })
}



export const Customer = mongoose.model("Customer",CustomerSchema)
