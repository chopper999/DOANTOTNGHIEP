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

//UI
import { Menu, Button, Segment, Icon, Dropdown, Image, Divider } from 'semantic-ui-react';
import SupportMessScreen from './screens/SupportMessScreen';
import ChatBox from './components/ChatBox';
import QandAScreen from './screens/QandaScreen';
import QandaEditScreen from './screens/QandaEditScreen';
import DatasetScreen from './screens/DatasetScreen';
import DatasetEditScreen from './screens/DatasetEditScreen';





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
            <Menu pointing inverted secondary className="menuHeader">
              <Menu.Item>
                <Image
                  className="imgLogo"
                  src="/logoChopper.jpg"
                  size="tiny"
                  circular
                />
              </Menu.Item>
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
                  <Icon
                    className="iconCart1"
                    name="cart"
                    link
                    size="massive"
                    color="red"
                  ></Icon>
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </Link>
              </Menu.Item>
              <Menu.Item className="btnSignin">
                <Menu pointing secondary>
                  <Menu.Item>
                    {userInfo ? (
                      <Dropdown text={userInfo.name} className="txtDropdown">
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
                              <Link className="dropdownItem" to="/orderhistory">
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
                        <Button size="huge" color={"red"}>
                          <Icon name="sign-in"></Icon>
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {userInfo && userInfo.isAdmin && (
                      <Dropdown className="txtDropdown" text="Admin">
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
                              <Link className="dropdownItem" to="/productlist">
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
                          <Dropdown.Item>
                            <Dropdown.Text>
                              <Link className="dropdownItem" to="/support">
                                Support
                              </Link>
                            </Dropdown.Text>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Dropdown.Text>
                              <Link className="dropdownItem" to="/qanda">
                                Q&A
                              </Link>
                            </Dropdown.Text>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Dropdown.Text>
                              <Link className="dropdownItem" to="/dataset">
                                Dataset Q&A
                              </Link>
                            </Dropdown.Text>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Menu.Item>
                </Menu>
                {/* </Segment> */}
              </Menu.Item>
            </Menu>
          </Segment>
        </div>

        <div className="navbar">
          <Divider fitted className="dividerLine" />
          <Segment className="colorNavbar" inverted>
            <Menu
              className="containerNavbar"
              inverted
              secondary
              pointing
              size="huge"
            >
              <Dropdown item text="CATEGORY">
                <Dropdown.Menu>
                  {loadingCategory ? (
                    <LoadingBox></LoadingBox>
                  ) : errorCategory ? (
                    <MessageBox variant="danger">{errorCategory}</MessageBox>
                  ) : (
                    categories.map((c) => (
                      <Dropdown.Item key={c}>
                        <Link
                          className="dropdownItem"
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
              <Link to="/">
                <Menu.Item
                  name="HOME"
                  active={activeItem === "HOME"}
                  onClick={handleItemClick}
                />
              </Link>
              <Link to="/search/name/">
                <Menu.Item
                  name="SHOP"
                  active={activeItem === "SHOP"}
                  onClick={handleItemClick}
                />
              </Link>
              <Link to="/">
                <Menu.Item
                  name="CONTACT"
                  active={activeItem === "CONTACT"}
                  onClick={handleItemClick}
                />
              </Link>
            </Menu>
          </Segment>
        </div>

        <main className="main">
          <div className="content">
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/orderhistory" component={OrderHistoryScreen} exact />
            <Route
              path="/orderhistory/pageNumber/:pageNumber"
              component={OrderHistoryScreen}
              exact
            />
            <PrivateRoute path="/profile" component={ProfileScreen} />
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
              path="/pageNumber/:pageNumber"
              exact={true}
              component={HomeScreen}
            />
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
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
              exact={true}
              component={SearchResultScreen}
            />

            <AdminRoute
              path="/productlist"
              component={ProductListScreen}
              exact
            />
            <AdminRoute
              path="/productlist/pageNumber/:pageNumber"
              component={ProductListScreen}
              exact
            />
            <AdminRoute path="/orderlist" component={OrderListScreen} exact />
            <AdminRoute
              path="/orderlist/pageNumber/:pageNumber"
              component={OrderListScreen}
              exact
            />
            <AdminRoute path="/userlist" component={UserListScreen} exact />
            <AdminRoute
              path="/userlist/pageNumber/:pageNumber"
              component={UserListScreen}
              exact
            />
            <AdminRoute path="/user/:id/edit" component={UserEditScreen} />
            <AdminRoute path="/support" component={SupportMessScreen} />
            <AdminRoute path="/qanda" component={QandAScreen} exact />
            <AdminRoute
              path="/qanda/:index/edit"
              component={QandaEditScreen}
              exact
            />

            <AdminRoute path="/dataset" component={DatasetScreen} exact />
            <AdminRoute
              path="/dataset/:index/edit"
              component={DatasetEditScreen}
              exact
            />
          </div>
        </main>
        <footer className="row center footer">
          {userInfo && !userInfo.isAdmin && (
            <ChatBox userInfo={userInfo}></ChatBox>
          )}
          <div className="footerContainer">
            <div className="row">
              <div className="columnFooter">
                <i className="fa fa-3x fa-map-marker"></i>
                <h4>Vị trí</h4>
                <p>29/2/19 Lê Đức Thọ, Gò Vấp, Tp Hồ Chí Minh</p>
              </div>
              <div className="columnFooter">
                <i className="fa fa-3x fa-envelope"></i>
                <h4>Email</h4>
                <p>vanspykid85@gmail.com</p>
              </div>
              <div className="columnFooter">
                <i className="fa fa-3x fa-facebook-f"></i>
                <h4>Facebook</h4>
                <p><a href="https://www.facebook.com/tibbers.annie.75" target="_blank" className="linkWhite">https://www.facebook.com/tibbers.annie.75</a></p>
              </div>
              <div className="columnFooter">
                <i className="fa fa-3x fa-phone"></i>
                <h4>Điện thoại</h4>
                <p>0378938915</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}


export default App;
