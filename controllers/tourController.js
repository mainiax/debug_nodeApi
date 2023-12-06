//const fs = require('fs');

const TourModel = require('../model/tourmodel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

const factory = require('../controllers/handlerFactory');
const AppError = require('../utils/appError');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// exports.CreateTour = (req, res) => {
//   //console.log(req.body);

//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// exports.GetAllTours = async (req, res) => {
//   try {
//     //for api filtering excluding lines for better sorting building
//     //1 filtering

//     //gte, gt,lte,lt to be replaced

//     // let query = TourModel.find(JSON.parse(queryStr));
//     //features
//     //1) sorting
//     // if (req.query.sort) {
//     //   const sortby = req.query.sort.split(',').join(' ');
//     //   query = query.sort(sortby);
//     // } else {
//     //   query = query.sort('-createdAt');
//     // }

//     //2) field limiting
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select('-__v');
//     // }
//     //3) pagination
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;
//     // query = query.skip(skip).limit(limit);

//     // //handle user moving out of index of data
//     // if (req.query.page) {
//     //   const numTours = await TourModel.countDocuments();
//     //   if (skip >= numTours) throw new Error('This is page does not exist');
//     // }
//     //Execute query
//     const features = new APIFeatures(TourModel.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();
//     const tours = await features.query;

//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       requestedAt: req.requestTime,
//       message: err.message,
//     });
//   }
// };

// exports.CreateTour = catchAsync(async (req, res, next) => {
//   const newTour = await TourModel.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });
// exports.getOneTour = catchAsync(async (req, res, next) => {
//   const tour = await TourModel.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.UpdateTour = catchAsync(async (req, res, next) => {
//   const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tourId = mongoose.Types.ObjectId(req.params.id);
//   const tour = await TourModel.findByIdAndDelete(tourId);

//   if (!tour) {
//     return next(new AppError('no tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     message: 'Tour has been deleted',
//   });
// });
exports.GetAllTours = factory.GetAll(TourModel);
exports.deleteTour = factory.deleteOne(TourModel);
exports.UpdateTour = factory.UpdateOne(TourModel);
exports.CreateTour = factory.createOne(TourModel);
exports.getOneTour = factory.getOne(TourModel, { path: 'reviews' });
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
// '/tours-within/:distance/center/:latlng/unit/:unit'
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 63781.1;
  console.log(distance, lat, lng, unit);
  if (!lat || !lng) {
    return next(new AppError('please provide lat and lng ', 400));
  }

  const tours = await TourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async function (req, res, next) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  console.log(lat, lng, unit);
  if (!lat || !lng) {
    return next(new AppError('please provide lat and lng ', 400));
  }

  const distances = await TourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: 'distance',
        // Include additional options if necessary
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
    // You can add additional aggregation stages if needed
  ]);

  console.log(distances);
  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});
