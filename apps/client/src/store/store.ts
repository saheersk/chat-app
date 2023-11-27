import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type UserData } from "../features/auth/userSlice";
import ChatSlice, { type ChatState } from "../features/chatList/ChatSlice";
import MessageSlice, { type MessageState } from "../features/ChatMessage/MessageSlice";
import UserListSlice, { UserListState } from "../features/user/UserListSlice";


export interface UserReducer {
    user: UserData;
}

export interface MembersReducer {
    members: ChatState
}

export interface MessageReducer {
    messages: MessageState
}

export interface UsersListReducer {
    usersList: UserListState
}

const store = configureStore({
    reducer: {
        user: userSlice,
        members: ChatSlice,
        messages: MessageSlice,
        usersList: UserListSlice
    }
});

export default store;