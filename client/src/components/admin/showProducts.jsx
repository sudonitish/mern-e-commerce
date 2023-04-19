import { Link, useNavigate } from 'react-router-dom'
import showProductsStyles from '../../styles/showProducts.module.css'
import { useEffect, useState } from 'react'
import Header from "../partials/header";
import { CheckForAuthentication } from '../../../api/authAPI';
import { ProductsForAdmin } from "../../../api/adminAPI"
import { url } from '../../config';
import { SendDeleteRequestForProduct, SendUpdateRequestForProduct } from '../../../api/adminAPI';
export default function ShowProducts() {
    const navigate = useNavigate()
    const [productsOnScreen, setProductOnScreen] = useState([])
    const handleInputChange = (event, index, key) => {
        let { value } = event.target;

        if (key === "price" || key === "stock") {
            value = Math.max(0, parseInt(value));
        }
        setProductOnScreen(prevState => {
            const products = [...prevState];
            products[index][key] = value;
            return products;
        });
    }
    async function loadProducts() {
        const data = await ProductsForAdmin()
        setProductOnScreen(data);
    }
    async function deleteProduct(id) {
        const response = await SendDeleteRequestForProduct(id);
        if (response.deleted) {
            loadProducts();
        }
    }
    async function updateProduct(index) {

        const response = await SendUpdateRequestForProduct(productsOnScreen[index]);
        if (response.updated) {
            loadProducts();
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
        loadProducts()
    }, [])
    return (
        <>
            <Header />
            <div className={showProductsStyles.addProductsContainer}>
                <Link to='/addProducts' className={showProductsStyles.addProducts}>
                    Add Products
                </Link>
            </div>
            <div className={showProductsStyles.showMainContainer}>
                {
                    productsOnScreen.map((product, key) => {
                        return (
                            <div key={key}>
                                <div className={showProductsStyles.card} id={product.title} >
                                    <img src={`${url}/` + product.images[0]} className={showProductsStyles.productImage} />
                                    <div className={showProductsStyles.inputContainer}>
                                        <label htmlFor="brand" className={showProductsStyles.inputLabelText}>Brand</label>
                                        <input type="text" name="brand" className={showProductsStyles.inputBox} value={product.brand} onChange={(event) => handleInputChange(event, key, 'brand')} />
                                    </div>
                                    <div className={showProductsStyles.inputContainer}>
                                        <label htmlFor="title" className={showProductsStyles.inputLabelText}>Title</label>
                                        <input type="text" name="title" className={showProductsStyles.inputBox} value={product.title} onChange={(event) => handleInputChange(event, key, 'title')} />
                                    </div>
                                    <div className={showProductsStyles.inputContainer}>
                                        <label htmlFor="description" className={showProductsStyles.inputLabelText}>Description</label>
                                        <input type="text" name="description" className={showProductsStyles.inputBox} value={product.description} onChange={(event) => handleInputChange(event, key, 'description')} />
                                    </div>
                                    <div className={showProductsStyles.inputContainer}>
                                        <label htmlFor="price" className={showProductsStyles.inputLabelText}>Price</label>
                                        <input type="number" name="price" className={showProductsStyles.inputBox} value={product.price} onChange={(event) => handleInputChange(event, key, 'price')} />
                                    </div>
                                    <div className={showProductsStyles.inputContainer}>
                                        <label htmlFor="stock" className={showProductsStyles.inputLabelText}>Stock</label>
                                        <input type="number" name="stock" className={showProductsStyles.inputBox} value={product.stock} onChange={(event) => handleInputChange(event, key, 'stock')} />
                                    </div>

                                    <div className={showProductsStyles.buttonContainer}>
                                        <button className={showProductsStyles.updateButton} onClick={() => { updateProduct(key) }}>Update</button>
                                        <button className={showProductsStyles.deleteButton} onClick={() => { deleteProduct(product._id) }}>Delete</button>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </>
    )
}


