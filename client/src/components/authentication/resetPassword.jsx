import { useEffect, useState } from "react"
import styles from "../../styles/auth.module.css"
import Header from "../partials/header"
import { SendNewPasswordForForgot, VerifyToReset } from "../../../api/authAPI"
import { Link, useNavigate } from "react-router-dom"
export default function ResetPassword() {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({
        passwordErr: "",
        cpasswordErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedPassword: "",
        savedCpassword: "",
    })
    const [secretValues, setSecretValues] = useState({
        id: "",
        token: "",
    })
    async function resetYourPassword() {
        const response = await SendNewPasswordForForgot(savedValues,secretValues)
       
        if (response.error) {
            setErrors(response.errors)
        }
        else {
            navigate("/login")
        }
    }
    function addInputValuesOnChange(event, type) {
        setSavedValues({
            ...savedValues,
            [type]: event.target.value,
        })
    }
    async function isUserAuthenticated() {
        const data = await VerifyToReset();
        console.log(data)
        if (!data.error) {
            setSecretValues(data.secretValues);
        }
        else {
            navigate('/forgot')
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

                <button className={styles.authButton} onClick={resetYourPassword}>Confirm</button>

                <Link to="/login" >
                    <button className={styles.authButton}>Login</button> 
                </Link>
            </div>
        </>


    )
}