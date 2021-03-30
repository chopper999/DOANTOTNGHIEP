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
import SellerRoute from './components/SellerRoute';
import SellerScreen from './screens/SellerScreen';

//UI
import { Menu, Button, Segment, Icon, Dropdown } from 'semantic-ui-react';
import MapScreen from './screens/MapScreen';





function App() {

  const cart = useSelector((state) => state.cart);
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
       
  //UI
  const [activeItem, setActiveItem] = useState('');
  const handleItemClick = ({name} ) => setActiveItem({ activeItem: name});
  
  return (
    <BrowserRouter>
      {/* UI */}
      <div className="grid-container">
        <div className="menuTop">
          <Segment inverted className="segmentHeader">
            <Menu inverted secondary className="menuHeader">
              <img
                src="/logoChopper.jpg"
                className="ui tiny circular image"
                alt="Chopper"
              />
              <Link to="/">
                <Menu.Item
                  className="brandName"
                  name="CHOPPER SHOP"
                  as="h1"
                  active={activeItem === "CHOPPER SHOP"}
                  onClick={handleItemClick}
                />
              </Link>
              <Menu.Item className="inputSearchContainer">
                <Route
                  render={({ history }) => (
                    <SearchBox history={history}></SearchBox>
                  )}
                ></Route>
              </Menu.Item>

              <Menu.Item className="iconCart">
                <Link to="/cart">
                  <Icon color="yellow" name="cart" link size="big"></Icon>
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </Link>
              </Menu.Item>
              <Menu.Item className="btnSignin">
                <Segment inverted>
                  <Menu inverted pointing secondary>
                    <Menu.Item>
                      {userInfo ? (
                        <Dropdown text={userInfo.name}>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link className="dropdownItem" to="/profile">
                                  User Profile
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link
                                  className="dropdownItem"
                                  to="/orderhistory"
                                >
                                  Order History
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link
                                  className="dropdownItem"
                                  to="#signout"
                                  onClick={signoutHandler}
                                >
                                  Sign Out
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <Link to="/signin" className="btnSignin1">
                          <Button inverted color="yellow">
                            <Icon name="sign-in"></Icon>
                            Sign In
                          </Button>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {userInfo && userInfo.isSeller && (
                        <Dropdown text="Seller">
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link className="dropdownItem" to="/dashboard">
                                  Dashboard
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link
                                  className="dropdownItem"
                                  to="/productlist/seller"
                                >
                                  Products
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link
                                  className="dropdownItem"
                                  to="/orderlist/seller"
                                >
                                  Orders
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {userInfo && userInfo.isAdmin && (
                        <Dropdown text="Admin">
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link className="dropdownItem" to="/dashboard">
                                  Dashboard
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link
                                  className="dropdownItem"
                                  to="/productlist"
                                >
                                  Products
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link className="dropdownItem" to="/orderlist">
                                  Orders
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Dropdown.Text>
                                <Link className="dropdownItem" to="/userlist">
                                  Users
                                </Link>
                              </Dropdown.Text>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Menu.Item>
                  </Menu>
                </Segment>
              </Menu.Item>
            </Menu>
          </Segment>
        </div>

        <div className="navbar">
          <Menu color={"yellow"} inverted size='huge'>
          <Menu.Menu>
          <Dropdown item text='Category'>
          <Dropdown.Menu>
                  {loadingCategory ? (
                    <LoadingBox></LoadingBox>
                  ) : errorCategory ? (
                    <MessageBox variant="danger">{errorCategory}</MessageBox>
                  ) : (
                    categories.map((c) => (
                      <Dropdown.Item  key={c}>
                        <Link className="dropdownItem"
                          to={`/search/category/${c}`}
                          // onClick={() => setSidebarIsOpen(false)}
                        >
                          {c}
                        </Link>
                        </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
        
          <Link to="/">
          <Menu.Item name="HOME"
                  active={activeItem === "HOME"}
                  onClick={handleItemClick}
        />
          </Link>
          <Link to="">
          <Menu.Item name="Introduction"
                  active={activeItem === "Introduction"}
                  onClick={handleItemClick}
        />
          </Link>

        
      </Menu>
        </div>

        
        <main className="main">
          <div className="content">
            <Route path="/seller/:id" component={SellerScreen} />
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/orderhistory" component={OrderHistoryScreen} />
            <PrivateRoute path="/profile" component={ProfileScreen} />
            <PrivateRoute path="/map" component={MapScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen} exact />
            <Route
              path="/product/:id/edit"
              component={ProductEditScreen}
              exact
            />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
            <Route
              path="/search/name/:name?"
              exact={true}
              component={SearchResultScreen}
            />
            <Route
              path="/search/category/:category"
              exact={true}
              component={SearchResultScreen}
            />
            <Route
              path="/search/category/:category/name/:name"
              exact={true}
              component={SearchResultScreen}
            />

            <AdminRoute
              path="/productlist"
              component={ProductListScreen}
              exact
            />
            <AdminRoute path="/orderlist" component={OrderListScreen} exact />
            <AdminRoute path="/userlist" component={UserListScreen} />
            <AdminRoute path="/user/:id/edit" component={UserEditScreen} />

            <SellerRoute
              path="/productlist/seller"
              component={ProductListScreen}
            ></SellerRoute>
            <SellerRoute
              path="/orderlist/seller"
              component={OrderListScreen}
            ></SellerRoute>
          </div>
        </main>
        <footer className="footer"></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
