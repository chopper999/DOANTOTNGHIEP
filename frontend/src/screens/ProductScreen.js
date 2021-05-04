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
import { Image, Label, Icon, Message,  Button, Form, Segment,Dropdown, TextArea, Card } from 'semantic-ui-react'


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
      text: '1- Poor',
      value: '1'},
    {
      key: '2',
      text: '2- Fair',
      value: '2',},
    {
      key: '3',
      text: '3- Good',
      value: '3'},
    {
      key: '4',
      text: '4- Very good',
      value: '4'},
    {
      key: '5',
      text: '5- Excelent',
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
            <div className="col-2 p-3 mr-3">
              <h1>{product.name}</h1>
              <ul>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </li>
                <li className="description">
                  Description: {product.description}
                </li>
                <li></li>
              </ul>

              <Card>
                <Card.Content>
                  <Card.Meta>
                    <div className="row price p-1">
                      <div> Price</div>
                      <div>${product.price}</div>
                    </div>
                  </Card.Meta>
                  <div className="row price p-1">
                    <div>Status</div>
                    <div>
                      {product.countInStock > 0 ? (
                        <span className="success">In Stock</span>
                      ) : (
                        <span className="danger">Unavailable</span>
                      )}
                    </div>
                  </div>
                </Card.Content>
                <Card.Content>
                  {product.countInStock > 0 && (
                    <div>
                      <div className="row price p-1">
                        <div>Qty</div>
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
                  >Add to Cart
                  </Button>
                )}
                </Card.Content>
              </Card>
            </div>
          </div>
          <div className="reviewArea">
            <h2 id="reviews">
                Reviews
            </h2>
            {product.reviews.length === 0 && (
              <MessageBox>
                <Message compact warning size="huge" color="red">
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
                    <i> at &nbsp;{review.createdAt.substring(0, 10)}</i>
                  </p>
                  <p className="reviewContent">{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <Segment color='grey' secondary padded piled tertiary className="reviewForm">
                    <Form inverted onSubmit={submitHandler}>
                      <h2 className="textCenter">Write your review</h2>
                      <Form.Field>
                        <label className="textRating" htmlFor="rating">Rating</label>
                        <Dropdown
                          fluid
                          selection
                          id="rating"
                          value={rating}
                          onChange={(e, data) => setRating(data.value)}
                          options={ratingOptions}
                          placeholder="Select..."
                        ></Dropdown>
                      </Form.Field>
                      <Form.Field>
                        <label className="textRating">Comment</label>
                        <TextArea
                          id="comment"
                          value={comment}
                          rows={3}
                          placeholder="Enter your comment..."
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
                          Submit
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
                    Please <Link to="/signin">Sign In</Link> to write a review
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