const mongodb = require('mongodb')
const Product = require("../models/product")

exports.getAdminProducts = async (req,res,next) => {
  try {
    const products = await Product.find({userId : req.user._id}).populate('userId', 'username')
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    console.log(err)
  }
};
  

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
} 

exports.postAddProduct = async(req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const product = new Product({title: title,price: price,description: description,imageUrl: imageUrl, userId: req.session.user})
  try {
    await product.save()
  } catch (err) {
    console.log(err)
  }
  res.redirect('/');
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId)
  if (!product) {
        return res.redirect('/');
  }
  res.render('admin/edit-product', {
  pageTitle: 'Edit Product',
  path: '/admin/edit-product',
  editing: true,
  product: product
  })
}

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  try {
    const product = await Product.findById(prodId)
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    product.title = updatedTitle
    product.imageUrl = updatedImageUrl
    product.price = updatedPrice
    product.description = updatedDescription
    await product.save()
    res.redirect('/admin/products')
  } catch(err) {
    console.log(err)
  }
} 

exports.postDeleteProduct = async (req,res,next) => {
  const prodId = req.body.productId;
  try {
    await Product.deleteOne({_id: prodId, userId: req.user._id})
  } catch (err) {
    console.log(err)
  }
  res.redirect('/admin/products')
}