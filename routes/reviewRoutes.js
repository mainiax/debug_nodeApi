const express = require('express');

const authController = require('./../controllers/authController');
const {
  GetallReviews,
  CreateReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('./../controllers/reviewController');

//to allow usage of by tour for nested routes
const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.use(authController.protect);
reviewRouter
  .route('/')
  .get(GetallReviews)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    setTourUserIds,
    CreateReview
  );

reviewRouter
  .route('/:id')
  .get(getReview)
  .delete(authController.restrictTo('user', 'admin'), deleteReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview);

module.exports = reviewRouter;
