import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { listOrders, deleteOrder } from './../actions/orderAction';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import { Button } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';

export default function OrderListScreen(props) {

  const {
    pageNumber = 1,
  } = useParams(); //hook


  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders,page, pages } = orderList;

  const orderDelete = useSelector((state)=> state.orderDelete);
  const {loading: loadingDelete, error: errorDelete, success: successDelete} = orderDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type: ORDER_DELETE_RESET});
    dispatch(listOrders({pageNumber}));
    
  }, [dispatch, successDelete, userInfo._id,pageNumber]);    //khi xoa thanh cong, refresh lai listOrder
  const deleteHandler = (order) => {
    if (window.confirm('Bạn có muốn xóa đơn hàng này')) {
        dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div className="containerNavbar mt-20 container-table">
      <h1 className="centerText">Đơn hàng</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
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
                <th>Tên người dùng</th>
                <th>Ngày</th>
                <th>Tổng tiền</th>
                <th>Tình trạng thanh toán</th>
                <th>Tình trạng chuyển phát</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(0)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : "Chưa thanh toán"}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "Chưa chuyển phát "}
                  </td>
                  <td>
                    <Button
                    primary
                    type="button"
                    onClick={() => {
                        props.history.push(`/order/${order._id}`); // redirect toi trang detail order
                      }}>Chi tiết</Button>
                      <Button
                    color = 'red'
                    type="button"
                    onClick={() => deleteHandler(order)}>Xóa</Button>
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
                to={`/orderlist/pageNumber/${x + 1}`}
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