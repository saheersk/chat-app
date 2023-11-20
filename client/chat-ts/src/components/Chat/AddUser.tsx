import React from "react";
import NewUserList from "./NewUserList";

function AddUser() {
    return (
        <div className="w-[30%] h-[500px] bg-gray-200 absolute rounded-md mr-2 left-[31%] top-[3%] flex flex-col items-center">
            <div className="search m-2 border border-black bg-white rounded-md  w-[95%] h-[50px] p-1 flex justify-between">
                <input type="text" className="bg-transparent w-[100%] h-10 capitalize" placeholder="Add New Users to your list" />
            </div>
            <div className="w-[95%] h-[100%] scroll overflow-y-auto">
                <NewUserList />
            </div>
        </div>
    );
}

export default AddUser;
