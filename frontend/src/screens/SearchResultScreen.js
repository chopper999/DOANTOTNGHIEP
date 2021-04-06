import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from './../actions/productActions';
import { useParams, Link } from 'react-router-dom';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import Product from './../components/Product';
import { List, Statistic, Icon} from 'semantic-ui-react';
import { prices, ratings } from './../utils';
import Rating from './../components/Rating';

export default function SearchResultScreen(props) {
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "",
  } = useParams(); //hook
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(
      listProducts({
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    ); //all lay het product ra
  }, [dispatch, name, category, min, max, rating, order]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
  };

  return (
    <div>
      <div className="row p-1">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            <Statistic inverted>
              <Statistic.Value>{products.length}</Statistic.Value>
              <Statistic.Label className="labelResult">Results</Statistic.Label>
            </Statistic>
          </div>
        )}
        <div>
          Sort by {""}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Avg. Customer Reviews</option>
          </select>
        </div>
      </div>

      <div className="row top">
        <div className="col-1">
          <div>
            {" "}
            <h1 className="textCategory">Categories</h1>
            {loadingCategory ? (
              <LoadingBox></LoadingBox>
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              <List animated verticalAlign="middle" size="big">
                <List.Item>
                  <Link
                    className={"all" === category ? "active" : "nameCategory"}
                    to={getFilterUrl({ category: "all" })}
                  >
                    <Icon name="arrow alternate circle right"></Icon>
                    Any
                  </Link>
                </List.Item>
                {categories.map((c) => (
                  <List.Item key={c}>
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
          <div>
            <h1>Price</h1>
            <ul>
              {prices.map((p) => (
                <li key={p.name}>
                  <Link
                    to={getFilterUrl({ min: p.min, max: p.max })}
                    className={
                      `${p.min}-${p.max}` === `${min}-${max}` ? "active" : ""
                    }
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1>Customer Review</h1>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption={"& up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-3">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && (
                <MessageBox>
                  <h1 className="noProduct">No Product Found</h1>
                </MessageBox>
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
