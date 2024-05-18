const mongoose = require('mongoose');
const adminPassword = encodeURIComponent("iwillwin")
const mongoURI='mongodb+srv://user:use123@cluster0.wccsl1s.mongodb.net/EmpireFood?retryWrites=true&w=majority';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected!');
    let fetched_data = mongoose.connection.db.collection("food_item");
    let data=await fetched_data.find({}).toArray() 
  //  global.food_item = data;
  try{
  let foodCatagory = mongoose.connection.db.collection("food_catagory");
  let catData=await foodCatagory.find({}).toArray()
    global.food_item = data;
    global.foodCatagory=catData;
  }catch(error){
    console.log('err: ', error);
  }
  } catch (error) {
    console.log('err: ', error);
  }
};
module.exports = mongoDB;

