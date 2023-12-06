const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// exports.GetAllUsers = catchAsync(async (req, res, next) => {
//   const user = await User.find();
//   res.status(200).json({
//     status: 'Success',
//     result: user.length,
//     data: user,
//   });
// });
exports.CreateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined please use /signup instead',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  //create an error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route not for password updates please use /updatePassword',
        400
      )
    );
  }

  //update document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //2 update user document
  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
//do not update passwords with this
exports.UpdateUser = factory.UpdateOne(User);
exports.DeleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.GetAllUsers = factory.GetAll(User);
