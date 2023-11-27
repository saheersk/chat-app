import { useDispatch, useSelector } from "react-redux";
import ChatScreen from "../components/Chat/ChatScreen";
import PersonList from "../components/Chat/PersonList";
import { UserReducer } from "../store/store";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/userSlice";
import AddUser from "../components/Chat/AddUser";

function Home() {
    const dispatch = useDispatch();
    const username: string | undefined = useSelector((state: UserReducer) => state.user.data?.username);
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);

    const [showAddUser, setShowAddUser] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="chat-app p-5 bg-blue-300 h-[100vh] flex relative">
            {isLoggedIn && (
                <>
                    <div className="sidebar w-[30%] bg-gray-200 h-[100%] rounded-md p-4 mr-3">
                        <div className="user-info flex justify-between mb-2">
                            <p className="text-green-600 capitalize">Welcome <Link to="/profile">{username}</Link></p>
                            <button className="bg-black text-white text-md p-2 rounded-md" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                        <div className="flex mb-4  ">
                            <div className="search border border-white w-[80%] p-1 rounded-md mr-2">
                                <input type="text" className="bg-transparent w-[100%] h-10" placeholder="Search" />
                            </div>
                            <button className="add-button bg-blue-800 rounded-md w-20 text-white" onClick={() => setShowAddUser(!showAddUser)}>{showAddUser ? "Remove": "Add"}</button>
                        </div>
                        <div className="person-container h-[82%] scroll overflow-y-auto">
                            <PersonList />
                        </div>
                    </div>
                    <div className="chat-screen w-[100%] bg-white h-[100%] rounded-md p-4">
                        <ChatScreen  />
                    </div>

                </>
            )}
            {showAddUser && <AddUser />}
        </div>
    );
}

export default Home;
