import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from './../actions/productActions';
import { useParams, Link } from 'react-router-dom';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import Product from './../components/Product';
import {Label, List, Statistic, Icon} from 'semantic-ui-react';

export default function SearchResultScreen(props) {
  const { name = "all", category= "all" } = useParams(); //hook
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { loading, error, products } = productList;

  const productCategoryList = useSelector(state => state.productCategoryList);
  const { loading: loadingCategory, error: errorCategory, categories } = productCategoryList;

  useEffect(() => {
    dispatch(listProducts({ name: name !== "all" ? name : "", 
    category: category !=="all" ? category:"" })); //all lay het product ra
  }, [dispatch, name, category]);

  const getFilterUrl= (filter) => {
      const filterCategory = filter.category || category;
      const filterName = filter.name || name;
      return `/search/category/${filterCategory}/name/${filterName}`;
  }
  return (
    <div>
      <div className="row p-1">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            {/* <Label basic color="yellow" tag size="big">
              {products.length} Results
            </Label> */}
            <Statistic inverted>
              <Statistic.Value>{products.length}</Statistic.Value>
              <Statistic.Label className="labelResult">Results</Statistic.Label>
            </Statistic>
          </div>
        )}
      </div>
      <div className="row top">
        <div className="col-1">
            {" "}
            <h1 className="textCategory">Categories</h1>
          {loadingCategory ? (
            <LoadingBox></LoadingBox>
          ) : errorCategory ? (
            <MessageBox variant="danger">{errorCategory}</MessageBox>
          ) : (
            /* <ul>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? "active" : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul> */
            <List animated verticalAlign="middle" size = 'big'>
              {categories.map((c) => (
                <List.Item key={c} >
                  <Link
                    className={c === category ? "active" : "nameCategory"}
                    to={getFilterUrl({ category: c })}
                  >
                    <Icon name="arrow alternate circle right"></Icon>
                    {c}
                  </Link>
                </List.Item>
              ))}
            </List>
          )}
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && (
                <MessageBox ><h1 className="noProduct">No Product Found</h1></MessageBox>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
