const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const multer = require('multer')
const port = process.env.PORT
const init = require('./database/init')
const bodyParser=require('body-parser')
const { authenticate,destroySession, logout, resetPasswordLink, verifyToReset, resetPage, resetPassword, resetPasswordOnProfile, verifyToRegister, logMeIn, registerUser } = require('./controllers/userControllers');
const { placeOrderAndPay, decrease,addToCart, increase, myCartInDetails, myCart, getProducts,confirmOrder,showMyOrdersInDetails } = require('./controllers/consumerControllers');
const { getProductsForAdmin, addNewProduct, updateProduct, deleteProduct } = require('./controllers/adminControllers');

app.use(cors({
    origin: process.env.website,
    credentials: true
}))

const whiteList = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]
const imageMulter = multer({
    storage: multer.diskStorage({
        destination: (request, file, callback) => callback(null, "uploads"),
        filename: (request, file, callback) => callback(null, Date.now() + "_" + file.originalname)
    }),
    fileFilter: (request, file, callback) => {
        if (!whiteList.includes(file.mimetype)) {
            return callback(new Error('file is not allowed'))
        }
        callback(null, true)
    }
});
const imageUploadMiddleware = imageMulter.array('images');


init((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('database connected.')
    app.listen(port, () => {
        console.log(`Example app listening at ${process.env.url}`)
    })
})


app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public/'))
app.use(express.static('uploads'))
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

//authentication routes
app.route('/auth')
    .get(authenticate)
app.route('/logout')
    .get(logout)
app.route('/resetPasswordLink')
    .post(resetPasswordLink)
app.route('/verifyToReset')
    .get(verifyToReset)
app.route('/reset/:id/:token')
    .get(resetPage)
    .post(resetPassword)
app.route('/resetPassword')
    .post(resetPasswordOnProfile)
app.route('/verify/:username/:token')
    .get(verifyToRegister)
app.route('/signup')
    .post(registerUser)
app.route('/login')
    .post(logMeIn)
app.route('/destroySession')
.get(destroySession)


//coustomer routes
app.route('/productData/:productNo')
    .get(getProducts)
app.route('/showMyCartProducts')
    .get(myCart)
app.route('/showMyCartProductsInDetails')
    .get(myCartInDetails)
app.route('/addToCart')
    .get(addToCart)
app.route('/increase')
    .get(increase)
app.route('/decrease')
    .get(decrease)
app.route('/placeOrderAndPay')
    .get(placeOrderAndPay)
app.route('/confirmOrder')
    .post(confirmOrder)
app.route('/showMyOrdersInDetails')
   .get(showMyOrdersInDetails)

//admin routes
app.route('/getProductsForAdmin')
    .get(getProductsForAdmin)
app.route('/addProducts')
    .post(imageUploadMiddleware,addNewProduct )
app.route('/deleteProduct/:id')
    .delete(deleteProduct)
app.route('/updateProduct')
    .post(updateProduct)



app.route('/*')
    .get((req, res) => {
        res.sendFile(__dirname+'/public/index.html');
    })


