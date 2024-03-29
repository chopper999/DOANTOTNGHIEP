import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { deleteUser } from './../actions/userActions';
import { USER_DETAILS_RESET } from './../constants/userConstants';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export default function UserListScreen(props) {

  const { pageNumber = 1 } = useParams();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userDelete = useSelector((state)=> state.userDelete);
  const {loading: loadingDelete, error:errorDelete, success: successDelete}= userDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers({pageNumber}));
    dispatch({type: USER_DETAILS_RESET});
  }, [dispatch, successDelete, pageNumber]);    //xoa thanh cong thi refresh lai list user
  const deleteHandler = (user) =>{ 
      if(window.confirm('Are you sure to delete this User?')){
          dispatch(deleteUser(user._id));
      }
  };
  return (
    <div className="containerNavbar container-table">
      <h1 className="centerText mt-20">Khách hàng</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {successDelete && (
        <MessageBox variant="success">Xóa thành công</MessageBox>
      )}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Là admin</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <Button
                    primary
                    type="button"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}>Chỉnh sửa</Button>
                    <Button
                    color='red'
                    type="button"
                    onClick={() => deleteHandler(user)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/userlist/pageNumber/${x+1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
          </>
      )}
    </div>
  );
}