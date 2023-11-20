import { createSlice } from "@reduxjs/toolkit";

export interface ChatScreen {
    id: number;
    thread: number;
    user: number;
    message: string;
    is_read: boolean;
    is_delivered: boolean;
}

interface ActionType {
    payload: ChatScreen[];
    type: string;
}

export interface MessageState {
    receiver: ChatScreen[];
    sender: ChatScreen[];
}


const initialState: MessageState = {
    receiver: [],
    sender: [],
};

const MessageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addToMessage: (state, action: ActionType) => {
            const message: ChatScreen[] = action.payload;
            
            console.log(message, 'message');
            
            const sender = message.filter((item) => item.user === 1)
            const receiver = message.filter((item) => item.user !== 1)

            state.sender = sender
            state.receiver = receiver

        },
    },
}); 

export const { addToMessage } = MessageSlice.actions;

export default MessageSlice.reducer;
