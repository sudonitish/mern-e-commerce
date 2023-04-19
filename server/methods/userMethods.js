const { userModel, cartModel, orderHistoryModel } = require('../database/schemas')
const { createSecurePassword } = require('./security')
module.exports = {
    findUser: function (username, callback) {
        userModel.find({ username: username })
            .then((user) => {
                callback(null, user)
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    findUserByEmail: function (email, callback) {
        userModel.find({ email: email })
            .then((user) => {
                callback(null, user)
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    findUserByID: function (id, callback) {
        userModel.find({ _id: id })
            .then((user) => {
                callback(null, user)
            })
            .catch((err) => {
                callback(err, null)
            })
    },
    saveUserToDB: async function (user, callback) {
        user.password = await createSecurePassword(user.password);
        user.email = user.email.toLowerCase();
        userModel.create(user)
            .then((rUser) => {
                saveUserToCart(user.username, (err) => {
                    if (!err) {
                        saveUserToOrderHistory(user.username, (err) => {
                            if (!err) {
                                callback(null)
                            }
                        })
                    }
                })
            })
            .catch((err) => {
                callback(err)
            })
    },
}
async function saveUserToCart (username, callback) {
    cartModel.create({ username: username })
        .then((rCart) => {
            callback(null)
        })
        .catch((err) => {
            callback(err)
        })
}
 async function saveUserToOrderHistory(username, callback) {
    orderHistoryModel.create({ username: username })
        .then((rCart) => {
            callback(null)
        })
        .catch((err) => {
            callback(err)
        })
}