
module.exports = {
    validateName: function (name) {
        let nameRegex = /^[a-zA-Z]{1}[a-zA-z ]{0,19}$/;
        if (!nameRegex.test(name)) {
            return "invalid name format!"
        }
        return null
    },
    validateUserName: function (username) {
        let usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,10}$/;;
        if (!usernameRegex.test(username)) {
            return ("invalid username format!")
        }
        return (null)
    },
    validatePhone: function (phone) {
        let phoneRegex = /^[4-9]{3}[0-9]{7}$/;
        if (!phoneRegex.test(phone)) {
            return ("invalid phone number format!")
        }
        return (null)
    },
    validateEmail: function (email) {
        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
        if (!emailRegex.test(email)) {
            return ("(invalid email! (abc@xyz.com))")
        }
        return (null)
    },
    validatePassword: function (password) {
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (!passwordRegex.test(password)) {
            return ("invalid password format!")
        }
        return (null)

    }
}