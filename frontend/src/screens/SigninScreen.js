import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { GoogleLogin } from 'react-google-login';
import { AUTH } from '../constants/userConstants';

export default function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;


  const dispatch = useDispatch();
  const history = useHistory();

  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  const responseGoogle = async (res) => {
    const _id = res.profileObj.googleId;
    const name = res.profileObj.name;
    const email = res.profileObj.email;
    const isAdmin = false;
    
    const token = res?.tokenId;


    try {
      dispatch({type: AUTH, payload: {_id, name, email, isAdmin, token}});
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);

  

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            New customer?{" "}
            <Link to={`/register?redirect=${redirect}`}>
              Create your account
            </Link>
          </div>
        </div>

        {/* login with GG */}
        <div className="hr"> Or Login With</div>
        <div className="social">
          <GoogleLogin
            clientId="813268287245-7jut81suakt5ujgoubec0gjj3i3ej7o5.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>

        
      </form>
    </div>
  );
}