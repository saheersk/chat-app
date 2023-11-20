import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../axiosConfig";
import { type ChatScreen, addToMessage } from "../../features/ChatMessage/MessageSlice";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { MessageReducer, UserReducer } from "../../store/store";
import type { TokenInfo } from "../../features/auth/userSlice";

function ChatScreen() {
    const dispatch = useDispatch();
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);
    const receiver: ChatScreen[] = useSelector((state: MessageReducer) => state.messages.receiver);
    const sender: ChatScreen[] = useSelector((state: MessageReducer) => state.messages.sender);

    const token: string | undefined = userData?.token?.access;

    console.log(receiver, "receiver");
    console.log(sender, "sender");

    useEffect(() => {
        axios
            .get(`${BASE_URL}/customer/member/chat-messages/${5}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response: AxiosResponse) => {
                console.log(response.data.chat_messages, "members response");
                dispatch(addToMessage(response.data.chat_messages));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            {false ? (
                <>
                    <div className="w-30">
                        <h1 className="text-3xl font-bold">Receiver Name</h1>
                    </div>
                    <div className="messages h-[85%] scroll overflow-y-auto">
                        {sender.map((item: ChatScreen) => (
                            <div className="message sender text-right mb-1" key={item.id}>
                                <div className="bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]">
                                    <span className="text-black font-bold ">{item.user}</span>
                                    <p>{item.message}</p>
                                </div>
                            </div>
                        ))}

                        {receiver.map((item: ChatScreen) => (
                            <div className="message receiver mb-1" key={item.id}>
                                <div className="bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]">
                                    <span className="text-black font-bold ">{item.user}</span>
                                    <p>{item.message}</p>
                                </div>
                            </div>
                        ))}
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
            ) : (
                <div className="flex items-center justify-center h-[85%]">
                <p className="text-gray-500 text-lg">Chat With You Friends</p>
            </div>
                
            )}
        </>
    );
}

export default ChatScreen;
