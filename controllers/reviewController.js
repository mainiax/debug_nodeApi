const catchAsync = require('../utils/catchAsync');
const ReviewModel = require('./../model/reviewModel');
const factory = require('./handlerFactory');

// exports.CreateReview = catchAsync(async function (req, res, next) {
//   const newReview = await ReviewModel.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       reView: newReview,
//     },
//   });
// });
exports.setTourUserIds = (req, res, next) => {
  //nested route step 2
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.GetallReviews = catchAsync(async function (req, res, next) {
//   //nested endpoint
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const review = await ReviewModel.find(filter);
//   res.status(200).json({
//     status: 'Success',
//     ReviewCount: review.length,
//     data: review,
//   });
// });
exports.GetallReviews = factory.GetAll(ReviewModel);
exports.CreateReview = factory.createOne(ReviewModel);
exports.deleteReview = factory.deleteOne(ReviewModel);
exports.updateReview = factory.UpdateOne(ReviewModel);
exports.getReview = factory.getOne(ReviewModel);
