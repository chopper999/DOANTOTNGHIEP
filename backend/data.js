import bcrypt from 'bcryptjs';
export default {

    users: [
        {
          name: 'Chopper',
          email: 'vanspykid85@gmail.com',
          password: bcrypt.hashSync('123456', 8),
          isAdmin: true,
          },
      ],
    products:[
        {
        name: 'Áo thun',
        category: 'Áo',
        image:'/images/img1.jpg',
        brand: 'Yamee',
        description: 'abc',
    },
    {
        name: 'Ao tay dai',
        category: 'Áo',
        image:'/images/img1.jpg',
        brand: 'Yamee',
        description: 'abc',
    },
    {
        name: 'Áo tay ngắn',
        category: 'Áo',
        image:'/images/img1.jpg',
        brand: 'Yamee',
        description: 'abc',
    },
    

]

}