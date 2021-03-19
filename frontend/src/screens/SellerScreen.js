import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '../actions/userActions';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { listProducts } from './../actions/productActions';
import LoadingBox from './../components/LoadingBox';
import Rating from './../components/Rating';

export default function SellerScreen(props) {
    const sellerId = props.match.params.id;
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails);
    const {loading, error, user} = userDetails;
    const productList = useSelector(state=> state.productList);
    const {loading: loadingProducts, error: errorProducts, products} = productList;

    useEffect(()=>{
        dispatch(detailsUser(sellerId));    //get seller info
        dispatch(listProducts({seller: sellerId})); //get products of this user

    }, [dispatch, sellerId])
    return (
        <div className="row top">
            <div className="col-1">
                {loading? (<LoadingBox></LoadingBox>) : error ? (<MessageBox variant="danger">{error}</MessageBox>):(
                    <ul className="card card-body">
                        <li>
                            <div className="row start">
                                <div className="p-1">
                                    <img className="small" src={user.seller.logo} alt = {user.seller.name}></img>
                                </div>
                                <div className="p-1">
                                    <h1>{user.seller.name}</h1>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Rating
                                rating = {user.seller.rating}
                                numReviews = {`${user.seller.numReviews}`}
                            ></Rating>
                        </li>
                        <li>
                            <a href={`Mail to: ${user.mail}`}>Contact Seller</a>
                        </li>
                        <li>
                            {user.seller.description}
                        </li>
                    </ul>
                )}

            </div>
            <div className="col-3">
                {loadingProducts? (<LoadingBox></LoadingBox>) : errorProducts ? (<MessageBox variant="danger">{errorProducts}</MessageBox>):(
                    <>
                        {products.length ===0 && <MessageBox variant="danger">No Product</MessageBox>}
                        <div className="row center">
                            {products.map((product) => (
                                <Product key={product._id} product={product}></Product>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}
