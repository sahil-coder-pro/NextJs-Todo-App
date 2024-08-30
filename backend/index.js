import express from "express" ;
import mongoose from "mongoose";
import dotenv from "dotenv" ;
import cors from "cors" ;


dotenv.config({
    origin: "./.env"
})

const app = express() ;

const PORT = process.env.PORT ;

// set middlewares
app.use(express.json()) ;

app.use(express.urlencoded({extended: false})) ; 
// extended allows for processing complex query parametes like
// When using extended: true, a query string like foo[bar]=baz will be parsed into: { foo: { bar: 'baz' } }
// and false is for simple key value pairs

app.use(cors({
    origin: process.env.CORS_FRONTEND_ORIGIN ,
}))


// db connection
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_COLLECTION_NAME}`)
.then((dbConnectionInstance) => {
    console.log(`Connected to db: ${dbConnectionInstance.connection.host}`)
})
.catch(err => {
    console.error(`${err}, Could not connect to the database`)
})


// routing
import todosRouter from "./src/routes/Todo.routes.js"

// send the todo routes to todo route handler
app.use("/api/v1/todos", todosRouter) ;




app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`)
})