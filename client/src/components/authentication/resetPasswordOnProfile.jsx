import { useState, useEffect } from "react"
import styles from "../../styles/auth.module.css"
import Header from "../partials/header"
import { Link, useNavigate } from "react-router-dom"
import { CheckForAuthentication, SendNewPassword } from "../../../api/authAPI"
export default function ResetPasswordOnProfile() {
    const [errors, setErrors] = useState({
        opasswordErr: "",
        passwordErr: "",
        cpasswordErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedOPassword: "",
        savedPassword: "",
        savedCpassword: "",
    })
    const navigate = useNavigate();

    async function resetMyPassword() {
        const response = await SendNewPassword(savedValues)
        if (response.success) {
            navigate('/login')
        }
        else {
            setErrors(response.errors)
        }
    }
    function addInputValuesOnChange(event, type) {
        setSavedValues({
            ...savedValues,
            [type]: event.target.value,
        })
    }
    async function isUserAuthenticated() {
        const data = await CheckForAuthentication();
        if (!data.isLoggedIn) {
            navigate("/login")
        }
    }
    useEffect(() => {
        isUserAuthenticated();
    }, [])

    return (
        <>
            <Header />
            <div className={styles.authForm}>
                <label htmlFor="resetText" className={styles.authText}>Reset Password</label>

                <label htmlFor="opassword" className={styles.authInputLabel}>Old Password</label>
                <input type="password" name="opassword" className={styles.authInput} value={savedValues.savedOPassword} onChange={(event) => { addInputValuesOnChange(event, 'savedOPassword') }} required />
                <label htmlFor="error" className={styles.authError}>
                    {errors.opasswordErr}
                </label>

                <label htmlFor="password" className={styles.authInputLabel}>New Password</label>
                <input type="password" name="password" className={styles.authInput} value={savedValues.savedPassword} onChange={(event) => { addInputValuesOnChange(event, 'savedPassword') }} required />
                <label htmlFor="error" className={styles.authError}>
                    {errors.passwordErr}
                </label>

                <label htmlFor="cpassword" className={styles.authInputLabel}>Confirm Password</label>
                <input type="password" name="cpassword" className={styles.authInput} value={savedValues.savedCpassword} onChange={(event) => { addInputValuesOnChange(event, 'savedCpassword') }} required />
                <label htmlFor="error" className={styles.authError}>
                    {errors.cpasswordErr}
                </label>

                <button className={styles.authButton} onClick={resetMyPassword}>Confirm</button>

                <Link to="/">
                    <button type="button" className={styles.authButton}>Home</button>
                </Link>
            </div>
        </>
    )
}