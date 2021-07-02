import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util.js';
import data from '../data.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    
    const category = req.query.category || '';
    const name = req.query.name || '';  //req.query trả về {name: "name"}
    const order = req.query.order || '';
    const min = req.query.min && Number(req.query.min) !==0 ? Number(req.query.min):0;
    const max = req.query.max && Number(req.query.max) !==0 ? Number(req.query.max):0;
    const rating = req.query.rating && Number(req.query.rating) !==0 ? Number(req.query.rating):0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}; //options: 'i' : match chữ hoa chữ thường
    const categoryFilter = category ? {category} :{};
    
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.countDocuments({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    }).sort(sortOrder).skip(pageSize * (page - 1)).limit(pageSize);
    res.send({products, page, pages: Math.ceil(count / pageSize)});
  })
);  


//api for top product has best Rating
productRouter.get("/top", expressAsyncHandler(async (req, res) => {
  const topProducts = await Product.find().sort({'rating':-1}).limit(3);
  res.send(topProducts);
}));


productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const createdProducts = await Product.insertMany(products);
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

//API for create Reviews

productRouter.post("/:id/reviews",isAuth, expressAsyncHandler(async (req,res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
      if(product.reviews.find((x)=> x.name === req.user.name)) {
        return res.status(400).send({message: "You already reviewed!"});
      }
      const review = {name:req.user.name, rating: Number(req.body.rating), comment: req.body.comment};
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((a,c) => c.rating + a, 0)/ product.reviews.length; //Lay trung binh
      const updatedProduct = await product.save();
      res.status(201).send({message: 'Review Created', review: updatedProduct.reviews[updatedProduct.reviews.length - 1]});  //Lay review moi nhat
  } else {
    res.status(404).send({message: 'Review not found'});
  }
   
  
})
);



export default productRouter;