"use client"

import axios from "axios"
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FcTodoList } from "react-icons/fc";
import { RiTodoLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";





export default function Home() {

  // TODO: find out why this base url is getting set wrong
  axios.defaults.baseURL = process.env.SERVER_URI || "http://127.0.0.1:5000" ;

  // useEffect(() => {
    
  //   const hello = async () => {
      
  //     try {
  //       const response = await axios.post("/api/v1/todos/addTodo", {
  //         title: "first Todo", description : "this is the first todo in my list"
  //       }) ;
  //       console.log("ADD TODO", response) ;
  //     } catch (error) {
  //       console.error(error) ;
  //     }
  //   }
  //   hello() ;
  
    
  // }, [])

  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1) ;

  useEffect(() => {
    fetchTodos();
  }, [page]);

  // TODO: comment it
  // useEffect(()=>{
  //   console.log("PAGES",totalPages) ;
  // }, [totalPages])

  useEffect(() => {
    if (todos.length > 7) {
      // TODO: this is not the way to rearrage the todos when length > 7, because this is making a db call, while the issue could have been resolved with sorting the todos array and taking the top 7 documents to show only 7 docuuments per page, but to save time we are using this but change this in future
      fetchTodos() ;
    }

    if (todos.length < 7 && totalPages > 1) {
      fetchTodos() ; // this is because when deleting todos and they get lesser the other pages might have some left which are to restructed now
    }
  }, [todos])

  // TODO: comment this
  // useEffect(() =>  {
  //   console.log(todos) ;
  // },[todos])

  const fetchTodos = async () => {
    try {
    const response = await axios.get(`/api/v1/todos?page=${page}`);
    
      // TODO: validate the response

      if (response.status === 200) {

        // console.log(response.data) ;

        setTodos(response.data.todos);
        setTotalPages(response.data.totalPages) ;
      }
    }
    catch(err) {
      console.log(err) ;
    }

  };

  const createTodo = async () => {
    const response = await axios.post('/api/v1/todos/addTodo', { title, description });
    
      // TODO: validate the response

      // console.log("ADD TODO", response) ;
      // console.log("ADD TODO", response.data.todo) ;


    setTodos([response.data.todo, ...todos]);
    setTitle('');
    setDescription('');
  };

  const updateTodo = async (id) => {
    
    const response = await axios.patch(`/api/v1/todos/updateTodo`, { title, description, id});


    // TODO: validate the response

    // console.log("TODO UPDATE", response) ;
    // console.log(response.data.todo) ;

    // TODO: When todo is updated, we need to move it to the top of the first page, that we need to refetch the documents, current idea is just set the page number to 1 again, so that data for page 1 is fetched and we get the todo at the top

    if (response.status === 200) setTodos(todos.map(todo => (todo._id === id ? response.data.todo : todo)));
  };

  const handleAddNewTodoBtn = () => {
    setSelectedTodo(null);
    setTitle("");
    setDescription("");
  }

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleSaveTodo = () => {
    // console.log("SELECTED TODO", selectedTodo) ;

    if (selectedTodo) {
      updateTodo(selectedTodo._id) ;
    }
    else createTodo() ;
  }

  const handleTodoDelete = async () => {
    // console.log(1) ;
    if (!selectedTodo) {
      handleAddNewTodoBtn() ; // this means that user doesn't want to create the todo now, so reset it
    }
    else {
        // if a todo is selected, means the user wants to delete this todo
        console.log("DELETE SELECTED", selectedTodo) ;

        const response = await axios.delete(`/api/v1/todos/deleteTodo/${selectedTodo._id}`, {
          id: selectedTodo._id
        })

        if (response.status === 200) {
          setTodos(todos.filter((todo) => todo._id !== selectedTodo._id))
          handleAddNewTodoBtn() ; // because after the todo is deleted we have to reset the new todo 
        }
    }
  } 

  return (
    <div className="bg-gray-300 min-h-screen w-full box-border">

    <nav className="bg-gray-100">
      <p className="text-4xl p-2 font-semibold px-[5%]"> Todo</p>
    </nav>

    <div className=" flex mt-2  lg:mx-[5%]     ">

      {/* left panel */}
      <div className={`${selectedTodo? "hidden" : ""} sm:block w-full sm:w-[35%] h-full  p-4 flex flex-col`}>


        {/* TODO: Check why this is not working, copy this and start with fresh css */}

        {/* <div className="flex justify-between mr-2 outline ">
        <h1 className=" bg-gray-800 p-2 rounded-lg text-2xl font-semibold mb-3 justify-start  text-white">Todos <RiTodoLine className="inline" /></h1>
        <div className="flex">
          <button className="bg-gray-100 font-bold h-full aspect-square text-3xl self-start text-black rounded-lg " onClick={() => setSelectedTodo(false)}><IoMdAdd className="mx-auto"/></button>
          <button className="font-bold text-3xl text-black bg-gray-100 p-2 rounded-lg h-full w-auto">
          <IoIosSearch className="mx-auto"  />
          </button>
        </div>
        </div> */}

        <div className="flex justify-between  pr-2 text-xl md:text-2xl items-center">
          <h1 className="bg-gray-800 text-white/80 p-2 text-xl rounded-lg">Todos <RiTodoLine className="inline-block" /></h1>
          <div className="text-2xl md:text-3xl sm:mr-10">
          <button 
          onClick={handleAddNewTodoBtn}
          className="p-2 hover:bg-gray-200"><IoMdAdd className="inline-block"/></button>
          
          {/* TODO: we need to implement the search functinality, current idea to to make a db call and make a pipeline searching the text of each todo and returning the sorted todos in order of degree of matching like longest common subsequence */}
          <button className = "p-2 hover:bg-gray-200"><IoIosSearch className="inline-block"  /></button>
          </div>
        </div>
        
        <div className=" mt-2 mb-4 ">

          <div className= "    pr-2">
            
            {todos && todos.map(todo => (
              
              <div className=" bg-gray-100 text-black p-4 relative rounded-xl mb-3" key={todo._id} onClick={() => handleTodoClick(todo)}>

              {/* <button className="text-lg absolute hover:bg-slate-200 rounded-full top-2 right-2 p-2"><MdOutlineTaskAlt />
              </button> */}

              <h1 className="font-medium text-xl  overflow-x-hidden">{todo.title}</h1>
              <p className="text-lg  overflow-x-hidden overflow-y-hidden">{todo.description}</p>
              <p className="text-right text-sm text-black/60">{new Date(todo.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {
            todos.length === 0 && <p className="text-2xl text-neutral-400 text-center pt-24">No Todos added yet <br/>Click on '+' to Add</p>
          }

          
          </div>
        </div>

        <div className=" flex justify-between pr-4 text-2xl  sm:text-2xl px-2  ">

          <button className={` ${page === 1 ? "invisible" : ""}   p-2  rounded-lg `} onClick={() => setPage(page - 1)} disabled={page === 1}><GrLinkPrevious /></button>
          <button className={` ${page === totalPages ? "invisible" : ""}   p-2  rounded-lg `}  onClick={() => setPage(page + 1)} disabled = {page === totalPages}><GrLinkNext /></button>
        </div>
      </div>
        
      {/* right panel */}

      <section className={` ${!selectedTodo? "hidden" : ""} sm:block sm:mt-8 w-full sm:w-[60%]  bg-gray-300 p-4`}>
      
        <div className="flex flex-col  bg-gray-200   p-4 rounded-lg sm:pt-10">

          <button className=" sm:hidden p-2 mb-10 rounded-lg self-start text-xl font-medium" onClick={() => setSelectedTodo(null)}><GrLinkPrevious className="inline"/> back</button>
          
          <button onClick = {handleTodoDelete} className="self-end">
          <MdDelete className="text-right text-3xl text-gray-700"/>
          </button>


          <input className="text-4xl bg-gray-200 focus:outline-black p-2 px-4 font-semibold" placeholder="Enter the title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea rows={10} className="bg-gray-200 resize-none p-2 px-4 mt-7 text-2xl focus:outline-black" placeholder="Enter the description..." value={description} onChange={(e) => setDescription(e.target.value)} />

          <button className="mt-7  text-xl rounded-lg focus:outline-none hover:bg-gray-700 bg-gray-800 text-white/80 p-2" onClick={handleSaveTodo} >{selectedTodo? "Update" : "Add"} Todo</button>
        </div>
    
      </section>

    </div>
    </div>
  )

}
