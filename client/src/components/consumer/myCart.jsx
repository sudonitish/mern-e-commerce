import { useEffect, useState } from "react"
import Header from "../partials/header"
import { MyCartInDetails, Increase, Decrease } from "../../../api/consumerAPI"
import { CheckForAuthentication,DestroySession } from "../../../api/authAPI";
import { useNavigate } from "react-router-dom";
import myCartStyles from "../../styles/myCart.module.css"
import { url } from "../../config";
import axios from 'axios';
export default function Cart() {
    const navigate = useNavigate()
    const [myCartProducts, setMyCartProducts] = useState([])
    const [myTotalCartValue, setTotalAmountValue] = useState(0)
    const [placeOrderError, setPlaceOrderError] = useState(false)
    
    async function isUserAuthenticated() {
        const data = await CheckForAuthentication();
        if (!data.isLoggedIn) {
            navigate('/login')
        }
    }
    async function loadMyCart() {
        const data = await MyCartInDetails()
        setMyCartProducts(data.usersBag)
        const totalAmount = data.usersBag.reduce((total, product) => {
            return total + (product.price * product.quantity)
        }, 0)
        setTotalAmountValue(totalAmount)
    }
    async function handleIncrease(product) {
        const data = await Increase(product._id)
        loadMyCart()
    }

    async function handleDecrease(product) {
        const data = await Decrease(product._id)
        loadMyCart()
    }
    async function placeOrderAndPay() {
        const error = myCartProducts.find((item) => {
            return (item.stock === 0 || item.quantity > item.stock)
        })
        if (error) {
            setPlaceOrderError(true);
            setTimeout(() => {
                setPlaceOrderError(false);
            }, 5000);

        }
        else {
            displayRazorpay()
        }
            
    }
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            navigate("/myCart");
        }

        const result = await axios.get(url + '/placeOrderAndPay', { withCredentials: true });

        if (!result) {
            alert("Server error. Are you online?");
            navigate('/myCart')
        }

        const { keyID, amount, orderID, username, email } = result.data;

        const options = {
            key: keyID, // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: 'INR',
            name: "NPS",
            description: "Test Transaction",
            image: "https://www.liblogo.com/img-logo/np1079n467-nps-logo-nps-solo-web-national-payment-solutions.png",
            order_id: orderID,
            handler: async function (response) {
                const data = {
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature
                };

                const result = await axios.post(url + '/confirmOrder', data, { withCredentials: true });
                console.log(result.data);
                if (!result.data.error) {
                    navigate('/')
                }
                else {
                    alert('server error');
                }
            },
            prefill: {
                name: username,
                email: email,
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    useEffect(() => {
        isUserAuthenticated();
        loadMyCart();
    }, [])
    return (
        <>
            <Header />
            <div className={myCartStyles.backToProductsContainer}>
                <button className={myCartStyles.shopMoreButton} onClick={() => { navigate('/') }}>Shop More...</button>
            </div>
            <div className={myCartStyles.myCartItemsContainer}>
                {
                    myCartProducts.map((product, key) => {
                        const quantityStockMessage = (
                            product.stock === 0 ?
                                'Out of stock' :
                                product.stock < product.quantity ?
                                    'Quantity More than Stock' :
                                    null)
                        return (
                            <div key={key}>
                                <div className={myCartStyles.card}>
                                    <img src={`${url}/` + product.images[0]} alt={product.title} className={myCartStyles.productImage} />
                                    <div className={myCartStyles.productDetailsInCard}>
                                        <div className={myCartStyles.productDetailsTypeInCard}>
                                            <div className={myCartStyles.productTitle}>{product.title}</div>
                                            <div className={myCartStyles.productBrand}>{product.brand}</div>
                                        </div>
                                        <div className={myCartStyles.productPrice}>₹{product.price}</div>
                                    </div>
                                    <div className={myCartStyles.addRemoveQuantityContainer}>
                                        <button className={myCartStyles.add} onClick={() => handleIncrease(product)} disabled={quantityStockMessage}>+</button>
                                        <label className={myCartStyles.quantity}>{product.quantity}</label>
                                        <button className={myCartStyles.remove} onClick={() => handleDecrease(product)}>-</button>
                                    </div>

                                    {quantityStockMessage ? <div className={myCartStyles.stockQuantityMessage}>
                                        {quantityStockMessage}
                                    </div> : null}
                                </div>
                            </div >

                        )
                    })
                }
            </div>

            <div className={myCartStyles.myCartPlaceOrderContainer}>
                <div className={myCartStyles.totalAmountContainer}>
                    <label htmlFor="totalAmount" className={myCartStyles.totalAmount}>Total Amount: ₹</label>
                    <label htmlFor="Amount" className={myCartStyles.totalAmountValue}>{myTotalCartValue}</label>
                </div>
                <button className={myCartStyles.placeOrder} onClick={placeOrderAndPay}>Place order</button>
            </div>

            {placeOrderError ? <div className={myCartStyles.placeOrderError}>Product is Out of stock or your quantity is more than stock!</div> : ''}
        </>
    )
}
