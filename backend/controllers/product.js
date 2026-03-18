
import {Product}from "../models/Product.js";
import mongoose from "mongoose";
import {rm} from "fs";


//add new product
export const createProduct = async (req, res) => {
  try {
    //check if user is admin 403- not found error
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, only admin can create product" });
    }
    const {title, description, category, price, stock,mrp} = req.body;
    const image = req.file;

    //check image is seleceted or not
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product= await Product.create({
      title,
      description,
      category,
      price,
      stock,
      mrp,
      image: image?.path,// Optional Chaining 
    });
    return res.status(201).json({ message: "Product created successfully", product });
  }
    catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//fetch all products
export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({message: "Products fetched successfully",length: products.length,products});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//fetch single product
export const fetchSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    //check if product id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }


    const product = await Product.findById(id);
    //check product availabe or not
    if (!product) {
      return res.status(404).json({ 
        message: "Product not found" 
    });
    } 
    return res.status(200).json({message: "Product fetched successfully",product});
  

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
      const id = req.params.id;

    //check user role is admin or not
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, only admin can delete product" });
    }   
   

    //check if product id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
       //SELECT PRODUCT 
    const product = await Product.findById(req.params.id);    
    if (!product) {
      return res.status(403).json({ message: "invalid product details" });
    }

    //delete image from server
    rm(product.image, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    }); 

    //delete product from database
    await Product.deleteOne();
    
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




//update product
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    //check if product id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    //check product availabe or not
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const { title, description, category, price, stock,mrp } = req.body;
    const image = req.file;

    //update product details
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.mrp = mrp ?? product.mrp;
    if (image) {
      product.image = image.path;
    }
    await product.save();
    return res.status(200).json({ message: "Product updated successfully",product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};  