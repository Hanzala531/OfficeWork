import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
},
    {
        timestamps: true

    }
)

// userSchema.pre("save", ()=>{})
// Not to use this one in these type of usages because it dosent contanins refferences.

userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))) return; // Now it correctly prevents double hashing
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// to check if password is correct or not

userSchema.methods.isPasswordCorrect = async function (enteredPassword,dbPassword) {
    console.log("Stored Hashed Password:", dbPassword);
    console.log("Entered Password:", enteredPassword);
    
    const isValid = await bcrypt.compare(enteredPassword,dbPassword);
    console.log("Password Match:", isValid);

    return isValid;
}


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