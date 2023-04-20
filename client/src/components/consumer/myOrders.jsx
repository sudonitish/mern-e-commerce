import { useEffect, useState } from "react"
import { MyOrdersInDetails } from "../../../api/consumerAPI";
import { CheckForAuthentication } from "../../../api/authAPI";
import { useNavigate } from "react-router-dom";
import { url } from "../../config";
import myOrderStyles from "../../styles/myOrder.module.css"
import Header from "../partials/header"
export default function MyOrders() {

    const navigate = useNavigate()
    const [productsInOrder, setOrders] = useState([])
    async function isUserAuthenticated() {
        const data = await CheckForAuthentication();
        if (!data.isLoggedIn) {
            navigate('/login')
        }
    }
    async function loadMyOrders() {
        const data = await MyOrdersInDetails()
        setOrders(data)
    }
    useEffect(() => {
        isUserAuthenticated();
        loadMyOrders();
    }, [])
    return (
        <>
            <Header />
            <div className={myOrderStyles.myCartItemsContainer}>
                {
                    productsInOrder.map((product, key) => {
                        const quantityStockMessage = (
                            product.stock === 0 ?
                                'Out of stock' :
                                product.stock < product.quantity ?
                                    'Quantity More than Stock' :
                                    null)
                        return (
                            <div key={key}>
                                <div className={myOrderStyles.card}>
                                    <div className={myOrderStyles.productImageContainer}>
                                        <img src={`${url}/` + product.images[0]} alt={product.title} className={myOrderStyles.productImage} />
                                    </div>
                                    <div className={myOrderStyles.productDetailsInCard}>
                                        <div className={myOrderStyles.productDetailsTypeInCard}>
                                            <div className={myOrderStyles.productTitle}>{product.title}</div>
                                            <div className={myOrderStyles.productBrand}>{product.brand}</div>
                                            <div className={myOrderStyles.productPriceAndQty}>
                                                <label className={myOrderStyles.qtyPriceValue }>₹{product.price}</label>
                                                <label>x</label>
                                                <label className={myOrderStyles.qtyPriceValue}>{product.quantity}</label>
                                                <label>=</label>
                                                <label className={myOrderStyles.qtyPriceValue}>₹{product.quantity*product.price}</label>
                                                </div>
                                            
                                        </div>
                                        <div className={`${myOrderStyles.status} ${myOrderStyles[product.status]}`}>{product.status}</div>
                                    </div>
                                </div>
                            </div >

                        )
                    })
                }
            </div>
        </>
    )
}