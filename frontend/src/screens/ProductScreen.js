import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { createReview, detailsProduct } from '../actions/productActions';
import { useEffect } from 'react';
import { useState } from 'react';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Image, Message,  Button, Form, Segment,Dropdown, TextArea, Card } from 'semantic-ui-react'


export default function ProductScreen(props) {

  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const productDetails = useSelector((state) => state.productDetails);
  const {loading, product, error} = productDetails;
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userSignin = useSelector((state) => state.userSignin);
  const {userInfo} = userSignin;

  const productReviewCreate = useSelector((state)=> state.productReviewCreate);
  const {loading:loadingReviewCreate, error:errorReviewCreate, success: successReviewCreate} = productReviewCreate;
   
  const submitHandler = (e) => {
    e.preventDefault();
    if (rating && comment) {
      dispatch(createReview(productId, {rating, comment, name: userInfo.name}));
    } else{
      alert('Please enter your comment and review');
    };
  }


  useEffect(() => {
    if (successReviewCreate) {
      window.alert('Review Submitted Successfully!')
    }
    dispatch(detailsProduct(productId));
    setRating('');
    setComment('');
    dispatch({type: PRODUCT_REVIEW_CREATE_RESET});
  }, [dispatch, productId, successReviewCreate]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };
  const ratingOptions = [
    {
      key: '1',
      text: '1- Rất tệ',
      value: '1'},
    {
      key: '2',
      text: '2- Tệ',
      value: '2',},
    {
      key: '3',
      text: '3- Tốt',
      value: '3'},
    {
      key: '4',
      text: '4- Rất tốt',
      value: '4'},
    {
      key: '5',
      text: '5- Xuất sắc',
      value: '5'},
  ]
  

  return (
    <div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {/* <Link to="/">Back to result</Link> */}
          <div className="row top">
            <div className="col-2">
              <Zoom>
                <Image size="massive" src={product.image} alt={product.name} />
              </Zoom>
            </div>
            <div className="col-2 p-3 mr-3 text-left">
              <h1>{product.name}</h1>
              <ul>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </li>
                <li className="description">
                  Mô tả: {product.description}
                </li>
                <li></li>
              </ul>
              <br/>
              <Card>
                <Card.Content>
                  <Card.Meta>
                    <div className="row price p-1">
                      <div> Giá</div>
                      <div><strong>{product.price} VNĐ</strong></div>
                    </div>
                  </Card.Meta>
                  <div className="row price p-1">
                    <div>Trạng thái</div>
                    <div>
                      {product.countInStock > 0 ? (
                        <span className="success">Còn hàng</span>
                      ) : (
                        <span className="danger">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </Card.Content>
                <Card.Content>
                  {product.countInStock > 0 && (
                    <div>
                      <div className="row price p-1">
                        <div>Số lượng</div>
                        <div>
                          <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Content>
                <Card.Content extra>
                {product.countInStock > 0 && (
                  <Button
                    onClick={addToCartHandler}
                    className="btnAddtoCart"
                    color="red"
                  >Thêm vào giỏ hàng
                  </Button>
                )}
                </Card.Content>
              </Card>
            </div>
          </div>
          <div className="reviewArea">
            <h2 id="reviews">
                Đánh giá
            </h2>
            {product.reviews.length === 0 && (
              <MessageBox>
                <Message compact warning size="medium" color="red">
                  <Message.Header>There is no review. </Message.Header>
                </Message>
              </MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li className="userReview" key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p className="lighterText">
                    {" "}
                    <i>  &nbsp;{review.createdAt.substring(0, 10)}</i>
                  </p>
                  <p className="reviewContent">{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <Segment color='grey' secondary padded piled tertiary className="reviewForm">
                    <Form inverted onSubmit={submitHandler}>
                      <h2 className="textCenter">Thêm đánh giá của bạn</h2>
                      <Form.Field>
                        <label className="textRating" htmlFor="rating">Đánh giá</label>
                        <Dropdown
                          fluid
                          selection
                          id="rating"
                          value={rating}
                          onChange={(e, data) => setRating(data.value)}
                          options={ratingOptions}
                          placeholder="Chọn mức độ..."
                        ></Dropdown>
                      </Form.Field>
                      <Form.Field>
                        <label className="textRating">Nhận xét</label>
                        <TextArea
                          id="comment"
                          value={comment}
                          rows={3}
                          placeholder="Nhận xét..."
                          onChange={(e, data) => setComment(data.value)}
                        ></TextArea>
                      </Form.Field>
                      <div className="btnSubmit">
                        <Button
                          size="big"
                          color="red"
                          type="submit"
                          className="hoverBtn"
                        >
                          Đánh giá
                        </Button>
                      </div>

                      <Form.Field className="pt-1">
                        {loadingReviewCreate && <LoadingBox></LoadingBox>}
                        {errorReviewCreate && (
                          <MessageBox variant="danger">
                            {errorReviewCreate}
                          </MessageBox>
                        )}
                      </Form.Field>
                    </Form>
                  </Segment>
                ) : (
                  <MessageBox>
                    Hãy <Link to="/signin">Đăng nhập</Link> để nhận xét và đánh giá
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}