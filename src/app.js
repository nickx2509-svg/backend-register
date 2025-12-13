import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import compression from "compression";
import helmet from "helmet";

const app = express();


const limit = "20mb"
app.use(cors({
  origin:process.env.ORIGIN, // ORIGIN = *
  credentials:true
}))

app.use(compression()) //  compress the responce to make api faster

app.use(helmet())// prevent by common attacks


// Parse cookies sent by the client and make them available in req.cookies
// Without this, req.cookies will be undefined
app.use(cookieParser());

// Parse incoming JSON data and store it in req.body
// limit: maximum allowed JSON size (protects server)
app.use(express.json({ limit }));

// Parse incoming form data (x-www-form-urlencoded) and store it in req.body
// extended: true → allows nested objects & arrays
// limit: maximum allowed form data size
app.use(express.urlencoded({ extended: true, limit }));



// import router from routes file
import router from "./routes/customer.routes.js";

app.use("/api/v1/customers",router)


export {app}