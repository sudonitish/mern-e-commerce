import popupStyles from '../../styles/popup.module.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.js";
import { url } from '../../config';
import { useState, useEffect } from 'react';
import { MyCart, AddToCart } from "../../../api/consumerAPI"
import { useNavigate } from 'react-router-dom';
export default function ProductModal(props) {
    const { product, onClose } = props
    const navigate = useNavigate()
    const [myCartProducts, setMyCartProducts] = useState([])
    const isProductInCart = myCartProducts.find((item) => item.producID === product._id);
    const buttonText = isProductInCart ? 'Remove from cart' : 'Add to cart';
    const [loading, setLoading] = useState(false);
    const sliderProps = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,

    };
    async function loadMyCart() {
        const data = await MyCart()

        setMyCartProducts(data.usersBag)
    }
    async function addToCartProduct(id) {
        setLoading(true)
        const data = await AddToCart(id);
        if (!data.isLoggedIn) {
            navigate("/login");
        } else {
            loadMyCart();
        }
        setLoading(false)
    }
    useEffect(() => {
        loadMyCart();
    }, [])

    return (

        <div className={popupStyles.productModalContainer}>
            <div className={popupStyles.productModal}>
                <button className={popupStyles.closeButton} onClick={onClose}>X</button>
                <div className={popupStyles.picturesContainer}>
                    <Slider
                        className={popupStyles.sliderSlick}
                        {...sliderProps}
                    >
                        {product.images.map((image, index) => (
                            <div key={index} className={popupStyles.productImages}>
                                <img src={`${url}/${image}`} alt="" />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className={popupStyles.productDetails}>
                    <h2>{product.title}</h2>
                    <h3>{product.brand}</h3>
                    <p>{product.description}</p>
                    <div className={popupStyles.productPrice}>₹{product.price}</div>
                    <button onClick={() => addToCartProduct(product._id)} disabled={loading}>{loading ? 'loading...' : buttonText}</button>
                </div>
            </div>
        </div >
    )
}