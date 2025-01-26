const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");


module.exports.verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        //req.cookies?.accessToken || 
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, "secret")
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.profile = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})