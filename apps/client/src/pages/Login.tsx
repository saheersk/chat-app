import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginSuccess } from "../features/auth/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../axiosConfig";
import { type UserReducer } from "../store/store";

const Login = () => {
    const dispatch = useDispatch();
    const message = useSelector((state: UserReducer) => state.user.message);
    const isLoggedIn: boolean = useSelector((state: UserReducer) => state.user.isLoggedIn);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios
            .post(`${BASE_URL}/auth/login/`, {
                username,
                password,
            })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    const data = response.data;
                    dispatch(loginSuccess(data));
                    navigate("/");
                } else {
                    console.log(response.data);
                    dispatch(loginFailure(response.data));
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.status === 400) {
                    dispatch(loginFailure(error.response.data));
                }
            });

        setUsername("");
        setPassword("");
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md p-4 space-y-4 bg-white shadow-lg rounded-md">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 border rounded-md"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded-md"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mt-4"
                        >
                            Login
                        </button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
