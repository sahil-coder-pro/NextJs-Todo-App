import mongoose, {Schema} from "mongoose";

const todoSchema = new Schema({
    title: {
        type: String, 
        required: true,
    },

    description: {
        type: String, 
        required: true,
    },

    // rather than using date we can use timestamps because they provide createdAt and UpdatedAt differently, so I think it will be better

    // date: { 
    //     type: Date, 
    //     default: Date.now 
    // }

    }, 
    
    {
        timestamps: true
    }
)

export const Todo = mongoose.model('Todo', todoSchema) ;
