import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res) => {
  // const {username,email,password,age,} = req.body
  res.status(200).json({
    message:"ok"
  })
})

export {registerUser}