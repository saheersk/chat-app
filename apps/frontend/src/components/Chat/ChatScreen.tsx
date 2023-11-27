import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../axiosConfig";
import { type ChatScreen, addToMessage, updateToMessageList, isChatOpened } from "../../features/ChatMessage/MessageSlice";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { MessageReducer, UserReducer } from "../../store/store";
import type { TokenInfo } from "../../features/auth/userSlice";
import { removeFromList } from "../../features/chatList/ChatSlice";

function ChatScreen() {
    const dispatch = useDispatch();
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);
    const messageList: ChatScreen[] = useSelector((state: MessageReducer) => state.messages.messageList);
    const chatId: number | null = useSelector((state: MessageReducer) => state.messages.chatId);
    const opened: boolean = useSelector((state: MessageReducer) => state.messages.opened);
    const username: string | null = useSelector((state: MessageReducer) => state.messages.receiverName);

    const token: string | undefined = userData?.token?.access;

    const [socket, setSocket] = useState<any>(null);
    const [message, setMessage] = useState<string>("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const removeUser = (id: number) => {
        axios
            .delete(
                `${BASE_URL}/customer/member/remove/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response: AxiosResponse) => {
                console.log(response.data, "User removed successfully");
                dispatch(removeFromList(id));
                dispatch(isChatOpened())
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (messagesEndRef.current ) {
            messagesEndRef.current.scrollIntoView();
        }
    }, [messageList]);

    useEffect(() => {
        if (chatId) {
            const establishWebSocketConnection = async () => {
                if (!token) {
                    return;
                }

                const socket = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/?token=${token}`);

                socket.addEventListener("open", (event) => {
                    console.log("WebSocket connection opened:", event);
                    setSocket(socket);
                });

                socket.addEventListener("message", (event) => {
                    console.log("WebSocket message received:", event.data);
                    const parsedMessage = JSON.parse(event.data);
                    dispatch(updateToMessageList(parsedMessage));
                });

                socket.addEventListener("error", (event) => {
                    console.error("WebSocket error:", event);
                });

                socket.addEventListener("close", (event) => {
                    console.log("WebSocket connection closed:", event);
                    console.log("WebSocket readyState:", socket.readyState);
                });

                return () => {
                    socket.close();
                };
            };

            establishWebSocketConnection();
        }
    }, [token, chatId]);

    useEffect(() => {
        if (socket) {
            console.log(`Socket connected: ${socket.readyState === WebSocket.OPEN}`);
        }
    }, [socket]);

    const sendMessage = () => {
        console.log(message, "message");
        if (socket && socket.readyState === WebSocket.OPEN) {
            const messageData = {
                message: message,
                sender_id: userData?.user_id,
                list_id: chatId,
            };
            setMessage("");
            socket.send(JSON.stringify(messageData));
        } else {
            console.error("WebSocket connection not open or ready.");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatId) {
            axios
                .get(`${BASE_URL}/customer/member/chat-messages/${chatId}/`, {
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
        }
    }, [chatId, token, dispatch]);

    return (
        <>
            {opened ? (
                <>
                    <div className="w-30 mb-5 flex justify-between items-center">
                        <h1 className="text-3xl font-bold capitalize">{username}</h1>
                        {chatId && <span className="add-button bg-blue-800 rounded-md w-20 p-2 text-white cursor-pointer" onClick={() => removeUser(chatId)}>Remove</span>}
                    </div>
                    <div className="messages h-[85%] scroll overflow-y-auto ">
                        {messageList.map((item: ChatScreen) => (
                            <div
                                ref={messagesEndRef}
                                className={
                                    userData?.user_id === item?.user?.id
                                        ? "message sender text-right mb-1"
                                        : "message receiver mb-1"
                                }
                                key={item.id}
                            >
                                <div
                                    className={
                                        userData?.user_id === item?.user?.id
                                            ? "bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]"
                                            : "bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]"
                                    }
                                >
                                    <span className="text-black font-bold capitalize">{item?.user?.username}</span>
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
                            value={message}
                            onChange={(e: any) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="bg-blue-800 rounded-r-md text-white w-[20%]" onClick={sendMessage}>
                            Send
                        </button>
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
