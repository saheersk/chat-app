import { createSlice } from '@reduxjs/toolkit';

export interface User {
    id: number;
    members: {
        id: number;
        username: string;
    }
}

interface ActionType {
    payload: User[];
    type: string;
}

export interface ChatState {
    list: User[];
}

const initialState: ChatState = {
    list: [],
}

const ChatSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        addToList: (state, action: ActionType ) => {
            state.list = action.payload
          },
        removeFromList: (state, action) => {}
    }
});

export const { addToList } = ChatSlice.actions;

export default ChatSlice.reducer;