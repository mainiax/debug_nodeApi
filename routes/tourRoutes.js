const express = require('express');

const { protect } = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
//const { checkID } = require('./../controllers/tourController');
//tourRouter.param('id', checkID);

const tourRouter = express.Router();
const {
  GetAllTours,
  CreateTour,
  getOneTour,
  UpdateTour,
  deleteTour,
} = require('./../controllers/tourController');
//nested routes
tourRouter.use('/:tourId/reviews', reviewRouter);
//impelment aliasing route
tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.GetAllTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter
  .route('/monthly-plan:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRouter
  .route('/')
  .get(protect, GetAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    CreateTour
  );
tourRouter
  .route('/:id')
  .get(getOneTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    UpdateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

//review routing nested routing step1
// tourRouter
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.CreateReview
//   );
module.exports = tourRouter;
