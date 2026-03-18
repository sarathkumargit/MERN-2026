import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { upload } from '../middleware/multer.js';
import { createProduct } from '../controllers/product.js';
import { fetchAllProducts } from '../controllers/product.js';
import { fetchSingleProduct } from '../controllers/product.js'; 
import { deleteProduct } from '../controllers/product.js';
import { updateProduct } from '../controllers/product.js';


const router = express.Router();
router.post("/product/new", isAuth,upload,createProduct)
router.get("/products/all-products",fetchAllProducts);
router.get("/products/single/:id",fetchSingleProduct);
router.delete("/products/:id",isAuth,deleteProduct);
router.put("/products/:id", isAuth, upload, updateProduct);
export default router;
