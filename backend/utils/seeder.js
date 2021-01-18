const Product = require("./../models/product");
const dotenv = require("dotenv");
const connect = require("./../config/database");

const products = require("../data/products")

//setting dotenv file
dotenv.config({ path: "backend/config/config.env"});

connect();

const seedProducts = async() => {
  try {
    await Product.deleteMany(); //vai deletar toda a colelction de products
    console.log("Products are deleted")

    await Product.insertMany(products);
    console.log("all products are added");
    
    process.exit(); 
    
  } catch(error) {
    console.log(error.message);
    process.exit;
  }
}

seedProducts();