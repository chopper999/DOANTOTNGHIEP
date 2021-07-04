import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from './../components/Product';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Link, useParams } from 'react-router-dom';
import { listTopProduct } from './../actions/productActions';
import { Grid, Divider } from 'semantic-ui-react';
 

export default function HomeScreen() {
  const {
    pageNumber = 1,
  } = useParams(); //hook
  
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  //for Carousel
  const productTopList = useSelector((state)=> state.productTopList);
  const {loading: loadingTopProduct, error: errorTopProduct, products: productsTopList } = productTopList;

  useEffect(() => {  
    dispatch(listProducts({pageNumber})); 
    dispatch(listTopProduct());
  }, [dispatch,pageNumber]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div>
      {loadingTopProduct ? (
        <LoadingBox></LoadingBox>
      ) : errorTopProduct ? (
        <MessageBox variant="danger">{errorTopProduct}</MessageBox>
      ) : (
        <div className = "carousel">
          {productsTopList.length === 0 && (
            <MessageBox className="topProduct">Không có sản phẩm</MessageBox>
          )}
          {
            <Slider {...settings}>
            {productsTopList.map((e) => (
                <div key={e._id} className="imgCRS">
                  <Link to={`/product/${e._id}`}>
                    <img className="imgCarousel" src={e.image} alt={e.name}></img>
                    <p className="nameProductCarousel">{e.name}</p>
                  </Link>
                </div>
              ))}
            </Slider>
              
          }
          
        </div>
      )}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && (
            <MessageBox className="topProduct">Không có sản phẩm</MessageBox>
          )}
         
          <Divider className="dividerAllProduct"></Divider>
          
          <h2 className="topProduct allProductLable">Tất cả sản phẩm</h2>
          
          <Grid className="contain-product" columns={2} divided>
            <Grid.Row>
              {/* <Grid.Column> */}
              {products.map((product) => (
                <Product key={product._id} product={product}></Product>
              ))}
              {/* </Grid.Column> */}
            </Grid.Row>
          </Grid>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/pageNumber/${x + 1}`}
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

