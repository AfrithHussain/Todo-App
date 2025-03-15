import axios from "axios";
import TodoCard from "./TodoCard";
import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import Image from "./assets/cartoon-img.png";

function App() {
  let { user } = useUser();
  let { isSignedIn } = useAuth();

  let firebaseUrl =
    "https://task-pilot-7f06a-default-rtdb.asia-southeast1.firebasedatabase.app/";
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 md:w-10 md:h-10"
              src="https://tse1.mm.bing.net/th?id=OIP.hM3Qchkou9OIAf69vjazDwAAAA&pid=Api&P=0&h=180"
              alt="Logo"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Task Pilot
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <SignedIn>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Welcome back,{" "}
              <span className="text-blue-600">@{user?.username}</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              What&apos;s your mission for today? Let&apos;s soar through your
              tasks!
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <input
                ref={taskInput}
                type="text"
                className="w-full md:w-96 px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg shadow-sm"
                placeholder="✈️ Enter your next task..."
              />
              <button
                onClick={handleClick}
                disabled={submitLoader}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {submitLoader ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Task
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeTodo
              .filter((todo) =>
                isSignedIn ? todo.createdBy === user.username : true
              )
              .map((data) => (
                <TodoCard
                  key={data.id}
                  title={data.title}
                  delteHandler={delteHandler}
                  id={data.id}
                />
              ))}
          </div>

          {showToast && (
            <div className="fixed bottom-8 left-[45%] transform -translate-x-1/2 animate-fade-in-up">
              <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Task launched successfully!
              </div>
            </div>
          )}
        </main>
      </SignedIn>

      <SignedOut>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="max-w-2xl mx-auto mb-12">
              <img
                src={Image}
                alt="Task Management"
                className="w-full h-auto max-w-md mx-auto rounded-2xl "
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Turn Your Dreams Into
              <br />
              <span className="text-blue-600">Achievable Tasks</span>
            </h1>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of productive people organizing their lives with
                Task Pilot
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Organization
                </h3>
                <p className="text-gray-600">
                  Categorize, prioritize, and track your tasks with intuitive
                  workflows
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
                <p className="text-gray-600">
                  Monitor your productivity patterns with detailed analytics
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Interface</h3>
                <p className="text-gray-600">
                  Lightning-fast interface that keeps up with your workflow
                </p>
              </div>
            </div>
          </div>
        </main>
      </SignedOut>
    </div>
  );
}

export default App;
