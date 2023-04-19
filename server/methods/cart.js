const { cartModel, orderHistoryModel } = require('../database/schemas')
 async function checkForZero(data, callback) {
    await cartModel.find({ username: data.username })
        .then((rdata) => {

            let index = rdata[0].usersBag.findIndex((product) => {
                return data.id === product.producID.toString();
            })

            if (index === -1) {
                callback(null, 0)
            }
            else if (rdata[0].usersBag[index].quantity === 0) {
                deleteCart(data, callback)
            }
            else {
                callback(null, rdata[0].usersBag[index].quantity)
            }
        })
        .catch((err) => {
            callback(err, null)
        })
}
 async function pushToCart(data, callback) {
    await cartModel.findOneAndUpdate({ username: data.username },
        { $push: { usersBag: { producID: data.id, quantity: 1 } } })
        .then((rCart) => {
            callback(null, 1)
        })
        .catch((err) => {
            callback(err, null)
        })
}
async function deleteCart(data, callback) {
    await cartModel.findOneAndUpdate({ username: data.username },
        { $pull: { usersBag: { producID: data.id } } })
        .then((rCart) => {
            callback(null, 0)
        })
        .catch((err) => {
            callback(err, null)
        })
}
module.exports = {
    addToCart: async function (data, callback) {

        await cartModel.find({ username: data.username, usersBag: { $elemMatch: { producID: data.id } } })
            .then((rdata) => {
                if (!rdata[0]) {
                    pushToCart(data, callback)
                }
                else {
                    incrementCart(data, callback)
                }

            })
            .catch((err) => {
                callback(err, null)
            })

    },
    incrementCart: async function (data, callback) {

        await cartModel.findOneAndUpdate({ username: data.username, usersBag: { $elemMatch: { producID: data.id } } }, { $inc: { "usersBag.$.quantity": 1 } })
            .then((rdata) => {
                checkForZero(data, callback)
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    decrementCart: async function (data, callback) {
        await cartModel.findOneAndUpdate({ username: data.username, usersBag: { $elemMatch: { producID: data.id } } }, { $inc: { "usersBag.$.quantity": -1 } })
            .then((rdata) => {

                checkForZero(data, callback)
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    checkForZero,
    deleteCart,
    checkOutValidationOnProduct: async function (user_name, callback) {

        cartModel.find({ username: user_name }, null, { populate: "usersBag.producID" })
            .then((data) => {
                callback(null, data[0])
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    confirmOrder: async function (data, order, callback) {

        data.usersBag.forEach(item => {

            orderHistoryModel.findOneAndUpdate({ username: data.username },
                { $push: { products: { producID: item.producID.id, quantity: item.quantity, status: "confirmed", signature: order.signature, orderId: order.orderID, paymentId: order.paymentID } } })
                .then((rCart) => {
                    cartModel.updateOne({ username: data.username }, { $set: { usersBag: [] } })
                        .then((pdata) => {
                            callback(null, pdata)
                        })
                        .catch((err) => {
                            callback(err, null)
                        })
                })
                .catch((err) => {
                    callback(err, null)
                })
        })

    }
}
