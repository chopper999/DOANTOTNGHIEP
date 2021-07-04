import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';
import { Button } from 'semantic-ui-react';

export default function UserEditScreen(props) {
  const userId = props.match.params.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET }); //reset de update user khac
      props.history.push('/userlist');  //update thanh cong thi redirect user den trang userlist
    }
    if (!user) {
      dispatch(detailsUser(userId));
    } else {        //Neu da ton tai user, lay cac thong tin cua user dien vao cac field
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);     
    }
  }, [dispatch, props.history, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update user
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };
  return (
    <div>
      <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Chỉnh sửa thông tin {name}</h1>
          {loadingUpdate && <LoadingBox></LoadingBox>}
          {errorUpdate && (
            <MessageBox variant="danger">{errorUpdate}</MessageBox>
          )}
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Tên</label>
              <input
                id="name"
                type="text"
                placeholder="Nhập tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="inLine">
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></input>
              
              <label htmlFor="isAdmin">Là Admin</label>
            </div>
            <div>
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