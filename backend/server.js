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
import fileUpload from 'express-fileupload';



dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));

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
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/config/google', (req, res) => {
    res.send(process.env.GOOGLE_API_KEY || '');
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));  // su dung dirname de concat tu current folder to uploads folder
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')));
//'/frontend/build/index.html'

app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.listen(5000, ()=>{ console.log("Server started at http://localhost:5000")})