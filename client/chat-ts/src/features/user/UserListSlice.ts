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
    }
});

export const { addToUserList } = UserListSlice.actions;

export default UserListSlice.reducer;