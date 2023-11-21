import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../axiosConfig";
import { type ChatScreen, addToMessage } from "../../features/ChatMessage/MessageSlice";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { MembersReducer, MessageReducer, UserReducer } from "../../store/store";
import type { TokenInfo } from "../../features/auth/userSlice";
import { User } from "../../features/chatList/ChatSlice";
import * as forge from "node-forge";

function ChatScreen() {
    const dispatch = useDispatch();
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);
    const messageList: ChatScreen[] = useSelector((state: MessageReducer) => state.messages.messageList);
    const chatId: number | null = useSelector((state: MessageReducer) => state.messages.chatId);
    const opened: boolean = useSelector((state: MessageReducer) => state.messages.opened);
    const username: string | null = useSelector((state: MessageReducer) => state.messages.receiverName);
    const list: User[] = useSelector((state: MembersReducer) => state.members.list);

    const token: string | undefined = userData?.token?.access;

    const [socket, setSocket] = useState<any>(null);
    const [message, setMessage] = useState<string>("");
    const [publicKey, setPublicKey] = useState<string>("");

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

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
        // Log the connection status whenever it changes
        if (socket) {
            console.log(`Socket connected: ${socket.readyState === WebSocket.OPEN}`);
        }
    }, [socket]);

    const sendMessage = () => {
        console.log(message, "message");
        if (socket && socket.readyState === WebSocket.OPEN) {
            const publicKeFormatted = forge.pki.publicKeyFromPem(publicKey);
            const encryptedMessage = publicKeFormatted.encrypt(forge.util.encodeUtf8(message), "RSA-OAEP");

            const base64EncryptedMessage = forge.util.encode64(encryptedMessage);

            console.log(base64EncryptedMessage, "encrypted message");

            const messageData = {
                message: base64EncryptedMessage,
                sender_id: userData?.user_id,
                list_id: chatId,
            };
            setMessage("");
            socket.send(JSON.stringify(messageData));

            // dispatch(addToMessage({ message: response.data.chat_messages, id: userData?.user_id }));
        } else {
            console.error("WebSocket connection not open or ready.");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., form submission)
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatId) {
            const userWithMatchingId = list.find((member: User) => member.id === chatId);
            const publicKey: string | undefined = userWithMatchingId?.members.public_key;

            publicKey ? setPublicKey(publicKey) : "";
            console.log(publicKey, "publicKey");

            axios
                .get(`${BASE_URL}/customer/member/chat-messages/${chatId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response: AxiosResponse) => {
                    console.log(response.data.chat_messages, "members response");
                    dispatch(addToMessage({ message: response.data.chat_messages, id: userData?.user_id }));
                })
                .catch((err: AxiosError) => {
                    console.log(err);
                });
        }

        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatId]);

    return (
        <>
            {opened ? (
                <>
                    <div className="w-30 mb-5">
                        <h1 className="text-3xl font-bold capitalize">{username}</h1>
                    </div>
                    <div className="messages h-[85%] scroll overflow-y-auto " ref={chatContainerRef}>
                        {messageList.map((item: ChatScreen) => (
                            <div
                                className={
                                    userData?.user_id === item.user.id
                                        ? "message sender text-right mb-1"
                                        : "message receiver mb-1"
                                }
                                key={item.id}
                            >
                                <div
                                    className={
                                        userData?.user_id === item.user.id
                                            ? "bg-blue-500 text-white rounded-lg p-2 inline-block max-w-[70%]"
                                            : "bg-gray-300 text-black rounded-lg p-2 inline-block max-w-[70%]"
                                    }
                                >
                                    <span className="text-black font-bold capitalize">{item.user.username}</span>
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
