import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util.js';
import data from '../data.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const name = req.query.name || '';  //req.query trả về {name: "name"}
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}; //options: 'i' : match chữ hoa chữ thường

    const category = req.query.category || '';
    const categoryFilter = category ? {category} :{};
    const products = await Product.find({...nameFilter, ...categoryFilter});
    res.send(products);
  })
);  

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);
//category
productRouter.get('/categories', expressAsyncHandler(async(req,res) => {
  const categories = await Product.find().distinct('category');
  res.send(categories);
}));

//add vao gio hang
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

// API to create product (Admin )
productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'product ' + Date.now(), // tránh tạo 2 tên trùng nhau
      image: '/images/img1.jpg',
      price: 0,
      category: 'category',
      brand: 'brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'description',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
//create API for update product
productRouter.put("/:id",isAuth, isAdmin, expressAsyncHandler(async (req,res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        if(updatedProduct) {
            return res.send({message: 'Product Updated', product: updatedProduct});  
        }
    } else {
      res.status(404).send({message: 'Product not found'});
    }
     
    
})
);
//create API for delete product
productRouter.delete("/:id",isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        const deleteProduct = await product.remove();
        res.send({message: 'Product Deleted', product:deleteProduct});
    }
    else{
        res.status(404).send({message: 'Product not found'});
    }
}));




export default productRouter;