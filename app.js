const express = require('express');
const GlobalError = require('./controllers/errorController');
const path = require('path');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
console.log(process.env.NODE_ENV);

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' http://127.0.0.1:3000 ws://localhost:56875/"
  );
  next();
});
app.set('view engine', 'pug');
//serving folders from a folder
//body parser
app.set('views', path.join(__dirname, 'views'));
//static files
app.use(express.static(path.join(__dirname, 'public')));
//using middleware
//cors

// const corsOptions = {
//   origin: 'http://localhost:3000/', // Replace with your client app's URL
//   credentials: true, // Allow cookies and authentication headers
// };

// // Use the cors middleware with the specified options
// app.use(cors(corsOptions));
//1) Global Middleware
//set security http
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src  'self' api.mapbox.com",
    "script-src-elem 'self' api.mapbox.com"
  );
  next();
});
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//development logging
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
//limit requests from same api
// const limiter = rateLimit({
//   max: 3,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour',
// });
// app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParse());

//Data sanitization against  noSql query injection
app.use(mongoSanitize());

//Data sanitization against kss
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//app.use(express.static(`public`));

//test middleware
app.use((req, res, next) => {
  //console.log('Hello from the Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);

  next();
});
//reading from file

// connect to server
//

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message:`'can't find ${req.originalUrl} on this server`
  // })
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server`, 400));
});
app.use(GlobalError);
module.exports = app;
