import { url } from "../src/config"

async function Products(productNo) {
    
    try {
        const response = await fetch(`${url}/productData/${productNo}`, {
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
async function MyCart() {
    try {
        const response = await fetch(`${url}/showMyCartProducts`, {
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
async function AddToCart(id) {
    try {
        const response = await fetch(`${url}/addToCart?id=${id}`, {
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
async function MyCartInDetails() {
    try {
        const response = await fetch(`${url}/showMyCartProductsInDetails`, {
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
async function Increase(id) {
    try {
        const response = await fetch(`${url}/increase?id=${id}`, {
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
async function Decrease(id) {
    try {
        const response = await fetch(`${url}/decrease?id=${id}`, {
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
    Products,
    MyCart,
    AddToCart,
    MyCartInDetails,
    Increase,
    Decrease
}