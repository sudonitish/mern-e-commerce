import { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import { CheckForAuthentication, SendLoginRequest,DestroySession } from "../../../api/authAPI";
import styles from "../../styles/auth.module.css"
import Header from "../partials/header";
export default function Login() {
    const [errors, setErrors] = useState({
        usernameErr: "",
        passwordErr: "",
    })
    const [savedValues, setSavedValues] = useState({
        savedUsername: "",
        savedPassword: "",
    })
    const [linkSuccessSend, setLinkSuccessSend] = useState({status:false,message:''})
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    function addInputValuesOnChange(event, type) {
        setSavedValues({
          ...savedValues,
            [type]: event.target.value,
        })
    }
    async function authenticateUser() {
        const data = await SendLoginRequest(savedValues);
        if (data.isError) {
            setErrors(data.errors)
        }
        else if (data.isAamin) {
            navigate('/addProducts')
        }
        else{
            navigate('/')
        }
    }
    async function isUserAuthenticated() {
        const data = await CheckForAuthentication();
        console.log(data)
        if (data.linkSend) {
           
            setLinkSuccessSend({
                status: true,
                message: data.message
            })
            
            setTimeout(async () => {
                setLinkSuccessSend({
                    status: false,
                    message: ''
                });
                
                if (data.popupType == "signup")
                {
                    const res = await DestroySession()
                    console.log(res)
                }
            }, 5000);

        }
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
            <label htmlFor="signupTeext" className={styles.authText}>Log In</label>

            <label htmlFor="username" className={styles.inputLabel}>Username</label>
            <input type="text" name="username"  value={savedValues.savedUsername} className={styles.authInput}  onChange={(event) => { addInputValuesOnChange(event, 'savedUsername') }} required />
            <label htmlFor="error" className={styles.authError}>{ errors.usernameErr}</label>


            <label htmlFor="password" className={styles.inputLabel}>Password</label>
            <input type="password" name="password" value={savedValues.savedPassword} className={styles.authInput}  onChange={(event) => { addInputValuesOnChange(event, 'savedPassword') }} required />
            <label htmlFor="error" className={styles.authError}>{ errors.passwordErr}</label>

            <button type="submit" id="submit" className={styles.authButton} onClick={authenticateUser}>Login</button>
            <Link to="/signup"><button type="button" className={styles.authButton}>Signup</button></Link>
            <div className={styles.forgotContainer}>
            <Link to="/forgot" className={styles.forgotLink}>Forgot password?</Link>
            </div>
            
            </div>
            {linkSuccessSend.status ? <div className={styles.linkSuccessSend}>{linkSuccessSend.message}</div> : ''}
            
        </>
        
    )
}