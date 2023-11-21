import axios, { type AxiosError, type AxiosResponse } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../../axiosConfig";
import { type User, addToList } from "../../features/chatList/ChatSlice";
import type { MembersReducer, UserReducer } from "../../store/store";
import type { TokenInfo } from "../../features/auth/userSlice";

function PersonList() {
    const dispatch = useDispatch();
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);
    const list: User[] = useSelector((state: MembersReducer) => state.members.list);

    const token: string | undefined = userData?.token?.access;

    useEffect(() => {
        axios
            .get(`${BASE_URL}/customer/members/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response: AxiosResponse) => {
                console.log(response.data.members, "members response");
                dispatch(addToList(response.data.members));
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, [list]);

    return (
        <div className="persons-list flex justify-between flex-wrap items-center rounded-lg">
            {list.map((member: User) => (
                <div className="mb-2 flex justify-between items-center cursor-pointer bg-slate-300  rounded-lg w-[100%]"  key={member.id}>
                    <div className="person  p-4">
                        <div className="person-name text-lg font-bold">{member.members.username}</div>
                        <div className="message text-sm font-thin truncate overflow-ellipsis max-w-[300px]">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit labore eaque fuga consectetur
                            quia excepturi provident maxime dolorem laboriosam consequatur.
                        </div>
                    </div>
                    <div className="badge bg-green-600 w-6 h-6 rounded-full text-white flex justify-center items-center mr-3">
                        <span className="text-white text-xs">1</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PersonList;
