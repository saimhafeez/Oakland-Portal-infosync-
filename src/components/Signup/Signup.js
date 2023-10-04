import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'

const Signup = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = () => {
        if(!values.name || !values.email || !values.password ) {
            setErrorMsg("Plese fill all fields")
            return;
        }
         setErrorMsg("")
        //  CONNECT WITH FIREBASE
        setSubmitButtonDisabled(true)
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async(res) => {
            setSubmitButtonDisabled(false)
            const user = res.user;
            await updateProfile(user, {
                displayName: values.name,
            });
            navigate('/login')
        })
        .catch((err) => {
            setSubmitButtonDisabled(false)

            setErrorMsg(err.message)
            // OR
            // email already in use
        });
    };

    return (
        <div className='main-login-signup text-center'>
        <div>
            <h1>Sign Up</h1>
        </div>
        <div>
            <label>Name</label><br />
            <input type='text' placeholder='Enter name...' name='name' onChange={(event) => setValues((prev) => ({...prev, name: event.target.value})) } />
        </div>
        <div>
            <label>Email</label><br />
            <input type='email' placeholder='Enter email address...' name='email' onChange={(event) => setValues((prev) => ({...prev, email: event.target.value})) } />
        </div>
        <div>
            <label>Password</label><br />
            <input type='password' placeholder='Enter password...' name='password' onChange={(event) => setValues((prev) => ({...prev, password: event.target.value})) } />
        </div>
        <div className=''>
            <p><strong>{ errorMsg }</strong></p>
            <button onClick={handleSubmission} disabled={submitButtonDisabled}>Sign Up</button>
            <p>Already have an Account <Link to="/login">Login</Link></p>
        </div>
        </div>
    )
}

export default Signup