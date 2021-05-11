import React from "react";
import {useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { listOrderMine } from "../actions/orderAction";
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export default function OrderHistoryScreen(props) {
  const {
    pageNumber = 1,
  } = useParams(); //hook
  const orderMineList = useSelector(state => state.orderMineList);
  const { loading, error, orders, page, pages } = orderMineList;
  const dispatch = useDispatch();
  useEffect (()=> {
      dispatch(listOrderMine({pageNumber}));
  }, [dispatch, pageNumber]);


  return (
    <div className="containerNavbar">
      <h1 className="centerText ">Order History</h1>
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
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                <Button
                    primary
                    type="button"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}>Details</Button>
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
                to={`/orderhistory/pageNumber/${x+1}`}
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
