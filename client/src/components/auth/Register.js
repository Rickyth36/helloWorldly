import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { setAlert } from '../../actions/alert';


function Register({setAlert}) {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const onChange = e => setFormData({
        ...formData,[e.target.name]:e.target.value
    })
   const {name, email, password, password2} = formData;        

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Passwords do not match','danger');
            console.log('Password do not match');
        }else{
            const newUser = {
                name,
                email,
                password
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);
                const res = await axios.post('/api/users',body,config);
                console.log(res.data);
                
            } catch (error) {
                console.error(error.response.data);
            }
        }

    }

 
    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                <input type="text" placeholder="Name" name="name"
                value={name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                <input type="email" placeholder="Email Address"
                value={email} onChange={e => onChange(e)} name="email" />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={e => onChange(e)}
                    value={password}
                    minLength="6"
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    onChange={e => onChange(e)}
                    value={password2}
                    minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>    
        </>
    )
}

export default connect(null,{setAlert})(Register);