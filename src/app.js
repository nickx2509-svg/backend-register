import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import compression from "compression";
import helmet from "helmet";

const app = express();

const limit = "2mb"

app.use(cors({
  origin:process.env.ORGIN, // ORIGIN = *
  credentials:true
}))

app.use(compression()) //  compress the responce to make api faster

app.use(helmet())// prevent by common attacks


// Parse cookies sent by the client and make them available in req.cookies
// Without this, req.cookies will be undefined
app.use(cookieParser());

// Parse incoming JSON data and store it in req.body
// limit: maximum allowed JSON size (protects server)
app.use(express.json({ limit: "2mb" }));

// Parse incoming form data (x-www-form-urlencoded) and store it in req.body
// extended: true → allows nested objects & arrays
// limit: maximum allowed form data size
app.use(express.urlencoded({ extended: true, limit: "2mb" }));





app.get('/',(req,res) => {
  res.status(200).send("Naman Jain")
})
export {app}