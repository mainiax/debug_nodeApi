const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('../../model/tourmodel');
const Review = require('../../model/reviewModel');
const User = require('../../model/userModel');

//replacing connection string password
const DB = process.env.DATABASEN.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)
  .replace('<USERNAME>', process.env.DBUSERNAME)
  .replace('<DATABASE_NAME>', process.env.DBName);

mongoose.set('strictQuery', false);
try {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log('Database Connected');
    });
} catch (err) {
  console.log(err);
}

///Read jsonFiles
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
console.log(tours);

//import json into Db
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully out');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
//import command node dev-data/data/import-dev-data.js --import
