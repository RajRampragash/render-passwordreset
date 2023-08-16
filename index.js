console.log("password reset")
// import ecpress
import express from "express"
// import dotenv from "dotenv";
import cors from "cors"
//import { dbConnection } from "./db.js";
import userRouter from "./Routers/router.js";
// dotenv.config();

//define port 
const PORT = 3200

const app = express();
// dbConnection();

//middle wares
app.use(express.json())
app.use(cors())

//user is the base route 
app.use("/user", userRouter)

app.get("/", (req, res) => {
    res.send({ message: "conection working-good" })
})


app.listen(PORT, () => console.log(`Server started at localhost:${PORT}`))