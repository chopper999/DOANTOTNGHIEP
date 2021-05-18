import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Card, Icon, Image, Transition } from 'semantic-ui-react';
import { useState } from 'react';


export default function Product(props) {
  const { product } = props;
  const [visi, setVisi] = useState(true);
  const toggleVisibility = ()=>{
    setVisi(!visi);
  };
  return (
    <Transition animation = {'pulse'} duration = {500} visible= {visi}>
    <Card className="product">
      <Link to={`/product/${product._id}`} onMouseEnter ={toggleVisibility}   >
      <Image className='imgFix' src={product.image} wrapped ui={true} alt={product.name} />
      </Link>
      <Card.Content className="alignCenter">
        <Link to={`/product/${product._id}`}>
          <Card.Header className="productNameCard">{product.name}</Card.Header>
        </Link>
        <Card.Meta className="priceCard">
          <Icon name="dollar" />
          {product.price}
        </Card.Meta>
        <Rating 
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
      </Card.Content>
      
    </Card>
    </Transition>
  );
}