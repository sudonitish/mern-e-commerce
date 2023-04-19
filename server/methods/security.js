const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { userModel } = require('../database/schemas')
 async function createSecurePassword(password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)
    return password;
}
module.exports = {
    createSecurePassword,
    updatePassword: async function (user, callback) {
        user.password = await createSecurePassword(user.password)
        userModel.findOneAndUpdate({ _id: user.id }, { password: user.password })
            .then((user) => {
                callback(null)
            })
            .catch((err) => {
                callback(err)
            })
    },
    verifyJWT: async function (token, secret, callback) {

        try {
            const payload = await jwt.verify(token, secret);
            callback(null, payload)
        }
        catch (err) {
            callback(err, null)
        }
    }
}