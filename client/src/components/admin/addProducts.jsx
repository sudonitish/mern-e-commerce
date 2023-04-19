import { Link, useNavigate } from "react-router-dom"
import { CheckForAuthentication } from "../../../api/authAPI";
import { useEffect, useState } from "react";
import Header from "../partials/header";
import { SendSavedProductData } from "../../../api/adminAPI";
import addProductsStyles from '../../styles/addProducts.module.css'
export default function AddProducts() {

    const navigate = useNavigate()
    const [errors, setErrors] = useState({
        brandErr: "",
        titleErr: "",
        descriptionErr: "",
        priceErr: "",
        stockErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedBrand: "",
        savedTitle: "",
        savedDescription: "",
        savedPrice: 0,
        savedStock: 0,
    })
    const [savedImages, setSavedImages] = useState([])


    function addInputValuesOnChange(event, type) {
        let value = event.target.value;
        if (type === "savedPrice" || type === "savedStock") {
            value = Math.max(0, parseInt(value));
            event.target.value = value;
        }
        if (type === "savedImages") {
            setSavedImages(event.target.files)
        }
        else {
            setSavedValues({
                ...savedValues,
                [type]: event.target.value,
            })
        }

    }
    async function addThisProduct() {
        const formData = new FormData();
        formData.append('brand', savedValues.savedBrand);
        formData.append('title', savedValues.savedTitle);
        formData.append('description', savedValues.savedDescription);
        formData.append('price', savedValues.savedPrice);
        formData.append('stock', savedValues.savedStock);
        for (let i = 0;i<savedImages.length;i++) {
            formData.append('images', savedImages[i]);
        }
        const response = await SendSavedProductData(formData);
        
        if (response.error) {
            setErrors({
              ...errors,
                brandErr: response.error.brand,
                titleErr: response.error.title,
                descriptionErr: response.error.description,
                priceErr: response.error.price,
                stockErr: response.error.stock,
            })
        }
        else {
            setSavedValues({
                savedBrand: "",
                savedTitle: "",
                savedDescription: "",
                savedPrice: 0,
                savedStock: 0,
            })
            setSavedImages([])
        }
    }
    async function authenticateUser() {
        const data = await CheckForAuthentication();
        if (data.isLoggedIn === true) {
            if (!data.isAdmin) {
                navigate('/')
            }
        }
        else {
            navigate('/login')
        }
    }

    useEffect(() => {
        authenticateUser();
    }, [])
    return (
        <>
            <Header />
            <div className={addProductsStyles.mainContainer}>
                    <label htmlFor="addProductsText" className={addProductsStyles.addProductsText}>Add a new product</label>

                    <label htmlFor="brand" className={addProductsStyles.inputLabel} >Brand</label>
                    <input type="text" name="brand" className={addProductsStyles.inputBox}  value={savedValues.savedBrand} onChange={(event) => { addInputValuesOnChange(event, 'savedBrand') }} required />
                    <label htmlFor="error" className={addProductsStyles.error} >{errors.brandErr}</label>

                    <label htmlFor="title" className={addProductsStyles.inputLabel}>Title</label>
                    <input type="text" name="title" className={addProductsStyles.inputBox} value={savedValues.savedTitle} onChange={(event) => { addInputValuesOnChange(event, 'savedTitle') }} required />
                    <label htmlFor="error" className={addProductsStyles.error}>{errors.titleErr}</label>

                    <label htmlFor="description" className={addProductsStyles.inputLabel}>Description</label>
                    <input type="text" name="description" className={addProductsStyles.inputBox} value={savedValues.savedDescription} onChange={(event) => { addInputValuesOnChange(event, 'savedDescription') }} required />
                    <label htmlFor="error" className={addProductsStyles.error}>{errors.descriptionErr}</label>

                    <label htmlFor="price" className={addProductsStyles.inputLabel}>Price</label>
                    <input type="number" name="price" className={addProductsStyles.inputBox} value={savedValues.savedPrice} onChange={(event) => { addInputValuesOnChange(event, 'savedPrice') }} required />
                    <label htmlFor="error" className={addProductsStyles.error}>{errors.priceErr}
                    </label>

                    <label htmlFor="stock" className={addProductsStyles.inputLabel}>Stock</label>
                    <input type="number" name="stock" className={addProductsStyles.inputBox} value={savedValues.savedStock} onChange={(event) => { addInputValuesOnChange(event, 'savedStock') }} required />
                    <label htmlFor="error" className={addProductsStyles.error}>{errors.stockErr}</label>

                    <label htmlFor="images" className={addProductsStyles.inputLabel}>Images</label>
                    <input type="file" name="images" className={addProductsStyles.inputBox} multiple onChange={(event) => { addInputValuesOnChange(event, 'savedImages') }} required />
                    <label htmlFor="error" className={addProductsStyles.error}>{errors.imagesErr}</label>

                    <button className={addProductsStyles.button} onClick={addThisProduct}>Add Product</button>

                    <Link to="/showProducts" className={addProductsStyles.button}>Show Products</Link>
                </div>
        </>
    )
}
