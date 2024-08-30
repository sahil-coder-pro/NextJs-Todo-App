import {Router} from "express" ;
import { addNewTodo, deleteTodo, getAllTodos, updateTodo } from "../controllers/Todos.controller.js";

const router = Router() ;


// add a new todo
router.post("/addTodo", addNewTodo) ;

// retrieve all todos
router.get("/", getAllTodos) ;

router.patch("/updateTodo", updateTodo) ;

router.delete("/deleteTodo/:id", deleteTodo) ;





export default router ;

