const { productModel } = require('../database/schemas')

module.exports = {
    saveProductToDB: async function (product, callback) {
        productModel.create(product)
            .then((rProduct) => {
                callback(null)
            })
            .catch((err) => {
                callback(err)
            })
    },
    deleteProduct: async function (id, callback) {
        await productModel.deleteOne({ _id: id })
            .then(() => {
                callback(null)
            })
            .catch(err => {
                callback(err)
            })
    },
    updateProduct: async function (data, callback) {
        await productModel.findOneAndUpdate({ _id: data._id }, { $set: { title: data.title, brand: data.brand, description: data.description, price: data.price, stock: data.stock } })
            .then(() => {
                callback(null)
            })
            .catch(err => {
                callback(err)
            })
    }
}
