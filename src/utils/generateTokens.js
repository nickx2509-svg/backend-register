import { Customer } from "../models/Customer.models.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const customer = await Customer.findById(userId)
      .select("+refreshToken");

    if (!customer) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = customer.generateAccessToken();
    const refreshToken = customer.generateRefreshToken();

    customer.refreshToken = refreshToken;
    await customer.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("TOKEN GENERATION ERROR:", error);
    throw error;
  }
};

export { generateAccessAndRefreshTokens };
