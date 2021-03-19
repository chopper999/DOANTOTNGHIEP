import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from './../components/Product';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { listTopProduct } from './../actions/productActions';


export default function HomeScreen() {
  
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  //for Carousel
  const productTopList = useSelector((state)=> state.productTopList);
  const {loading: loadingTopProduct, error: errorTopProduct, products: productsTopList } = productTopList;

  useEffect(() => {  
    dispatch(listProducts({})); //truyen vao object rong de khong filter
    dispatch(listTopProduct());
  }, [dispatch]);

  return (
    <div>
    <h2>Top Products</h2>
    {loadingTopProduct ? (
        <LoadingBox></LoadingBox>
      ) : errorTopProduct ? (
        <MessageBox variant="danger">{errorTopProduct}</MessageBox>
      ) : (
      <>
      {productsTopList.length === 0 && <MessageBox>No Product Found</MessageBox>}
        <Carousel showArrows autoPlay showThumbs={false}>
          {productsTopList.map(e => (
            <div key={e._id}>
              <Link to={`/product/${e._id}`}>
                <img src={e.image} alt={e.name}></img>
                <p className="legend">{e.name}</p>
              </Link>
            </div>
          ))}
        </Carousel>
      </>
      )}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <h2>All Products</h2>
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

