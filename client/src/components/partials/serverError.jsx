import { useState } from "react"
// import serverStyles from "../../styles/serverError.module.css"
export default function ServerError() {

    const [errors, setErrors] = useState({
        errorType: 'serverError',
        error:"404 Page not found"
    })
    return (
        <>
             <div className={serverStyles.container}>
                <h1 className={serverStyles.heading1}>{ errors.errorType}</h1>
                <h2 className={serverStyles.heading2}>{ errors.error}</h2>
            </div>
            </>
           
        )
    }
