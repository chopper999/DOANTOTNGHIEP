import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'User1',
      email: 'user1@gmail.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: true,
      isSeller: true,
      seller: {
        name: 'Seller1',
        logo: '/images/logo.png',
        description: 'best seller',
        rating: 4.5,
        numReviews: 120,
      },
    },
    {
      name: 'User2',
      email: 'user2@gmail.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Shirt1',
      category: 'Shirts',
      image: '/images/img1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Brand1',
      rating: 4.5,
      numReviews: 10,
      description: 'good product',
    },
    {
      name: 'Shirt2',
      category: 'Shirts',
      image: '/images/img1.jpg',
      price: 100,
      countInStock: 20,
      brand: 'Brand2',
      rating: 4.0,
      numReviews: 10,
      description: 'top product',
    },
  ],
};
export default data;