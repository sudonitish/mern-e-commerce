import { useState ,useEffect} from "react"
import styles  from "../../styles/auth.module.css"
import { CheckForAuthentication, SendSignupRequest } from "../../../api/authAPI"
import Header from "../partials/header"
import { Link, useNavigate } from "react-router-dom"
export default function Signup() {
    const [errors, setErrors] = useState({
        nameErr: "",
        usernameErr: "",
        phoneErr: "",
        emailErr: "",
        passwordErr: "",
        cpasswordErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedName: "",
        savedUsername: "",
        savedPhone: "",
        savedEmail: "",
        savedPassword: "",
        savedCpassword: "",
    })
    
const navigate = useNavigate()
    function addInputValuesOnChange(event, type) {
        setSavedValues({
            ...savedValues,
            [type]: event.target.value,
        })
    }
    async function registerUser() {

        const response = await SendSignupRequest(savedValues);
        if (response.error) {
            setErrors(response.errors);
        }
        else {
            navigate('/login')
        }
    }
    async function isUserAuthenticated() {
        const data = await CheckForAuthentication();
        if (data.isLoggedIn === true) {
            if(data.isAamin) {
                navigate('/addProducts')
            }
            else {
                navigate('/')
            }
        }
    }
    useEffect(() => {
        isUserAuthenticated();
    },[])
    return (
        <>
            <Header />
            <div className={styles.authForm}>
                <label htmlFor="signupText" id="signupText" className={styles.authText}>Sign Up</label>
                <label htmlFor="name" className={styles.authInputLabel}>Name</label>
                <input type="text" name="name" id="name" className={styles.authInput} value={savedValues.savedName} onChange={(event) => { addInputValuesOnChange(event, 'savedName') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.nameErr}</label>

                <label htmlFor="username" className={styles.authInputLabel}>Username</label>
                <input type="text" name="username" id="username" className={styles.authInput} value={savedValues.savedUserName} onChange={(event) => { addInputValuesOnChange(event, 'savedUsername') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.usernameErr}</label>

                <label htmlFor="phone" className={styles.authInputLabel}>Phone</label>
                <input type="text" name="phone" id="phone" className={styles.authInput} value={savedValues.savedPhone} onChange={(event) => { addInputValuesOnChange(event, 'savedPhone') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.phoneErr}</label>

                <label htmlFor="email" className={styles.authInputLabel}>Email</label>
                <input type="email" name="email" id="email" className={styles.authInput} value={savedValues.savedEmail} onChange={(event) => { addInputValuesOnChange(event, 'savedEmail') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.emailErr}</label>

                <label htmlFor="password" className={styles.authInputLabel}>Password</label>
                <input type="password" name="password" id="password" className={styles.authInput} value={savedValues.savedPassword} onChange={(event) => { addInputValuesOnChange(event, 'savedPassword') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.passwordErr}</label>

                <label htmlFor="cpassword" className={styles.authInputLabel}>Confirm Password</label>
                <input type="password" name="cpassword" id="cpassword" className={styles.authInput} value={savedValues.savedCPassword} onChange={(event) => { addInputValuesOnChange(event, 'savedCpassword') }} required />
                <label htmlFor="error" className={styles.authError}>{errors.cpasswordErr}</label>

                <button type="submit" id="submit" className={styles.authButton} onClick={registerUser}>Sign Up</button>

                <Link to="/login">
                    <button type="button" id="login" className={styles.authButton}>Login</button>
                </Link>

            </div>
        </>
    )
}