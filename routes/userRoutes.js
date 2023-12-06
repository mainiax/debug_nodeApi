const express = require('express');
const authController = require('./../controllers/authController');
const userRouter = express.Router();
const userController = require('./../controllers/userController');

const {
  GetAllUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  getUser,
} = require('./../controllers/userController');

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);

userRouter.post('/logout', authController.logout);
// password functionality
userRouter.post('/forgotPassword', authController.ForgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
//used tp protect routes after it
userRouter.use(authController.protect);
userRouter.patch('/updatePassword', authController.updatePassword);
userRouter.get(
  '/me',

  [userController.getMe, userController.getUser]
);

userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);

// userRouter.post('/resetPassword', authController.login);
userRouter.use(authController.restrictTo('admin'));
userRouter.route('/').get(GetAllUsers).post(CreateUser);

userRouter.route('/:id').patch(UpdateUser).delete(DeleteUser).get(getUser);

module.exports = userRouter;
