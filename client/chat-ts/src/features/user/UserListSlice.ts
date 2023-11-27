import { createSlice } from '@reduxjs/toolkit';

export interface UserList {
    id: number;
    username: string;
}

interface UserActionType {
    payload: UserList[];
    type: string;
}

export interface UserListState {
    users: UserList[];
}

const initialState: UserListState = {
    users: [],
}

const UserListSlice = createSlice({
    name: 'users list',
    initialState,
    reducers: {
        addToUserList: (state, action: UserActionType ) => {
            state.users = action.payload
          },
        removeFromUserList: (state, action) => {
            console.log(action.payload);
            
            const userIdToRemove = action.payload;

            const newUserList = state.users.filter((user) => user.id !== userIdToRemove);
        
            state.users = newUserList;
        }
    }
});

export const { addToUserList, removeFromUserList } = UserListSlice.actions;

export default UserListSlice.reducer;