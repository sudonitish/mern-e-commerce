import { useEffect, useState } from "react"
import { CheckForAuthentication, SendLogoutRequest } from "../../../api/authAPI"
import styles from "../../styles/header.module.css"
import { useNavigate,Link } from "react-router-dom"


export default function Header() {

    const [userDetails, setUserDetails] = useState(
        {
            username: '',
            isAdmin: false,
            isLoggedIn: false,
        }
    )
    const navigate = useNavigate()
    async function authenticateUser() {
        const data = await CheckForAuthentication();
        setUserDetails(data);
    }
    async function logMeOut() {
        const data = await SendLogoutRequest();
        setUserDetails(data);
        navigate('/login')
    }
 
    useEffect(function () {
        authenticateUser()
    }, [])

    return (
        <>
            <header className={styles.header}>
                <div className={styles.header__logo}>NPS ECOMMERCE</div>
                <nav className={styles.header__nav}>
                    {
                        userDetails.isLoggedIn ?
                            <>
                                <div className={styles.header__username}>{userDetails.username}</div>
                                {
                                    !userDetails.isAdmin ?
                                        <button className={styles.header__nav_item} onClick={()=>{navigate('/myCart')}}>My Cart</button> :
                                        null
                                }
                                <button className={styles.header__nav_item} onClick={()=>{navigate('/resetPassword')}}>Reset Password</button>
                                <button className={`${styles.header__nav_item} ${styles.header__nav_item_logout}`} onClick={logMeOut}>Logout</button>
                            </> :
                            <>
                                <Link to="/" className={styles.header__nav_item}>Home</Link>
                                <Link to="/login" className={styles.header__nav_item}>Login</Link>
                                <Link to="/signup" className={styles.header__nav_item}>Signup</Link>
                            </>
                    }
                </nav>
            </header>

        </>
    )
}