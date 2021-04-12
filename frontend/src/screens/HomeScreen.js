import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from './../components/Product';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Link, useParams } from 'react-router-dom';
import { listTopProduct } from './../actions/productActions';
import { Grid } from 'semantic-ui-react';
 

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

  return (
    <div>
      <h2 className="topProduct">Top Products</h2>
      {loadingTopProduct ? (
        <LoadingBox></LoadingBox>
      ) : errorTopProduct ? (
        <MessageBox variant="danger">{errorTopProduct}</MessageBox>
      ) : (
        <>
          {productsTopList.length === 0 && (
            <MessageBox className="topProduct">No Product Found</MessageBox>
          )}
          <Carousel showArrows autoPlay showThumbs={false}>
            {productsTopList.map((e) => (
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
          {products.length === 0 && (
            <MessageBox className="topProduct">No Product Found</MessageBox>
          )}
          <h2 className="topProduct">All Products</h2>
          <Grid className="contain-product" columns={2} divided>
            <Grid.Row>
              {/* <Grid.Column> */}
                {products.map((product) => (
                  
                  <Product  key={product._id} product={product}></Product>
                  
                ))}
              {/* </Grid.Column> */}
            </Grid.Row>
          </Grid>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/pageNumber/${x+1}`}
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

