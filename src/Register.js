import { useRef, useState, useEffect, useInsertionEffect } from "react";
import {faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9_]{3, 23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$#%]).{8, 24}$/
const REGISTER_URL = '/register'

const Register = () => {
    const userRef = userRef()
    const errRef = userRef()

    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)
    const [pwd, setPwd] = useState('')
    const [pwdFocus, setPwdFocus] = useState(false)
    const [validPwd, setValidPwd] = useState(false)
    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)


    useEffect(() => {
        userRef.current.focus()
    })
    useEffect(() => {
        setValidName(USER_REGEX.test(user))
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd))
        setValidMatch(pwd === matchPwd)
    }, [user, pwd, matchPwd])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const v1 = USER_REGEX.test(user)
        const v2 = PWD_REGEX.test(pwd)
        if(!v1 || !v2){
            setErrMsg('invalid')
        }
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({user, pwd}),
                {
                    headers:{'Content-Type': 'application/json'},
                    withCredentials:true,
                }
               
            )
            setSuccess(true)
            setUser('')
            setPwd('')
            setMatchPwd('')
        }catch(err){
            if(err.response?.status === 409){
                setErrMsg('username taken')
            }else {
                setErrMsg('registration failed')
            }
            errRef.current.focus()
        }
    }

    return (
        <>
        {success ? (
            <section>
            <h1>Success</h1>
        </section>
        )  : (

    <section>
         <p ref={errRef} className={errMsg ? 'errsmg': 'offscreen'}>
                   {errMsg} 
                </p>

                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>

                <FontAwesomeIcon icon={faCheck} className={validName ? 'valid' : 'hide'}></FontAwesomeIcon>
                <FontAwesomeIcon icon={faTimes} className={validName  || !user ? 'hide' : 'invalid'}></FontAwesomeIcon>
                <input id='username' ref={userRef} onChange={(e) => setUser(e.target.value)} value={user} 
                required onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)}></input>

<input id='password' type='password' onChange={(e) => setPwd(e.target.value)} value={password} 
required  onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)}></input>

<label htmlFor="confirm"> Confirm pwd</label>
                </form>
    </section>

        )}
        </>
    )
}
