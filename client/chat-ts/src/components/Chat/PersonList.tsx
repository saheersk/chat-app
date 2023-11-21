import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../axiosConfig";
import { type User, addToList } from "../../features/chatList/ChatSlice";
import { setChatId } from "../../features/ChatMessage/MessageSlice";
import type { MembersReducer, MessageReducer, UserReducer } from "../../store/store";
import type { TokenInfo } from "../../features/auth/userSlice";

function PersonList() {
    const dispatch = useDispatch();
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);
    const list: User[] = useSelector((state: MembersReducer) => state.members.list);
    const chatId: number | null = useSelector((state: MessageReducer) => state.messages.chatId);

    const token: string | undefined = userData?.token?.access;

    const [socket, setSocket] = useState<any>(null);

    const [notifications, setNotifications] = useState<{ [key: number]: { notification_type: string, data: { sender_id: null | number, list_id: number | null , sender_name: string, message: string } }[] }>({});

    const handleClick = (id: number, username: string) => {
        dispatch(setChatId({ id, username }));

        setNotifications({});
    };

    useEffect(() => {
            if (!token) {
                return;
            }
            
            const socket = new WebSocket(`ws://localhost:8000/ws/notification/${userData?.user_id}/?token=${token}`);

            socket.addEventListener("open", (event) => {
                console.log("WebSocket connection opened:", event);
                setSocket(socket);
            });

            socket.addEventListener("message", (event) => {
                console.log("WebSocket message received:", event.data);
                const parsedNotification = JSON.parse(event.data);
                
                console.log(7, parsedNotification.data.list_id, "chat");
                console.log(chatId !== parsedNotification.data.list_id, "chat2");
                

                if(chatId !== parsedNotification.data.list_id){
                    setNotifications((prevNotifications) => ({
                        ...prevNotifications,
                        [parsedNotification.data.sender_id]: [
                            ...(prevNotifications[parsedNotification.data.sender_id] || []),
                            parsedNotification,
                        ],
                    }));
                }
                else{
                    setNotifications({})
                }
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

    }, [token, chatId]);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/customer/members/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response: AxiosResponse) => {
                // console.log(response.data.members, "members response");
                dispatch(addToList(response.data.members));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [userData, token, list]);

    const notificationCount = Object.values(notifications).reduce((count, item) => count + item.length, 0);

    return (
        <div className="persons-list flex justify-between flex-wrap items-center rounded-lg">
            {list.map((member: User) => (
                <div
                    className="mb-2 flex justify-between items-center cursor-pointer bg-slate-300  rounded-lg w-[100%]"
                    onClick={() => handleClick(member.id, member.members.username)}
                    key={member.id}
                >
                    <div className="person  p-4">
                        <div className="person-name text-lg font-bold">{member.members.username}</div>
                        <div className="message text-sm  truncate overflow-ellipsis max-w-[300px] font-normal">
                        {notifications[member.members.id]?.slice(-1)?.[0]?.data.message || ""}
                        </div>
                    </div>
                    {notifications[member.members.id] && (
                        <div className="badge bg-green-600 w-6 h-6 rounded-full text-white flex justify-center items-center mr-3">
                            <span className="text-white text-xs">{notificationCount}</span>
                        </div>
                    )}                    
                </div>
            ))}
        </div>
    );
}

export default PersonList;
