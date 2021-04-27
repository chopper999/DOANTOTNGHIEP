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
      <Image src={product.image} wrapped ui={true} alt={product.name} />
      </Link>
      <Card.Content>
        <Link to={`/product/${product._id}`}>
          <Card.Header>{product.name}</Card.Header>
        </Link>
        <Card.Meta>
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