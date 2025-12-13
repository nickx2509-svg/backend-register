import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Customer } from "../models/Customer.models.js"
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js"
const registerUser = asyncHandler(async(req,res) => {
  // get user data from req.body
  // validate the user data
  // check if user already login
  // create user db
  // remove password
  // return resp

  const {username,email,password} = req.body

  if(!username){
    throw new ApiError(401,"All filed are required")
  }
 else if(!password){
    throw new ApiError(401,"All filed are required")
  }
  else if(!email){
    throw new ApiError(401,"All filed are required")
  }

  const existedUser = await Customer.findOne({
    $or:[{ email },{ username }]
  })

  if(existedUser){
    throw new ApiError(401,"user already login")
  }

  const customer = await Customer.create({
    username,
    email,
    password
  })

  const createUser = await Customer.findById(customer._id)
  .select("-password -refreshToken")

  return res.status(200).json(
    new ApiResponse(
      200,
      createUser,
      "User created SuccessFUlly"
    )
  )
})

const loginUser = asyncHandler(async(req,res) => {
 //Take email or username and password from req.body

 //If email/username or password is missing // → return error "All fields are required"

 //Find user by email OR username

 //Fetch user WITH password using .select("+password")
 //Compare entered password with hashed password using bcrypt

 //Generate:
//- Access Token (short life)
// - Refresh Token (long life)

//Store refreshToken in user document




 
 

 const {email,password} = req.body

  if(!email && !password) {
    throw new ApiError(401,"All fileds are required")
  }
  
  const customer = await Customer.findOne({
    $or:[{ email }]
  }).select("+password")

  if(!customer){
    throw new ApiError(401,"user not login sign up")
  }

  const ispasswordValid = await customer.isPasswordCorrect(password)

  if(!ispasswordValid){
    throw new ApiError(401,"Incorrect Password")
  }

  const {refreshToken,accessToken} = await generateAccessAndRefreshTokens(customer._id)


  const loggesUser = await Customer.findById(customer._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("AccessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200),
    {
      loggesUser,accessToken,refreshToken
    },
    "User login successFully"
  )
})

const logoutUser = asyncHandler(async (req, res) => {

  await Customer.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "Logout successful")
    )
})
export {
  registerUser,
  loginUser,
  logoutUser
}