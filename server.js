const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
//replacing connection string password
const DB = process.env.DATABASEN.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)
  .replace('<USERNAME>', process.env.DBUSERNAME)
  .replace('<DATABASE_NAME>', process.env.DBName);

mongoose.set('strictQuery', false);
(async () => {
  try {
    const con = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected');
    // You can proceed with other operations that depend on the database connection here.
  } catch (error) {
    console.error('Database Connection Error:', error);
    // Handle the error as needed.
  }
})();

// const testTour = new TourModel({
//   name: 'The Forest Hiker',
//   rating: 4.6,
//   price: 494,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('error :', err);
//   });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
//handling unhandled exceptions
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
