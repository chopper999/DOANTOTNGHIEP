import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Button } from 'semantic-ui-react';

export default function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const redirect = props.location.search
    ? props.location.search.split('=')[1]     //redirect=shipping => shipping
    : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password and confirm password are not match');
    } else {
      dispatch(register(name, email, password));
    }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  return (
    <div className="containerNavbar">
      <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Tạo tài khoản mới</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div className="ui focus input">
          <label htmlFor="name">Tên</label>
          <input
            type="text"
            id="name"
            placeholder="Nhập tên"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="ui focus input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="ui focus input">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="ui focus input">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <Button
                  color="red"
                  type="submit"
                  className="block"
                >
                  Đăng ký
                </Button>
        </div>
        <div>
          <label />
          <div>
            Đã có tài khoản? &nbsp; &nbsp; 
            <Link to={`/signin?redirect=${redirect}`} className="linkText" >Đăng nhập ngay</Link>
          </div>
        </div>
      </form>
    </div>
  );
}