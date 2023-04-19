import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Products, MyCart, AddToCart } from "../../../api/consumerAPI"
import ProductModal from "./popup"
import Header from "../partials/header"
import homeStyles from "../../styles/home.module.css"
import { url } from "../../config"
import { CheckForAuthentication } from "../../../api/authAPI"
export default function Home() {
    const [productNo, setProductNo] = useState(0);
    const [productsOnScreen, setProductOnScreen] = useState([])
    const [myCartProducts, setMyCartProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState([]);

    const navigate = useNavigate();



    async function loadProducts() {
        const data = await Products(productNo)
        setProductNo(productNo + 5)
        setProductOnScreen(productsOnScreen => [...productsOnScreen, ...data]);
    }
    async function loadMyCart() {
        const data = await MyCart()

        setMyCartProducts(data.usersBag)
    }

    async function addToCartProduct(id, index) {
        setLoading(loading => {
            const newLoading = [...loading];
            newLoading[index] = true;
            return newLoading;
        });
        const data = await AddToCart(id);
        if (!data.isLoggedIn) {
            navigate("/login");
        } else {
            loadMyCart();
        }
        setLoading(loading => {
            const newLoading = [...loading];
            newLoading[index] = false;
            return newLoading;
        });
    }
    async function authenticateUser() {
        
        const data = await CheckForAuthentication();
        
        if (data.isAdmin) {
            navigate('/addProducts')
        }
        else {
            loadMyCart();
            loadProducts()
        }
    }
    useEffect(() => {
        authenticateUser()  
    }, [])
    return (
        <>
            <Header />
            <div className={homeStyles.productsContainer}>
                {
                    productsOnScreen.map((data, key) => {

                        const isProductInCart = myCartProducts.find((item) => item.producID === data._id);
                        const buttonText = isProductInCart ? 'Remove from cart' : 'Add to cart';
                        return (
                            <div key={key}>
                                {isProductInCart||data.stock ?
                                    <div className={homeStyles.card} onClick={() => setSelectedProduct(data)}>
                                        <img src={`${url}/` + data.images[0]} alt="" className={homeStyles.productImage} />
                                        <div className={homeStyles.productDetailsInCard}>
                                            <div className={homeStyles.productDetailsTypeInCard}>
                                                <div className={homeStyles.productTitle}> {data.title}</div>
                                                <div className={homeStyles.productBrand}> {data.brand}</div>
                                            </div>
                                            <div className={homeStyles.productPrice}>₹{data.price}</div>
                                        </div>
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                addToCartProduct(data._id, key)
                                            }} className={homeStyles.productToCart}
                                            disabled={loading[key]}>
                                            {loading[key] ? "Loading..." : buttonText}
                                        </button>
                                        {data.stock === 0 ? <div className={homeStyles.outOfStock}>Out of stock</div> : <></>}
                                    </div>
                                    : <></>
                                }
                            </div>
                        )
                    })

                }
                {selectedProduct && <ProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setSelectedProduct(null);
                        loadMyCart()
                    }} />}
            </div >
            <div className={homeStyles.loadMoreButtonContainer}>
                <button className={homeStyles.loadMore}>load more...</button>
            </div>
        </>
    )
}
