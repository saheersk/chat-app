function ChatScreen() {
    return (
        <>
            <div className="">
                <h1 className="text-3xl font-bold">Receiver Name</h1>
            </div>
            <div className="messages h-[85%] scroll overflow-y-auto">
                <div className="message sender text-right mb-1">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver mb-1">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                        <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message sender text-right">
                    <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hello!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
                <div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div><div className="message receiver">
                    <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                    <span className="text-black font-bold ">Username</span>
                        <p>Hi there!</p>
                    </div>
                </div>
            </div>

            <div className="input-container flex mt-3">
                <input
                    type="text"
                    className="w-[80%] p-3 border border-gray-300 rounded-l-md focus:outline-none"
                    placeholder="Type a message..."
                />
                <button className="bg-blue-800 rounded-r-md text-white w-[20%]">Send</button>
            </div>
        </>
    );
}

export default ChatScreen;
