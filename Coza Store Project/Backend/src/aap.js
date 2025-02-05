import express , {urlencoded} from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express();

app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))

app.use(express.json(
    {
        limit : "30kb"
    }
))

app.use(urlencoded(
    {
        extended:true,
        limit:"16kb"
    }
))

app.use(express.static("public"));

app.use(cookieparser());

// import productRouter from "./routes/product.routes.js"
import userRouter from './routes/user.routes.js';
import categoryRouter from './routes/category.routes.js';
// app.use("/api/v1/products" , productRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/categories" , categoryRouter);


export {app}