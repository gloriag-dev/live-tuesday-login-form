import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from './contect/AuthProvider';
import {Link} from 'react-router-dom';
import axios from './api/axios'


const LOGIN_URL = '/auth';


const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        userRef.current.focus()
    })

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async(e) => {
        e.preventDefault()

        try{
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({user, password}),
                {
                    headers:{'Content-Type': 'application/json'},
                    withCredentials:true,
                }
               
            )
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles;
            setAuth({user, password, roles, accessToken})
            setUser('')
            setPwd('')
            setSuccess(true)
        }catch(err){
            if(err.response?.status === 400){
                setErrMsg('Missing user or pwd')
            }else if(err.response?.status === 401){
                setErrMsg('Unauthorized')
            }else {
                setErrMsg('Login failed')
            }
            errRef.current.focus()
        }
    }
    return (
        <>
        {success ? (
            <section>
                <h1>You are logged in</h1>
            </section>
        ): (
            <section> 
                <p ref={errRef} className={errMsg ? 'errsmg': 'offscreen'}>
                   {errMsg} 
                </p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input id='username' ref={userRef} onChange={(e) => setUser(e.target.value)} value={user} required></input>
            <label htmlFor='password'>Pwd:</label>
            <input id='password' type='password' onChange={(e) => setPwd(e.target.value)} value={password} required></input>
            <button>Sign In</button>
                </form>

                <p>Need an account??</p>
                <Link to='/register'></Link>
            </section>
        )}
         </>
    )
   
}
export default Login
