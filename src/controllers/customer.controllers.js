import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/Customer.models.js";

const registerUser = asyncHandler(async (req, res) => {

  const { username, email, age, name, password } = req.body;

  if (!username || !email || !password || !age || !name) {
    throw new ApiError(400, "All fields are required");
  }

  const existedCustomer = await Customer.findOne({
    $or: [{ email }, { username }]
  });

  if (existedCustomer) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const customer = await Customer.create({
    username,
    email,
    password,
    name,
    age,
  });

  const newUser = await Customer.findById(customer._id).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(201, newUser, "User Created Successfully")
  );
});

  const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body
    
    if(!email){
      throw new ApiError(401,"All fileds Are required")
    }
    else if(!password){
      throw new ApiError(401,"All fileds are required")
    }

    const customer = Customer.findOne({
      $or:[{email}]
    }).select("+password")

    if(!customer){
      throw new ApiError(401,"User is not defined try to sign up")
    }
    const isPasswordValid = await Customer.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(401,"Password is incorrect")
    }
  })

export { registerUser };
