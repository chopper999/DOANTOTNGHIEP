import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { generateToken, isAuth, isAdmin } from '../util.js';
import bcrypt from 'bcryptjs';
import userModel from './../models/userModel';
import data from '../data';
import sendMail from './../sendMail';

import {google} from 'googleapis';
import Order from '../models/orderModel';

const {OAuth2} = google.auth
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const userRouter = express.Router();


userRouter.get('/seed', async (req, res) => {
  const createUsers = await userModel.insertMany(data.users);
  res.send({createUsers});
});

//signin
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }); //check email co ton tai trong userModel khong
    if (user) { //neu co ton tai user thi check pass
      if (bcrypt.compareSync(req.body.password, user.password)) { //email va password lay tu ben front-end
        res.send({      //backend respone cho frontend
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user)  //lay token de authenticate next request, nhung request yeu cau authenticate se dung token, khong can dang nhap lai
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);
  

// REGISTER ROUTE
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    if (!validateEmail(req.body.email)) {
      res.status(500).send({message: "Invalid Email!"});
    }
    else if(req.body.password.length < 6) {
      res.status(500).send({message: "Password must be at least 6 characters!"});
    }
    
    else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
      });
    }
  })
);

//forgot password
userRouter.post("/forgot", expressAsyncHandler(async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    
    if (!user) {
      res.status(400).send({message: "This email is not exist !"});

      const token = generateToken(user);
      const url = `${process.env.CLIENT_URL}/user/reset/${token}`

      sendMail(email,url, "Reset your password")
        res.send({message: "Re-send your password, please check your mail"})
    }
    
  } catch (err) {
    res.status(500).send({message: err.message});
  }
}))


//user detail
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);
//API for user update
userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
      user.seller.description = req.body.sellerDescription || user.seller.description;
    }
    if (req.body.password){
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    res.send({ //send data to frontend
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      token: generateToken(updatedUser),
    });
  }
}));

//API for list user
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments({});
  const users = await User.find({}).sort({_id: -1}).skip(pageSize*(page-1)).limit(pageSize);  //return all users
  res.send({users, page, pages: Math.ceil(count/pageSize)});
}));

//API delete User by Admin
userRouter.delete("/:id",isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(user) {
    if (user.isAdmin){
      res.status(400).send({message: 'Can not delete Admin!'});
      return;
    }
    const deleteUser = await user.remove();
    res.send({message: 'User Deleted', user: deleteUser});
  }
  else{
      res.status(404).send({message: 'User not found'});
  }
}));

//API update user
//create API for update product
userRouter.put("/:id",isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      if(updatedUser) {
          return res.send({message: 'User Updated', user: updatedUser});  
      }
  } else {
    res.status(404).send({message: 'User not found'});
  }
   
  
})
);

export default userRouter;

