import { createSlice } from "@reduxjs/toolkit";
export interface ChatScreen {
    id: number;
    thread: number;
    user: {
        id: number;
        username: string;
    };
    message: string;
    is_read: boolean;
    is_delivered: boolean;
}

interface ActionType {
    payload: ChatScreen[]; 
    type: string;
}

export interface MessageState {
    messageList: ChatScreen[];
    chatId: number | null;
    opened: boolean;
    receiverName: string | null;
}

const initialState: MessageState = {
    messageList: [],
    chatId: null,
    opened: false,
    receiverName: null,
};

const MessageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addToMessage: (state, action: ActionType) => {
            const message = action.payload;

            state.messageList = message;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload.id;
            console.log(state.chatId, "chatId");
            state.opened = true;
            state.receiverName = action.payload.username;
        },
        updateToMessageList: (state, action) => {
            const message = action.payload;
            state.messageList = [...state.messageList, message]
        },
        isChatOpened: (state) => {
            state.opened = !state.opened;
        }
    },
});

export const { addToMessage, setChatId, updateToMessageList, isChatOpened } = MessageSlice.actions;

export default MessageSlice.reducer;
