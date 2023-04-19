
import { url } from "../src/config"
async function SendSavedProductData(formData) {
    try {
        const response = await fetch(`${url}/addProducts`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendDeleteRequestForProduct(id) {
    try {
        const response = await fetch(`${url}/deleteProduct/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
async function SendUpdateRequestForProduct(data) {
    try {
        const response = await fetch(`${url}/updateProduct`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json()
    }
    catch (error) {
        console.log(error)
    } 
}
async function ProductsForAdmin() {
    try {
        const response = await fetch(`${url}/getProductsForAdmin`, {
            method: 'GET',
            credentials: 'include',
        })
        return response.json()
    }
    catch (error) {
        console.log(error)
    }
}
export {
    SendSavedProductData,
    SendDeleteRequestForProduct,
    SendUpdateRequestForProduct,
    ProductsForAdmin
}