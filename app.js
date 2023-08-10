const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const url = "mongodb://localhost:27017";
const dbName = "farmSrm";

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Schema = mongoose.Schema;
const productSchema = new Schema({
  cropName: String,
  cropPrice: Number,
});

const Product = mongoose.model("Product", productSchema, "products");

app.get("/", (req, res) => {
  res.render("Welcome");
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("products", { products });
});

app.get("/addProduct", (req, res) => {
  res.render("addProduct");
});

app.post("/addProduct", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    await Product.insertMany(newProduct);
    res.redirect("/products");
  } catch (error) {
    console.error("Error adding product:", error);
    res.redirect("/addProduct");
  }
});

app.listen(3000, () => {
  console.log("Running on 3000");
});
