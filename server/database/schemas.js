const mongoose = require('mongoose')

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  username: String,
  phone: Number,
  email: String,
  password: String,
  isAdmin: Boolean,
});

const productSchema = new Schema({

  title: String,
  description: String,
  price: Number,
  stock: Number,
  brand: String,
  thumbnail: String,
  images: [String]
})

const cartSchema = new Schema({
  
  username: String,
  usersBag: [
    {
      producID: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,

    }
  ]
});
const orderHistorySchema = new Schema({
  // String is shorthand for {type: String}
  username: String,
  products: [{
    producID: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: Number,
    status: String,
    signature: String,
    orderId: String,
    paymentId:String
  }]
});

const userModel = mongoose.model('user', userSchema)
const productModel = mongoose.model('products', productSchema)
const cartModel = mongoose.model('carts', cartSchema)
const orderHistoryModel = mongoose.model('orders', orderHistorySchema)

module.exports = { userModel, productModel, cartModel,orderHistoryModel };