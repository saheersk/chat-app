import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { MembersReducer, UserReducer, UsersListReducer } from "../../store/store";
import { TokenInfo } from "../../features/auth/userSlice";
import { BASE_URL } from "../../../axiosConfig";
import { addToUserList, removeFromUserList, type UserList } from "../../features/user/UserListSlice";
import { User, updateList } from "../../features/chatList/ChatSlice";

function NewUserList() {
    const dispatch = useDispatch();
    const userList: UserList[] = useSelector((state: UsersListReducer) => state.usersList.users);
    const list: User[] = useSelector((state: MembersReducer) => state.members.list);
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);

    const [userToAdd, setUserToAdd] = useState<UserList[]>([]);

    const token: string | undefined = userData?.token?.access;

    const addNewUser = (id: number) => {
        axios
            .post(
                `${BASE_URL}/customer/members/`,
                {
                    first_person: userData?.user_id,
                    second_person: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response: AxiosResponse) => {
                console.log(response.data.data, "Added new response");
                dispatch(updateList(response.data.data))
                dispatch(removeFromUserList(id));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    };

    useEffect(() => {
        axios
            .get(`${BASE_URL}/customer/all/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response: AxiosResponse) => {

                const userListArray = response.data.users.map((user: any) => user);
                const ArrayList = list.map((user: any) => user.members.username);

                userListArray.filter((item: any) => {
                    if (ArrayList.includes(item.username)) {
                    } else {
                        setUserToAdd((prevUserToAdd) => [...prevUserToAdd, item]);
                    }
                });

            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [userList]);

    useEffect(() => {
        if (userToAdd.length > 0) {
            dispatch(addToUserList(userToAdd));
            setUserToAdd([]);
        }
    }, [dispatch, userToAdd]);

    return (
        <>
            <ul>
                {userList.map((user: UserList) => (
                    <li
                        className="bg-white h-[50px] flex justify-between items-center p-2 mb-1 rounded-md"
                        key={user.id}
                    >
                        <span className="text-blue-600">{user.username}</span>
                        <button className="bg-red-950 text-white p-2 rounded-md" onClick={() => addNewUser(user.id)}>
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default NewUserList;
