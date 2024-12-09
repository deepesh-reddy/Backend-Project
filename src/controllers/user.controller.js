import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
        // 1 get user details from frontend
        // 2 validation - not empty
        // 3 check if user already exists : username,email
        // 4 check for images, check for avatar
        // 5 upload them to cloudinary, avatar
        // 6 create user object - create entry in db
        // 7 remove password and refreshToken field from response
        // 8 check for user creation
        // 9 return res
        

        //1
        const {fullname,email,username,password} = req.body;

        //2
        if(
            [fullname,email,username,password].some((field)=> field?.trim() === "")
        ){
            throw new ApiError(400,"All fields are required")
        }

        //3
        const existedUser =  User.findOne({
            $or:[{ username },{ email }]
        })
        if(existedUser){
            throw new ApiError(409,"User with email or username already exists")
        }

        //4
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar file is required");
        }

        //5
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400,"Avatar file is required");
        }

        //6

        const user = User.create({
            fullname,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username
        })

        //7
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        //8
        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
        }

        //9
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
    }
)

export default registerUser