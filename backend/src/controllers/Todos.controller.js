
import { asyncHandler } from "../utils/asyncHandler.js";
import { Todo } from "../models/Todo.schema.js";

const addNewTodo = asyncHandler( async (req, res) => {

    // res.status(200).json({message : "ok"}) ;

    // extract details from req.body
    // validate the paramaters
    // add to db
    // send the response

    const {title, description} = req.body ;

    if (!title || !description) {
        res.status(400).json({status: 400, message: "Both title and description are required"})
        return ;
    }

    const newTodo = await Todo.create({
        title, 
        description
    })

    if (!newTodo) {
        res.status(500).json({status: 500, message: "Todo could not be added to the database"})
        return ;
    }

    // console.log(newTodo) ;

    res.status(200).json({status: 200, message: "Todo created successfully", todo: {title: newTodo.title, description: newTodo.description, updatedAt: newTodo.updatedAt, _id: newTodo._id}})

})

const getAllTodos = asyncHandler ( async (req, res) => {
    
    const { page , limit = 7 } = req.query;

    if (!page) {
        res.status(400).json({status: 400, message: "page number is required to fetch"})
        return ;
    }
    
    const results = await Todo.aggregate([
        {
            // Count the total number of documents
            $facet: {
                data: [
                    { $sort: {"updatedAt": -1}},
                    { $skip: (page - 1) * limit }, // Skips the specified number of documents
                    { $limit: limit }, // Limits the number of documents returned
                ],
                totalCount: [
                    { $count: "count" }, // Calculates the total number of documents
                ]
            }
        }
    ]);

    let todos = results?.[0]?.data || [] ;
    const {count} = results?.[0]?.totalCount?.[0] || 0 ;

    // console.log(results);

    // console.log("Count1", count) ;
    // console.log("Count2", limit) ;
    // console.log("Count3", typeof limit) ;
    // console.log("Count4", typeof count) ;
    // console.log("Count1", count / limit) ;
    // console.log("Count", Math.ceil(count / limit)) ;

    
    
    if (!todos || !count) {
        res.status(500).json({status: 500, message: "Todos could not be fetched from the database"}) ;
        
        return ;
    }


    todos = todos.map((todo) => {
        return {
            _id: todo._id,
            title: todo.title,
            description: todo.description,
            updatedAt: todo.updatedAt
        }
    })
    
    res.json({
        todos: todos,
        totalPages: Math.ceil(count / limit),   
        currentPage: page,
    });
})

const updateTodo = asyncHandler (async (req, res) => {
    const {title, description, id} = req.body ;

    if (!title || !description || !id) {
        res.status(400).json({status: 400, message: "Title description and id is required"})
        return ;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, {title, description}, {new: true})

    if (!updatedTodo) {
        res.status(500).json({status: 500, message: "Error occured while udpating the todo"})
        return ;
    }


    const todo = {title: updatedTodo.title, description: updatedTodo.description, _id : updatedTodo._id, updatedAt: updatedTodo.updatedAt}

    // console.log(todo) ;

    res.status(200).json({status: 200, message: "Todo updated successfully", todo }) ;
    
})

const deleteTodo = asyncHandler(async(req, res) => {

    // console.log(req.body) ;
    // console.log(req.params) ;

    const {id} = req.body || req.params ;

    const todoId = req.params.id ;

    // console.log(todoId) ;

    if (!todoId) {
        res.status(400).json({status: 400, message: "Todo id is required"})
        return ;
    }

    const deleted = await Todo.findByIdAndDelete(todoId) ;

    if (!deleted) {
        res.status(500).json({status: 500, message: "Error occured while deleting the todo"})
        return ;
    }

    res.status(200).json({status: 200, message: "Todo deleted successfully"})
})

export {addNewTodo, getAllTodos, updateTodo, deleteTodo}