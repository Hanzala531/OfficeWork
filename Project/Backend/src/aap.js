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

import router from "./routes/product.route.js"

app.use("/api/v1/products" , router);

export {app}