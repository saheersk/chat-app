import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../axiosConfig";
import { useSelector } from "react-redux";
import { TokenInfo } from "../../features/auth/userSlice";
import { UserReducer } from "../../store/store";

const UserProfile = () => {
    const userData: TokenInfo | null = useSelector((state: UserReducer) => state.user.data);

    const token: string | undefined = userData?.token?.access;

    const [user, setUser] = useState({
        username: "JohnDoe",
        email: "john.doe@example.com",
        profileImage: "https://placekitten.com/200/200", // Replace with the actual URL of the profile image
        first_name: "John",
        last_name: "Doe",
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        console.log("Updated User:", user);

        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    
    useEffect(() => {
        axios
            .get(`${BASE_URL}/customer/profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response: AxiosResponse) => {
                console.log(response.data.users, "profile");
                setUser(response.data.users)
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }, []);
    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">Username: {user.username}</h1>
                        <p className="text-gray-600 mb-1">Email: {user.email}</p>
                        <p className="text-gray-600 mb-1">First Name: {user.first_name}</p>
                        <p className="text-gray-600 mb-1">Last Name: {user.last_name}</p>
                    </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                    {isEditing ? (
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image:
                            </label>
                            <input type="file" id="image" name="image" className="mt-1 p-2 border rounded-md w-full" />

                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                First Name:
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={user.first_name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                Last Name:
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={user.last_name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <label htmlFor="email" className="block mt-4 text-sm font-medium text-gray-700">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />

                            <div className="mt-4">
                                <button
                                    onClick={handleSaveClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelClick}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={handleEditClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
