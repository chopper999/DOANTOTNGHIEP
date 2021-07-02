import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import orderRouter from './routes/orderRouter';
import path from 'path';
import productRouter from './routes/productRoute';
import userRouter from './routes/userRoute';
import uploadRouter from './routes/uploadRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import favicon from 'serve-favicon';
import qandaRoute from './routes/qandaRoute';



dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// app.use(fileUpload({
//     useTempFiles: true
// }));

const mongodbUrl = process.env.MONGODB_URL;
mongoose.connect(mongodbUrl || 'mongodb+srv://dbUser:dbUser123@cluster0.nrpsz.mongodb.net/webshopping?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
// .then(ok=>{
//     console.log("Connect successfully");
// }).catch(error => console.log(error.reason


//Dinh tuyen API
app.use('/api/uploads', uploadRouter); //app.use được sử dụng để cấu hình các middleware, các middleware function sẽ đc thực thi khi req có path match với path của route
app.use("/api/users", userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/qanda', qandaRoute);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
const __dirname = path.resolve();
app.use(favicon(__dirname + '/frontend/public/favicon.ico'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));  // su dung dirname de concat tu current folder to uploads folder
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

const port = process.env.PORT || 5000;
// app.get('/', (req, res) => {
//     res.send('Server is ready');
// });

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const httpServer = http.Server(app);
const io = new Server(httpServer, {cors: {origin:'*'}});      //Tránh bị Exception, *: cho phép tất cả các trang đều cors được
const users = [];
io.on('connection', (socket) => {          //Xử lý khi có connect từ client tới  
    console.log('connection', socket.id);
    socket.on('disconnect', () => {
      const user = users.find((x) => x.socketId === socket.id);
      if (user) {
        user.online = false;
        console.log('Offline', user.name);
        if (user.isAdmin){    //Xu ly khi admin offline thi bat flag de chay textToSpeech
          const existUserOnl = users.find((x) => !x.isAdmin && x.online);
          io.to(existUserOnl.socketId).emit('adminOff');
        }
        
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('updateUser', user);
        }
      }
    });
    socket.on('onLogin', (user) => {
      const updatedUser = {
        ...user,
        online: true,
        socketId: socket.id,
        messages: [],
      };
      const existUser = users.find((x) => x._id === updatedUser._id);
      
      if (existUser) {
        
        existUser.socketId = socket.id;
        existUser.online = true;
      } else {
        users.push(updatedUser);      //Nếu có người dùng mới thì thêm vào mảng users
      }
      console.log('Online', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', updatedUser);
      }
      if (updatedUser.isAdmin) {
        io.to(updatedUser.socketId).emit('listUsers', users);
      }
    });
  
    socket.on('onUserSelected', (user) => {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        const existUser = users.find((x) => x._id === user._id);
        io.to(admin.socketId).emit('selectUser', existUser);
      }
    });
    
    socket.on('checkAdminOnline', (data) => {
      console.log(data);
      const user = users.find((x) => !x.isAdmin && x.online);
      if(user)
      {
        io.to(user.socketId).emit('adminOnl', data);
      }
    })

    socket.on('onMessage', (message) => {
      if (message.isAdmin) {        //Nếu mess là của admin gửi đi
        const user = users.find((x) => x._id === message._id && x.online);  //tìm đến user đc nhận và truyển mess đó cho user
        if (user) {
          io.to(user.socketId).emit('message', message);
          user.messages.push(message);
        }
      } else {    //nếu là mess của user gửi cho admin
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('message', message);
          const user = users.find((x) => x._id === message._id && x.online);
          user.messages.push(message);
        } 
        else {            //trường hợp admin chưa online
          io.to(socket.id).emit('message', {
            name: 'Trợ lý',
            body: 'Sorry. I am not online right now',
          });
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
  });
// app.listen(5000, ()=>{ console.log("Server started at http://localhost:5000")});