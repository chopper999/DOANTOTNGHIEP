import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Button, Image, Input, Icon } from 'semantic-ui-react';
import { sk } from '../components/soket';


export default function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;


  const dispatch = useDispatch();

  

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  
  useEffect(() => {
    if (userInfo) {

      props.history.push(redirect);
      sk.connect();
    }
  }, [props.history, redirect, userInfo]);

  

  return (
    <div className="loginContainer">
     {loading && <div className="loginLoad"><LoadingBox></LoadingBox></div>}
    {error && <MessageBox variant="danger">{error}</MessageBox>}
    
    
      <div className="rowLogin">
     
        <div className="columnLogin">
          <div id="cf" className="containerImageLogin">
            <img className="bottom" src="logoChopperShop3.jpg" alt="bot"></img>
            <img className="top" src="chopperShopLogo2.jpg" alt="top"></img>
          </div>
        </div>
        <div className="columnLogin">
          <form className="formLogin" onSubmit={submitHandler}>
            <div>
              <h1 className={!loading?"signLabel":"signLabelLoad"}>Đăng nhập</h1>
            </div>
            <br/>
            <br/>
            
            <div>
              <Input iconPosition="left">
                <Icon name="at" />
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </Input>
            </div>
            <br/>
            <div>
              <Input iconPosition="left" >
                <Icon name="lock" />
                <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              </Input>
            </div>
            <br/>
            <div>
              <label />
              <button className="btnLogin" type="submit">Đăng nhập</button>
            </div>
            <br/>
            
            <div>
              <label />
              <div className="textCenter">
                <Link
                  to={`/register?redirect=${redirect}`}
                  className="linkText createAcountLoginLabel"
                >
                  Tạo tài khoản mới <Icon name="arrow circle right"></Icon>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}