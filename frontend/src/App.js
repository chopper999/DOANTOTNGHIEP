import React, { useEffect, useState } from 'react';
import "./App.css";
import {BrowserRouter, Route, Link} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector, useDispatch } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';
import ProductListScreen from './screens/ProductListScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import { signout } from './actions/userActions';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SearchBox from './screens/SearchBox';
import SearchResultScreen from './screens/SearchResultScreen';
import { listProductCategories } from './actions/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';


function App() {

  const cart = useSelector((state) => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const {cartItems} = cart;
  const userSignin = useSelector((state)=>state.userSignin);
  const {userInfo} = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {  
    dispatch(signout()); 
  };

  const productCategoryList = useSelector(state => state.productCategoryList);
  const { loading: loadingCategory, error: errorCategory, categories } = productCategoryList;

  useEffect(() =>{
    dispatch(listProductCategories());
  },[dispatch]);
                    
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              Shopping
            </Link>
          </div>
            <Route render={({history}) => <SearchBox history={history}></SearchBox>}></Route> 
          <div>
            <Link to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>{" "}
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategory ? (
              <LoadingBox></LoadingBox>
            ) : errorCategory ? (
              <MessageBox variant="danger">{errorCategory}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>

        <main className="main">
          <div className="content">
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/orderhistory" component={OrderHistoryScreen} />
            <PrivateRoute path="/profile" component={ProfileScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen}  exact/>
            <Route path="/product/:id/edit" component={ProductEditScreen}  exact/>
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
            <Route path="/search/name/:name?" exact={true} component={SearchResultScreen} />
            <Route path="/search/category/:category" exact={true} component={SearchResultScreen} />
            <Route path="/search/category/:category/name/:name" exact={true} component={SearchResultScreen} />

            <AdminRoute path="/productlist" component={ProductListScreen} exact />
            <AdminRoute path="/orderlist" component={OrderListScreen}/>
            <AdminRoute path="/userlist" component={UserListScreen}/>
            <AdminRoute path="/user/:id/edit" component={UserEditScreen}/>

          </div>
        </main>
        <footer className="footer"></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
