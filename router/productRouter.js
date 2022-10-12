const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require("../models/product");
const isAuth=require("../config/isAuth");
router.route('/')
    .post(async (req, res, next) => {
        try {
            const product = await Product.create(req.body);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
        }
        catch (err) {
            next(err);
        }
    })
    .get(async (req, res, next) => {
        try {
            res.statusCode = 200;
            res.render('productpage');
        }
        catch (err) {
            next(err);
        }
    })

router.route('/uploadcomments')
    .post(isAuth,async (req, res, next) => {
        try {
            let product = await Product.findById(req.query.id);
            product.comments.push({ reviews: req.body.reviews, rating: req.body.rating, author: req.user._id });
            const user=await User.findById(req.user._id,['name']);
            await product.save();
            res.send(user);
        }
        catch (err) {
            next(err);
        }
    })
module.exports = router;