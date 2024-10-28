import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import nodemailer from "nodemailer";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic,verify } = req.body;

  if(!verify) {
    res.status(400);
    throw new Error('Email is not verified!')
    return 
  }

  //Checking whether it is undefined or not.
  if (name.length == 0 || email.length == 0 || password.length == 0) {
    res.status(400)
    throw new Error('Required fields are empty!')
    return 
  }

  //Checking the user exist.
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400)
    throw new Error('User already exists!')
    return 
  }

  //New User
  const newUser = new User({
    name,
    email,
    password,
    profilePic,
  });
  await newUser.save();
  if (newUser) {
    res.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      profilePic: newUser.profilePic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400) 
    throw new Error("Unable to create user");
  }
});

//Handler for the authentication.
const authUser = asyncHandler(async (req, res) => {
  const { emailLogin, passwordLogin } = req.body;

  if(!emailLogin || !passwordLogin){
    res.status(400)
    throw new Error('Please fill the required fields!')
  }
  const userExist = await User.findOne({ email: emailLogin });

  //User exist then:
  if (userExist && userExist.matchPassword(passwordLogin)) {
    res.status(201).json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      profilePic: userExist.profilePic,
      token: generateToken(userExist._id),
    });
  } else {
    res.status(400)
    throw new Error( "Invalid Email or Password");
  }
});

/*Handler for fetching the user list.
  Api :- /api/user?search=user
*/
const allUsers = asyncHandler(async (req, res) => {
  const user = req.query.search;
  const query = user
    ? {
        $or: [
          { name: { $regex: user, $options: "i" } },
          { email: { $regex: user, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(query, { password: 0 }).find({
      _id: { $ne: req.user._id },
    });
    return res.status(200).json(users);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;

   //Checking whether it is undefined or not.
   if (name.length == 0 || email.length == 0 || password.length == 0) {
    res.status(400)
    throw new Error('Required fields are empty!')
  }

  //Checking the user exist.
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400)
    throw new Error('User already exists!')
  }

  const transport = nodemailer.createTransport({
    service: "GMAIL",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_AUTH,
    },
  });

  const otp=Math.ceil(Math.random()*899999)+100000
  try {
    const info = await transport.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Your Account with OTP from ChatApp", // Subject line
      html: `
      <p>Hi ${name},</p>
      <p>Thanks you for signing up for ChatApp! To complete the verification of your account, please use the One-Time Password (OTP) provided below:</p>
      <h5 style="color: #0A0A0A;">Your OTP: ${otp}</h5>
      <p>This code is valid for the next <strong>10 minutes</strong>. Please enter it on the verification page to confirm your account.</p>
      <p>If you did not request this OTP or have any questions, please contact our support team.</p>
      <br>
      <p>Thank you,</p>
      <p>The ChatApp Team</p>
    `,
    });
    console.log("Email send successfully");
    return res.status(200).json({'message':otp})
  } catch (error) {
    res.status(500);
    throw new Error("Email verification failed!");
  }
});
export { registerUser, authUser, allUsers, verifyEmail };
