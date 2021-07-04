import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { detailsUser } from '../actions/userActions';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { updateUserProfile } from './../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { Button } from 'semantic-ui-react';

export default function ProfileScreen() {
    //HOOK
    //to update profile
    const [name, setName] = useState(''); //lay list
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const {success: successUpdate, error: errorUpdate, loading: loadingUpdate} = userUpdateProfile;
    const dispatch = useDispatch();
    useEffect(() => {
      if (!user) {
        dispatch({type: USER_UPDATE_PROFILE_RESET});
        dispatch(detailsUser(userInfo._id));
      }
      else{
        setName(user.name);
        setEmail(user.email);
      }
      
    }, [dispatch, userInfo._id, user]);
    const submitHandler = (e) => {
      e.preventDefault();
      // dispatch update profile
      if (password !== confirmPassword){
          alert('Password and Confirm Password are not matched!');
      } else{
          dispatch(updateUserProfile({userId: user._id, name, email, password}));
      }
    };
    return (
      <div>
        <form className="form containerForm " onSubmit={submitHandler}>
          <div>
            <h1 className="centerText">Thông tin cá nhân</h1>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {loadingUpdate && <LoadingBox></LoadingBox>}
              {errorUpdate && <MessageBox variant="danger"></MessageBox>}
              {successUpdate && (
                <MessageBox variant="success">Updated Success</MessageBox>
              )}
              <div>
                <label htmlFor="name">Tên</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nhập tên"
                  value={name}
                  onChange={e => setName(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  onChange={e => setPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  onChange={e => setConfirmPassword(e.target.value)}
                ></input>
              </div>

              <div>
                <label />
                <Button
                  color="red"
                  type="submit"
                  className="block"
                >
                  Cập nhật
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    );
  } 