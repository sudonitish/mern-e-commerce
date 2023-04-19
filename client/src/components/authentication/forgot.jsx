import { useState } from "react"
import styles from "../../styles/auth.module.css"
import Header from "../partials/header"
import { Link, useNavigate } from "react-router-dom"
import { SendResetPasswordLink } from "../../../api/authAPI"
export default function Forget() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        emailErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedEmail: "",
    })

    async function forgotMyPassword() {
        const response = await SendResetPasswordLink(savedValues)
        if (response.error) {
            setErrors(
                response.errors
            )
        }
        else {
            navigate('/login')
        }
    }
    function addInputValuesOnChange(event, type) {
        setSavedValues({
            ...savedValues,
            [type]: event.target.value,
        })
    }
    return (
        <>
            <Header />
        <div className={styles.authForm}>
        <label htmlFor="signupTeext" className={styles.authText}>Forgot password?</label>

        <label htmlFor="email" className={styles.authInputLabel}>Enter email id</label>
        <input type="email" name="email" className={styles.authInput} value={savedValues.savedEmail} onChange={(event)=>{addInputValuesOnChange(event, 'savedEmail') }} />
        <label htmlFor="error" className={styles.authError}>{errors.emailErr}</label>

        <button className={styles.authButton} onClick={forgotMyPassword}>Reset</button>
        <Link to="/login"><button type="button" className={styles.authButton}>Login</button></Link>
    </div>
        </>
        
    )
}
