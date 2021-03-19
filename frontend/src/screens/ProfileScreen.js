import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { detailsUser } from '../actions/userActions';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { updateUserProfile } from './../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
    //HOOK
    //to update profile
    const [name, setName] = useState(''); //lay list
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Seller
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');

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
        if (user.seller)
        {
          setSellerName(user.seller.name);
          setSellerLogo(user.seller.logo);
          setSellerDescription(user.seller.description);
        }
      }
      
    }, [dispatch, userInfo._id, user]);
    const submitHandler = (e) => {
      e.preventDefault();
      // dispatch update profile
      if (password !== confirmPassword){
          alert('Password and Confirm Password are not matched!');
      } else{
          dispatch(updateUserProfile({userId: user._id, name, email, password, sellerName, sellerLogo, sellerDescription}));
      }
    };
    return (
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>User Profile</h1>
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
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter name"
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
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  onChange={e => setPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="confirmPassword">confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter confirm password"
                  onChange={e => setConfirmPassword(e.target.value)}
                ></input>
              </div>

              {/* Seller */}
             {
               userInfo.isSeller && 
               <>
               <h2>Seller</h2>
                <div>
                <label htmlFor="sellerName">Seller Name</label>
                <input
                  id="sellerName"
                  type="text"
                  placeholder="Enter Seller Name"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                ></input>
                </div>

                <div>
                <label htmlFor="logo">Logo</label>
                <input
                  id="logo"
                  type="text"
                  placeholder="Enter Seller Logo"
                  value={sellerLogo}
                  onChange={e => setSellerLogo(e.target.value)}
                ></input>
                </div>

                <div>
                <label htmlFor="description">Description</label>
                <input
                  id="sellerName"
                  type="text"
                  placeholder="Description"
                  value={sellerDescription}
                  onChange={e => setSellerDescription(e.target.value)}
                ></input>
                </div>
             </> 
             }

              <div>
                <label />
                <button className="primary" type="submit">
                  Update
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    );
  } 