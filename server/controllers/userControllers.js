// const session = require('express-session')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET
);
const {
} = require('../methods/product')
const {
    updatePassword,
    verifyJWT
} = require('../methods/security')
const {
    findUser,
    findUserByEmail,
    findUserByID,
    saveUserToDB,
} = require('../methods/userMethods')
const {
    validateName,
    validateUserName,
    validatePhone,
    validateEmail,
    validatePassword
} = require('../methods/validation');
const session = require('express-session');

module.exports = {
    authenticate: (req, res) => {
        const data = {
            username: req.session.user_name,
            isLoggedIn: req.session.is_logged_in,
            isAdmin: req.session.is_Admin,
            linkSend: req.session.linkSend,
            message: req.session.message,
            popupType:req.session.popupType
        }
        res.send(data)
    },
    logout: (req, res) => {

        req.session.destroy();
        res.send({
            username: '',
            isLoggedIn: false,
            isAdmin: false
        })
    },
    resetPasswordLink: (req, res) => {
        let errors = {
            emailErr: "",
        }
        let err;
        err = validateEmail(req.body.email)
        if (err) {
            errors.emailErr = err;
            res.send({ error: true, errors })
            return
        }
        findUserByEmail(req.body.email.toLowerCase(), (err, user) => {
            if (err) {
                console.log(err)
                res.send({ errorType: "Server Error!", error: err })
            }
            else {
                if (user.length === 0) {
                    errors.emailErr = "user does'st exist"
                    res.send({ error: true, errors })
                }
                else {
                    const secret = JWT_SECRET + user[0].username;
                    const payload = {
                        email: user[0].email,
                        id: user[0].id,
                    }
                    const token = jwt.sign(payload, secret, { expiresIn: '3m' })
                    const link = `${process.env.url}/reset/${user[0].id}/${token}`

                    const request = mailjet.post("send", { 'version': 'v3.1' }).request({
                            "Messages": [
                                {
                                    "From": {
                                        "Email": process.env.SENDER_EMAIL,
                                        "Name": "N Store"
                                    },
                                    "To": [
                                        {
                                            "Email": user[0].email
                                        }
                                    ],
                                    "Subject": "Reset Password",
                                    "HTMLPart": `To reset your password, please <a href=${link}>click here</a>.`
                                }
                            ]
                        });

                    request.then((result) => {
                        console.log("email send success")
                    })
                        .catch((err) => {
                            console.log("error")
                            console.log(err.statusCode, err.message)
                        });

                   
                    req.session.token = token
                    req.session.idForReset = user[0].id;
                    req.session.linkSend = true;
                    req.session.message = 'Reset link send to your email, Please verify to Continue.'
                    req.session.popupType = 'forgot'
                    res.send({ error: false, message: 'Password reset link sent to your email...' })
                    return
                }
            }
        })
    },
    verifyToReset: (req, res) => {
       
        const id = req.session.idForReset;
        const token = req.session.token;
        console.log('id:', id)
        console.log('token:', token)
        if (!id && !token) {
            res.send({ error: true, message: 'error' })
            return
        }
        findUserByID({ _id: id }, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ error: true, errorType: "Server Error!", error: err })
            }
            else {
                if (user.length === 0) {
                    res.send({ error: true, errorType: "404", error: "page not found!" });
                }
                else {
                    verifyJWT(token, JWT_SECRET + user[0].username, (err, payload) => {
                        if (err) {
                            console.log(err)
                            res.send({ error: true, errorType: "Server Error!", error: err })

                        }
                        else {

                            if (payload.id !== user[0].id) {
                                res.send({ error: true, errorType: "404", error: "page not found!" });
                            }
                            req.session.destroy();
                            res.send({ error: false, secretValues: { id: id, token: token } })
                        }
                    })
                }
            }
        })
    },
    resetPage: (req, res) => {
        const { id, token } = req.params;
        if (!id && !token) {
            res.send({ error: true, message: 'error' })
            return
        }
        findUserByID({ _id: id }, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ error: true, errorType: "Server Error!", error: err })
            }
            else {
                if (user.length === 0) {
                    res.send({ error: true, errorType: "404", error: "page not found!" });
                }
                else {
                    verifyJWT(token, JWT_SECRET + user[0].username, (err, payload) => {
                        if (err) {
                            console.log(err)
                            res.send({ error: true, errorType: "Server Error!", error: err })

                        }
                        else {

                            if (payload.id !== user[0].id) {
                                res.send({ error: true, errorType: "404", error: "page not found!" });
                            }
                            const resetPage = `<div>hello</div>
                            <script>
                            window.location.replace('`+ process.env.website + `/reset');
                            </script>
                            `;

                            res.send(resetPage)
                        }
                    })
                }
            }
        })

    },
    resetPassword: (req, res) => {
        let errors = {
            passwordErr: "",
            cpasswordErr: "",
            savedPassword: "",
            savedCPassword: "",
        }
      
        let err;
        err = validatePassword(req.body.password)
        if (err) {
            errors.passwordErr = err;
            res.send({ error: true, errors })
            return
        }
        err = validatePassword(req.body.cpassword)
        if (err) {
            errors.cpasswordErr = err;
            res.send({ error: true, errors })
            return
        }
        if (req.body.password !== req.body.cpassword) {
            errors.cpasswordErr = "password does'nt match!";
            res.send({ error: true, errors })
            return
        }
        const { id, token } = req.params;
        if (!id && !token) {
            res.send({ error: true, errors })
            return
        }
        findUserByID({ _id: id }, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ error: true, errorType: "Server Error!", error: err })
                return
            }
            else {
                if (user.length === 0) {
                    res.send({ error: true, errorType: "404", error: "page not found!" });
                    return
                }
                else {
                    const secret = JWT_SECRET + user[0].username;
                    try {
                        const payload = jwt.verify(token, secret)
                        updatePassword({ id: user[0].id, password: req.body.password }, (err) => {
                            if (err) {
                                console.log(err)
                                res.send({ error: true, errorType: "Server Error!", error: err })
                                return
                            }
                            else {
                                const request = mailjet.post("send", { 'version': 'v3.1' }).request({
                                        "Messages": [
                                            {
                                                "From": {
                                                    "Email": process.env.SENDER_EMAIL,
                                                    "Name": "N Store"
                                                },
                                                "To": [
                                                    {
                                                        "Email": user[0].email
                                                    }
                                                ],
                                                "Subject": "Reset Password",
                                                "TextPart": "Password updated successfully"
                                            }
                                        ]
                                    });

                                request.then((result) => {
                                        console.log("email send success")
                                    })
                                    .catch((err) => {
                                        console.log(err.statusCode, err.message)
                                    });
                                res.send({ error: false, message: 'Password updated successfully...' })
                                console.log('password updated successfully')
                                return

                            }
                        })
                    }
                    catch (err) {
                        console.log(err)
                        res.send({ error: true, errorType: "Server Error!", error: err })
                        return
                    }
                }
            }
        })
    },
    resetPasswordOnProfile: (req, res) => {
        let errors = {
            opasswordErr: "",
            passwordErr: "",
            cpasswordErr: "",
        }
        console.log(req.body)

        let err;
        err = validatePassword(req.body.password)
        if (err) {
            errors.passwordErr = err;
            res.send({ success: false, errors })
            return
        }
        err = validatePassword(req.body.cpassword)
        if (err) {
            errors.cpasswordErr = err;
            res.send({ success: false, errors })
            return
        }
        if (req.body.password !== req.body.cpassword) {
            errors.cpasswordErr = "password does'nt match!";
            res.send({ success: false, errors })
            return
        }

        findUser(req.session.user_name, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ success: false, errors })
            }
            else {
                if (user.length === 0) {
                    res.send({ errorType: "Server Error!", error: 'something went wrong' });
                }
                else {
                    if (!bcrypt.compareSync(req.body.opassword, user[0].password)) {
                        errors.opasswordErr = 'incorrect password'
                        res.send({ success: false, errors })
                        return
                    }
                    else {
                        updatePassword({ id: user[0].id, password: req.body.password }, (err) => {
                            if (err) {
                                console.log(err)
                                res.send({ success: false, errors })

                            }
                            else {
                                req.session.destroy();

                                const transporter = mailjet
                                    .post("send", { 'version': 'v3.1' })
                                    .request({
                                        "Messages": [{
                                            "From": {
                                                "Email": process.env.SENDER_EMAIL,
                                                "Name": "N Store 👻"
                                            },
                                            "To": [{
                                                "Email": user[0].email,
                                            }],
                                            "Subject": "Reset Password ✔",
                                            "TextPart": "password updated successfully",
                                        }]
                                    });

                                transporter
                                    .then((result) => {
                                        console.log("email send success");
                                    })
                                    .catch((err) => {
                                        console.log(err.statusCode, err.message);
                                    });
                                res.send({ success: true })
                                console.log('password updated successfully')
                                return

                            }
                        })
                    }
                }
            }
        })

    },
    verifyToRegister: (req, res) => {
        const { username, token } = req.params;
        verifyJWT(token, JWT_SECRET + username, (err, payload) => {
            if (err) {
                console.log(err)
                res.send({ errorType: "Server Error!", error: err })

            }
            else {
                findUser(payload.username, (err, user) => {
                    if (err) {
                        console.log(err)
                        res.send({ errorType: "Server Error!", error: err })
                    }
                    else {
                        if (user.length !== 0) {
                            res.send({ error: true, message: 'username already exists' })
                        }
                        else {

                            saveUserToDB(payload, (err) => {
                                if (err) {
                                    res.send({ error: true, errorType: "Server Error!", error: err })
                                    console.log('error saving')
                                }
                                else {


                                    let transporter = mailjet.post("send", { 'version': 'v3.1' }).request({
                                        "Messages": [{
                                            "From": {
                                                "Email": process.env.SENDER_EMAIL,
                                                "Name": "N Store 👻"
                                            },
                                            "To": [{
                                                "Email": payload.email,
                                            }],
                                            "Subject": " Email Verification ✔",
                                            "TextPart": "Email Verified successfully",
                                        }]
                                    });

                                    transporter.then((result) => {
                                        console.log("email send success");
                                    }).catch((err) => {
                                        console.log(err);
                                    });

                                    const sendPage = `<div>hello</div>
                                    <script>
                                    window.location.replace('`+ process.env.website + `/');
                                    </script>
                                    `;

                                    res.send(sendPage);
                                    return;
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    
    registerUser: (req, res) => {
        let errors = {
            nameErr: "",
            usernameErr: "",
            phoneErr: "",
            emailErr: "",
            passwordErr: "",
            cpasswordErr: "",
        }
        let err;
        err = validateName(req.body.name);
        if (err) {
            errors.nameErr = err;
            res.send({ error: true, errors })
            return;
        }
        err = validateUserName(req.body.username)
        if (err) {
            errors.usernameErr = err;
            res.send({ error: true, errors })
            return
        }
        err = validatePhone(req.body.phone)
        if (err) {
            errors.phoneErr = err;
            res.send({ error: true, errors })
            return
        }
        err = validateEmail(req.body.email)
        if (err) {
            errors.emailErr = err;
            res.send({ error: true, errors })
            return
        }
        err = validatePassword(req.body.password)
        if (err) {
            errors.passwordErr = err;
            res.send({ error: true, errors })
            return
        }
        err = validatePassword(req.body.cpassword)
        if (err) {
            errors.cpasswordErr = err;
            res.send({ error: true, errors })
            return
        }
        if (req.body.password !== req.body.cpassword) {
            errors.cpasswordErr = "password does'nt match!";
            res.send({ error: true, errors })
            return
        }
        findUserByEmail(req.body.email, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ error: true, errorType: "Server Error!", error: err })
            }
            else {
                if (user.length !== 0) {
                    errors.emailErr = "email already exisits"
                    res.send({ error: true, errors })
                }
                else {
                    findUser(req.body.username, (err, user) => {
                        if (err) {
                            console.log(err)
                            res.send({ error: true, errorType: "Server Error!", error: err })
                        }
                        else {
                            if (user.length !== 0) {
                                errors.usernameErr = "username already exists"
                                res.send({ error: true, errors })
                            }
                            else {

                                const secret = JWT_SECRET + req.body.username;
                                const payload = {
                                    name: req.body.name,
                                    username: req.body.username,
                                    phone: req.body.phone,
                                    email: req.body.email,
                                    password: req.body.password,
                                    isAdmin: false

                                }
                                const token = jwt.sign(payload, secret, { expiresIn: '5m' })
                                const link = `${process.env.url}/verify/${payload.username}/${token}`

                                console.log(link);
                                let transporter = mailjet.post("send", { 'version': 'v3.1' }).request({
                                    "Messages": [{
                                        "From": {
                                            "Email": process.env.SENDER_EMAIL,
                                            "Name": "N Store 👻"
                                        },
                                        "To": [{
                                            "Email": req.body.email,
                                            "Name": ""
                                        }],
                                        "Subject": " Email Verification ✔",
                                        "HTMLPart": `To verify email address <a href=${link}>click</a> here.`,
                                    }]
                                });

                                transporter
                                    .then(result => {
                                        console.log("email send success");
                                        req.session.linkSend = true;
                                        req.session.message = 'Verification link send to your email, Please verify to Continue.'
                                        req.session.popupType = 'signup'
                                        res.send({ error: false, message: 'Please verify your email address,verification email send to your email...' })

                                        return
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });

                            }
                        }
                    })
                }
            }
        })
    },
    logMeIn: (req, res) => {
        let errors = {
            usernameErr: "",
            passwordErr: "",
        }
        let err;
        err = validateUserName(req.body.username)
        if (err) {
            errors.usernameErr = err;
            res.send({ isError: true, errors })
            return
        }
        findUser(req.body.username, (err, user) => {
            if (err) {
                console.log(err)
                res.send({ isError: true, errors })
            }
            else {

                if (user.length !== 0) {

                    if (!bcrypt.compareSync(req.body.password, user[0].password)) {
                        errors.passwordErr = "password does'nt match!";
                        res.send({ isError: true, errors })
                    }
                    else {
                        req.session.is_logged_in = true;
                        req.session.user_name = req.body.username;
                        req.session.is_Admin = user[0].isAdmin;
                        req.session.email = user[0].email;
                        res.send({ isError: false, isAdmin: user[0].isAdmin })
                    }
                }
                else {
                    errors.passwordErr = "user not found";
                    res.send({ isError: true, errors })
                    return
                }
            }
        })

    },
    destroySession(req, res) {
    req.session.destroy();
    }
}