import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
function TodoCard({title, delteHandler, id}) {

  let [trashLoader, setTrashLoader] = useState(false) ;
  const [deleteToast, setDeleteToast] = useState(false);


    function clickDeleteHandler(){
      setTrashLoader(true)
      delteHandler(id);
      setDeleteToast(true); // Show the toast
        setTimeout(() => {
          setDeleteToast(false); // Hide the toast after 1 second
        }, 1000); // 1 second = 1000 milliseconds
    }
  
  return (
    <div>
        <div className=" mt-7 border border-neutral-500  w-[400px] ml-[590px] p-3 rounded-lg">
            <div className="flex items-center justify-between px-3">
            <h1 className="text-xl   text-neutral-700 font-light  ">{title}</h1>
            <p onClick={()=>{clickDeleteHandler()}} className="hover:text-red-700 cursor-pointer text-xl text-blue-700">{trashLoader ? <div className="flex justify-center items-center">
              <p className="text-red-700">deleting</p>
              <div className="animate-spin border-l-white border-t-red-700 border rounded-full p-2"></div> 
            </div> : <BsTrash3 />}</p>
            </div>

            {/* delete toast */}
            <div className="">
        {deleteToast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-700 text-white py-2 px-4 rounded-md shadow-md">
          Task Deleted Successfully!
        </div>
      )}
        </div>
        </div>
    </div>
  )
}

export default TodoCard