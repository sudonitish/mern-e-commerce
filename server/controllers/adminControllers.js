const session = require('express-session')

const { productModel } = require('../database/schemas')
const {
    saveProductToDB,
    deleteProduct,
    updateProduct
} = require('../methods/product')
module.exports = {
    getProductsForAdmin: (req, res) => {
        productModel.find()
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                console.log(err)
            })

    },
    addNewProduct: (req, res) => {

        let errors = {
            brandErr: "",
            titleErr: "",
            descriptionErr: "",
            priceErr: "",
            stockErr: "",
            imagesErr: "",
        }
        //validation is pending...
        let product = {
            brand: req.body.brand,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            images: []
        }
        if (product.brand.trim() === '' || product.title.trim() === '' || product.description.trim() === '' || product.price.trim() === '' || product.stock.trim() === '' || !req.files[0]) {
            res.send({ error: true, errors })
        }
        else {
            req.files.forEach(image => {
                product.images.push(image.filename)
            })

            saveProductToDB(product, (err) => {
                if (err) {
                    res.send({ error: true, errors })
                }
                else {
                    res.send({ error: false, errors })
                }
            })
        }



    },
    deleteProduct: (req, res) => {
        const { id } = req.params;
        if (req.session.is_Admin && req.session.is_logged_in) {
            deleteProduct(req.query.id, (err) => {
                if (!err)
                    res.send({ deleted: true })
                else
                    res.send({ deleted: false })
            })
        }
    },
    updateProduct: (req, res) => {
        if (req.session.is_Admin && req.session.is_logged_in) {
            updateProduct(req.body, (err) => {
                if (!err)
                    res.send({ updated: true })
                else {
                    res.send({ updated: false })
                }
            })
        }
    }
}