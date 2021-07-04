import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from './../actions/productActions';
import { useParams, Link } from 'react-router-dom';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import Product from './../components/Product';
import { List, Statistic, Icon } from 'semantic-ui-react';
import { prices, ratings } from './../utils';
import Rating from './../components/Rating';

export default function SearchResultScreen(props) {
  const {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "newest",
    pageNumber = 1,
  } = useParams(); //hook
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(
      listProducts({
        pageNumber,
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    ); //all lay het product ra
  }, [dispatch, name, category, min, max, rating, order, pageNumber]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };

  return (
    <div>
      <div className="row top">
        <div className="col-1">
          <div>
            {" "}
            <h1 className="textCategory">Danh mục</h1>
            {loadingCategory ? (
              <LoadingBox></LoadingBox>
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              <List animated verticalAlign="middle" size="big">
                <List.Item>
                  <Link
                    className={
                      "all" === category ? "activeName" : "nameCategory"
                    }
                    to={getFilterUrl({ category: "all" })}
                  >
                    <Icon name="arrow alternate circle right"></Icon>
                    Tất cả
                  </Link>
                </List.Item>
                {categories.map((c) => (
                  <List.Item key={c}>
                    <Link
                      className={c === category ? "activeName" : "nameCategory"}
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
          <div className="mt-20">
            <h1 className="textCategory">Khoảng giá</h1>
            {prices.map((p) => (
              <List animated verticalAlign="middle" size="big">
                <List.Item key={p}>
                  <Link
                    to={getFilterUrl({ min: p.min, max: p.max })}
                    className={
                      `${p.min}-${p.max}` === `${min}-${max}`
                        ? "activeName"
                        : "namePrice"
                    }
                  >
                    {p.name}
                  </Link>
                </List.Item>
              </List>
            ))}
          </div>

          <div className="mt-20">
            <h1 className="textCategory">Đánh giá khách hàng</h1>
            {ratings.map((r) => (
              <List animated verticalAlign="middle" size="big">
                <List.Item key={r}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption={"trở lên"} rating={r.rating}></Rating>
                  </Link>
                </List.Item>
              </List>
            ))}
          </div>
        </div>
        <div className="col-3">
          <div className='row'>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <div className="ml-60">
              <Statistic inverted>
                <Statistic.Value className="numProduct">
                  {/* {products.length} */}
                </Statistic.Value>
                <Statistic.Label className="labelResult">
                  {/* Results */}
                </Statistic.Label>
              </Statistic>
            </div>
          )}
          <div className="mr-60 numProduct textSort">
            <div className="box">
              Sắp xếp theo {""}
              <select
                value={order}
                onChange={(e) => {
                  props.history.push(getFilterUrl({ order: e.target.value }));
                }}
              >
                <option value="newest">Mới nhất</option>
                <option value="lowest">Giá thấp đến cao</option>
                <option value="highest">Giá cao xuống thấp</option>
                <option value="toprated">Đánh giá của khách hàng</option>
              </select>
            </div>
          </div>
          </div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {products.length === 0 && (
                <MessageBox>
                  <h1 className="noProduct">Không có sản phẩm</h1>
                </MessageBox>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
            </>
          )}
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={getFilterUrl({ page: x + 1 })}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
