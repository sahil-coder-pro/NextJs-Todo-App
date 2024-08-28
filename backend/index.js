import express from "express" ;
import mongoose from "mongoose";
import dotenv from "dotenv" ;

dotenv.config({
    origin: "./.env"
})

const app = express() ;

const PORT = process.env.PORT ;

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`)
})