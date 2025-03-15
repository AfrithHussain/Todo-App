import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
function TodoCard({ title, delteHandler, id }) {
  const [trashLoader, setTrashLoader] = useState(false);
  const [deleteToast, setDeleteToast] = useState(false);

  function clickDeleteHandler() {
    setTrashLoader(true);
    delteHandler(id);
    setDeleteToast(true);
    setTimeout(() => {
      setDeleteToast(false);
    }, 1000);
  }

  return (
    <div className="w-full px-4 sm:px-0">
      {/* Todo Card */}
      <div className="mt-4 max-w-md mx-auto bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between p-4">
          {/* Centered Title */}
          <h1 className="text-lg text-gray-800 flex-1 text-center truncate">
            {title}
          </h1>

          {/* Delete Button */}
          <button
            onClick={clickDeleteHandler}
            disabled={trashLoader}
            className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200 group"
            aria-label="Delete task"
          >
            {trashLoader ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <BsTrash3 className="text-red-600 group-hover:text-red-700 transition-colors duration-200 w-5 h-5" />
            )}
          </button>
        </div>

        {/* Progress Bar Animation for Delete Loading */}
        {trashLoader && (
          <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse transition-all duration-1000" />
          </div>
        )}
      </div>

      {/* Delete Toast Notification */}
      {deleteToast && (
        <div
          className="fixed bottom-8 left-[45%] transform -translate-x-1/2 animate-fade-in-up"
          aria-live="assertive"
        >
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center  space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Task deleted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoCard;
