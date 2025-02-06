import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // fullname: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     index: true
    // },
    avatar: {
        type: String, // form of url
        required: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    } ,
    updatedAt: {
        type: Date,
        default: Date.now,
    } ,


},
    {
        timestamps: true

    }
)

// userSchema.pre("save", ()=>{})
// Not to use this one in these type of usages because it dosent contanins refferences.

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // console.log("Password before hashing:", this.password);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log("Password after hashing:", this.password);
    next();
  });
  
  userSchema.methods.isPasswordCorrect = async function (enteredPassword, dbPassword) {
    // console.log("Stored Hashed Password:", dbPassword);
    // console.log("Entered Password:", enteredPassword);
    const isValid = await bcrypt.compare(enteredPassword, dbPassword);
    // console.log("Password Match:", isValid);
    return isValid;
  };

//method for generating access token

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            _username : this._username,
            _email : this._email,
            _fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : `${process.env.ACCESS_TOKEN_EXPIRY}`,
        }
    )
}

//method for generating refresh token

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn : `${process.env.REFRESH_TOKEN_EXPIRY}`,
        }
    )
}
export const User = mongoose.model("User", userSchema);