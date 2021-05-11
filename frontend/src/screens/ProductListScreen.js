import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, createProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';
import { deleteProduct } from './../actions/productActions';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export default function ProductListScreen(props) {
  const {
    pageNumber = 1,
  } = useParams(); //hook
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productCreate = useSelector(state=> state.productCreate);
  const {loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct} = productCreate; 

  const productDelete = useSelector((state) => state.productDelete);
  const {loading: loadingDetele, error: errorDelete, success: successDelete} = productDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
        dispatch({type: PRODUCT_CREATE_RESET}); //Sau khi tao product thanh cong thi reset lai 
        props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({type: PRODUCT_DELETE_RESET});
    }
    dispatch(listProducts({ pageNumber }));  //truyen vao userId de filter
  }, [createdProduct, dispatch, props.history, successCreate, successDelete, userInfo._id, pageNumber]); //sau khi tao hoac xoa thanh cong, dispatch toi listProduct de reload lai 
    

  const deleteHandler = (product) => {
    if (window.confirm("Are you sure to delete this product?")) {
      dispatch(deleteProduct(product._id));
    }
    
  };

  const createHandler = () => {
      dispatch(createProduct());
  };
  return (
    <div className="containerNavbar">
      <h1 className="centerText mt-20 mb4">Products</h1>
      <div className="btnCreateProduct">
          <Button
            color="green"
            type="button"
            onClick={createHandler}
          >
            Create Product
          </Button>
      </div>
      {loadingDetele && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button 
                    primary
                    type="button"
                    onClick={() =>
                        props.history.push(`/product/${product._id}/edit`)}
                    >Edit</Button>
                    <Button 
                    color="red"
                    type="button"
                    onClick={() => deleteHandler(product)}
                    >Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
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