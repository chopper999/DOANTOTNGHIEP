import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from './../components/Product';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';


export default function HomeScreen() {
  
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  
  useEffect(() => {  
    dispatch(listProducts({}));

  }, [dispatch]);

  return (
    <div>
      <>
        <Carousel showArrows autoPlay showThumbs={false}>
          <div>
            <Link to="/">
              <img src="./../../uploads/1609396321557.jpg" alt="" />
            </Link>
          </div>
          <div>
            <Link to="/">
              <img src="./../../uploads/1609396387848.jpg" alt="" />
            </Link>
          </div>
          <div>
            <Link to="/">
              <img src="./../../uploads/1609396804796.jpg" alt="" />
            </Link>
          </div>
        </Carousel>
      </>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <div className="row center">
            {products.map(product => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

