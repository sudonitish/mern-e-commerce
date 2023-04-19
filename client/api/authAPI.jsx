import { url } from "../src/config"

async function CheckForAuthentication() {
    try{
        const response = await fetch(`${url}/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendSignupRequest(data) {
    const payload = {
        name: data.savedName,
        username: data.savedUsername,
        phone: data.savedPhone,
        email: data.savedEmail,
        password: data.savedPassword,
        cpassword: data.savedCpassword
    }

    try {
        const response = await fetch(`${url}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }

}
async function SendLoginRequest(data) {
    const payload = {
        username: data.savedUsername,
        password: data.savedPassword
    }
   
   try {
        const response = await fetch(`${url}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
       return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendLogoutRequest() {
    try {
        const response = await fetch(`${url}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendNewPassword(data) {
    const payload = {
        opassword: data.savedOPassword,
        password: data.savedPassword,
        cpassword: data.savedCpassword
    }
    try {
        const response = await fetch(`${url}/resetPassword`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(payload)
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendResetPasswordLink(data) {
    const payload = {
        email: data.savedEmail
    }
    try {
        const response = await fetch(`${url}/resetPasswordLink`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(payload)
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function VerifyToReset() {
    try {
        const response = await fetch(`${url}/verifyToReset`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendNewPasswordForForgot(data,secretValues) {
    const payload = {
        password: data.savedPassword,
        cpassword: data.savedCpassword
    }
    const {id,token} = secretValues
    try {
        const response = await fetch(`${url}/reset/${id}/${token}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(payload)
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function DestroySession() {
    try {
        const response = await fetch(`${url}/destroySession`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
export {
    SendLoginRequest,
    SendSignupRequest,
    SendLogoutRequest,
    CheckForAuthentication,
    SendNewPassword,
    SendResetPasswordLink,
    VerifyToReset,
    SendNewPasswordForForgot,
    DestroySession
}