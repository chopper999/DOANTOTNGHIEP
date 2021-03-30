import React, {useEffect} from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import MessageBox from './../components/MessageBox';
import { Grid, Message, Button,Icon, Container, Header, Item} from 'semantic-ui-react'


function CartScreen(props) {
  const cart = useSelector(state => state.cart);

  const { cartItems } = cart;

  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;
  const dispatch = useDispatch();
  const removeFromCartHandler = productId => {
    dispatch(removeFromCart(productId));
  };
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  
  return (
    <Container>
      <Header className="cart-Label" as="h1">
        SHOPPING CART
      </Header>
      <Grid>
        <Grid.Column width={10}>
          {cartItems.length === 0 ? (
            <MessageBox>
              <Message warning size="huge" color="yellow">
                <Message.Header>
                  Cart is empty.{" "}
                  <Link className="goShopping" to="/">
                    Go Shopping <Icon name="angle double right"></Icon>
                  </Link>
                </Message.Header>
              </Message>
            </MessageBox>
          ) : (
            <Item.Group>
              {cartItems.map((item) => (
                <Item key={item.product}>
                  <Item.Image size="tiny" src={item.image} alt={item.name} />
                  <Item.Content verticalAlign="middle">
                    <div className="row">
                      <Item.Header as="h3">
                        <Link
                          className="cartProductName"
                          to={`/product/${item.product}`}
                        >
                          {item.name}
                        </Link>
                      </Item.Header>
                      <select
                        className="selectItem"
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>

                      <div className="itemPrice">
                        {" "}
                        <Icon name="dollar" />
                        {item.price}
                      </div>
                      <div>
                        <Button
                          inverted
                          color="yellow"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          Delete
                        </Button>
                        
                      </div>
                    </div>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <div className="card card-body">
            <ul>
              <li>
                <h2>
                  Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items) :
                  <Icon name="dollar"></Icon>
                  {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                </h2>
              </li>
              <li>
                <Button
                inverted
                  color="orange"
                  onClick={checkoutHandler}
                  className=" block"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </li>
            </ul>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
export default CartScreen;