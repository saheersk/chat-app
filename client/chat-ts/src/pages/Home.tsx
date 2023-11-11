import ChatScreen from "../components/Chat/ChatScreen";
import PersonList from "../components/Chat/PersonList";

function Home() {
    return (
        <div className="chat-app p-5 bg-blue-300 h-[100vh] flex">
            <div className="sidebar w-[30%] bg-gray-200 h-[100%] rounded-md p-4 mr-3">
                <div className="flex mb-4">
                    <div className="search border border-white w-[80%] p-3 rounded-md mr-2">
                        <input type="text" className="bg-transparent" placeholder="Search" />
                    </div>
                    <button className="add-button bg-blue-800 rounded-md w-20 text-white">Add</button>
                </div>
                <div className="person-container h-[92%] scroll overflow-y-auto">
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                    <PersonList />
                </div>
            </div>
            <div className="chat-screen w-[100%] bg-white h-[100%] rounded-md p-4">
              <ChatScreen />
            </div>
        </div>
    );
}

export default Home;
