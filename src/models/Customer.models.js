import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const CustomerSchema = new mongoose.Schema({
  
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    select:false,
  },

  username:{
    type:String,
    lowercase:true,
    trim:true,
    unique:true
  },
  refreshToken:{
    type:String,
    select:false
  }
},
{timestamps:true}
)

CustomerSchema.pre("save", async function () {
  if(!this.isModified("password"))  return;
  
  
  this.password = await bcrypt.hash(this.password,10)

})

CustomerSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
}

CustomerSchema.methods.generateAccessToken = function (){
  return jwt.sign ({
    _id:this._id,
    email:this.email,
    username:this.username
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRE
    },
)
}

CustomerSchema.methods.generateRefreshToken = function (){
  return jwt.sign({
    _id:this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRE
  }

)
}



export const Customer = mongoose.model("Customer",CustomerSchema)
