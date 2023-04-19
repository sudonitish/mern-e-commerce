const session = require('express-session')
const dotenv = require('dotenv')

dotenv.config();
const Razorpay = require('razorpay');
const { userModel, cartModel, productModel } = require('../database/schemas')
const {
    addToCart,
    incrementCart,
    decrementCart,
    checkForZero,
    deleteCart,
    checkOutValidationOnProduct,
    confirmOrder
} = require('../methods/cart')

const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});
module.exports = {
    getProducts:(req, res) => {

        const { productNo } = req.params;

        productModel.find().skip(productNo).limit(5)
            .then((data) => {

                res.send(JSON.stringify(data))
            })
            .catch((err) => {

                res.send({ errorType: "Server Error!", error: err })
            })

    },
    myCart:(req, res) => {
        if (req.session.is_logged_in === true) {
            cartModel.find({ username: req.session.user_name })
                .then((data) => {
                    res.send(data[0])
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            res.send({ usersBag: [] })
        }
    },
    myCartInDetails:(req, res) => {
        if (req.session.is_logged_in === true) {
            cartModel.find({ username: req.session.user_name })
                .then(async (data) => {

                    let bag = [];
                    await Promise.all(data[0].usersBag.map(async (item) => {
                        const product = await productModel.findById({ _id: item.producID });
                        product.quantity = item.quantity
                        await product.save();
                        bag.push({
                            _id: product._id,
                            title: product.title,
                            description: product.description,
                            price: product.price,
                            stock: product.stock,
                            brand: product.brand,
                            quantity: item.quantity,
                            images: product.images,
                        });
                    }));
                    res.send({ usersBag: bag });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            res.send({ usersBag: [] })
        }
    },
    addToCart:(req, res) => {

        if (req.session.is_logged_in === true) {

            checkForZero({ username: req.session.user_name, id: req.query.id }, (err, quantity) => {
                if (err) {
                    console.log(err)
                }
                else {
                    if (quantity !== 0) {
                        // console.log(quantity)
                        deleteCart({ username: req.session.user_name, id: req.query.id }, (err, quantity) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                        res.send({ isLoggedIn: true, isInCart: false, stock: true })
                    }
                    else {

                        productModel.find({ _id: req.query.id })
                            .then((rdata) => {
                                if (rdata[0].stock === 0) {
                                    res.send({ isLoggedIn: true, isInCart: true, stock: false })
                                }
                                else {

                                    addToCart({ username: req.session.user_name, id: req.query.id }, (err, quantity) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            res.send({ isLoggedIn: true, isInCart: true, stock: true })

                                        }
                                    })
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                }
            })

        }
        else {
            res.send({ isLoggedIn: false, isInCart: false, stock: false })

        }
    },
    increase:(req, res) => {
        incrementCart({ username: req.session.user_name, id: req.query.id }, (err, quantity) => {
            if (!err)
                res.send({ quantity: quantity })
        })
    },
    decrease:(req, res) => {
        decrementCart({ username: req.session.user_name, id: req.query.id }, (err, quantity) => {
            if (!err)
                res.send({ quantity: quantity })
        })
    },
    placeOrderAndPay:(req, res) => {

        if (req.session.is_logged_in === true) {
            let amount = 0;
            checkOutValidationOnProduct(req.session.user_name, async (err, data) => {
                if (!err) {
                    data.usersBag.forEach(item => {
                        amount += item.quantity * item.producID.price;
                    });
                    const options = {
                        amount: amount * 100,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: "order_rcptid_11"
                    };

                    try {
                        let order = await razorpay.orders.create(options)
                        res.send({ orderID: order.id, amount: amount * 100, keyID: process.env.key_id, email: req.session.email, username: req.session.user_name });
                    }
                    catch (err) {
                        console.log(err)
                        res.send({ error: err })
                    }


                }
                else {
                    res.send({ error: 'Server Error' })
                }
            })

        }
        else {
            res.status(401).send({ error: 'Not authorized' })
        }
    },
    confirmOrder:(req, res) => {

        if (req.session.is_logged_in === true) {

            checkOutValidationOnProduct(req.session.user_name, (err, data) => {
                if (!err) {
                    confirmOrder(data, req.body, (err) => {
                        if (!err) {
                            res.send({ error: false })
                        }
                    })
                }
                else {
                    res.send({ error: err })
                }
            })
        }

    }
}