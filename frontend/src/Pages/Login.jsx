import { useState,useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import axios from 'axios'



const Login =()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    const{ login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlesubmit =async(e)=>{
        e.preventDefault();

        try{
            const res= await axios.post('http://localhost:5000/api/auth/login',{
                email,password
            })

            const { user,token }=res.data;

            login(user, token)

            navigate('/dashboard')
        }catch(err){
            console.error('Login Erorr',err);
            const message = err.response?.data?.message || 'Login Failed';

            alert(message)
        }
    }


    return(
        <div style={{maxWidth:400,margin:'50px auto', padding:20}}>
            <h2 style={{display:"flex", justifyContent:"center"}}>Login Window</h2>
            <form onSubmit={handlesubmit}>
                <input type="email" 
                placeholder="Enter Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                style={{width:'100%', padding:8,marginBottom:10}}   />

                <input type="password"
                placeholder="Enter Your Password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                style={{width:'100%', padding:8 , marginBottom:10}}  />

                <button type="submit" style={{width:'100%', padding:10}}>Login</button>

                <Link to='/register' style={{width:'100%', padding:10, display:"flex", justifyContent:"center"}}>New User? Register here</Link>
            </form>
        </div>

    )
}
export default Login;