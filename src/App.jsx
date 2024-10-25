/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import TodoCard from "./TodoCard";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton , useUser, useAuth } from "@clerk/clerk-react";
import Image from './assets/cartoon-img.png'



function App() {

  let {user} = useUser();
  let {isSignedIn} = useAuth()
 
  let firebaseUrl = 'https://todos-app-29221-default-rtdb.asia-southeast1.firebasedatabase.app/';
  let [submitLoader, setSubmitLoader] = useState(false);
  let [storeTodo, setStoreTodo] = useState([]);
  const [showToast, setShowToast] = useState(false);
 

  let taskInput = useRef(null);

  function handleClick() {
    setSubmitLoader(true);
    let task = taskInput.current.value;
    taskInput.current.value = "";

    axios
      .post(`${firebaseUrl}todo.json`, {
        title: task,
        createdBy: user.username,
      })
      .then(() => {
        setSubmitLoader(false);
        setShowToast(true); // Show the toast
        setTimeout(() => {
          setShowToast(false); // Hide the toast after 1 second
        }, 1000); // 1 second = 1000 milliseconds
        
       

        fetchTodo();
      });
  }

  function fetchTodo() {
    axios.get(`${firebaseUrl}todo.json`).then((res) => {
      let storeTodo = [];
      for (let key in res.data) {
        let todo = {
          id: key,
          ...res.data[key],
        };
        storeTodo.push(todo);
      }
      setStoreTodo(storeTodo);
    });
  }

  useEffect(() => {
    fetchTodo();
  }, []);

  function delteHandler(id) {
    axios.delete(`${firebaseUrl}todo/${id}.json`).then(() => {
      fetchTodo();
    });
    console.log("clicked");
  }

  return (
    <>

       <div className="flex items-center justify-between mx-24 mt-3   ">
        <div className="flex items-center gap-2"> 
          <h1 className="text-2xl translate-y-[3px] font-semibold">Task Pilot</h1>
        <img className="w-10" src="https://tse1.mm.bing.net/th?id=OIP.hM3Qchkou9OIAf69vjazDwAAAA&pid=Api&P=0&h=180" alt="" />

        </div>
        <div className="">
        <header className="">
      <SignedOut>
        <SignInButton  />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    
        </div>
        
       </div>
       <hr  className="mt-3 bg-neutral-900"/>
     
      <SignedIn>
      <div className=" mt-20 mx-auto text-center ">
        <h1 className="text-[29px]">
          Manage your task <span className="text-blue-700">@{isSignedIn? user.fullName : ""}</span>
        </h1>
        <p className="text-[18px] text-neutral-500 font-light mt-4">
          Start to add your task here!!
        </p>

        <div className="">
          <input
            ref={taskInput}
            type="text"
            className="text-lg font-light border text-neutral-600 border-neutral-300 rounded-lg mt-5 shadow outline-none p-3 w-[270px]"
            placeholder="Enter the task i.e about task"
          />
          <br />

          <button
            onClick={handleClick}
            className=" mt-4 -translate-x-16 mr-3 bg-blue-700 text-white text-lg p-3 rounded-md px-6"
          >
            {submitLoader ? (
              <div className="flex justify-center gap-1 items-center">
                <p className="text-white">adding</p>
                <div className="animate-spin border-l-white border-t-blue-700 border rounded-full p-2"></div>
              </div>
            ) : (
              "Add Task"
            )}
          </button>
        </div>
        <div className="">
          {storeTodo.filter(todo => isSignedIn ? todo.createdBy == user.username : true ).map((data) => (
            <TodoCard key={data.id} title={data.title} delteHandler={delteHandler} id={data.id} />
          ))}
        </div>

        {/* Task Added Notification */}
        <div className="">
        {showToast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white py-2 px-4 rounded-md shadow-md">
          Task Added Successfully!
        </div>
      )}
        </div>
     
      </div>
      </SignedIn>

      <SignedOut>
           <div className="mt-20">
            <img className="w-[500px] mx-auto" src={Image} alt="" />
        <h1 className=" w-full p-5 text-center text-4xl font-black mt-6">
          A goal without a timeline is just a dream!
        </h1>
      </div>
      </SignedOut>
    </>
  );
}

export default App;