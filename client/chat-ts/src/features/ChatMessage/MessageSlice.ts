import { createSlice } from "@reduxjs/toolkit";
import * as forge from "node-forge";
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
    payload: {
        message: ChatScreen[]; // Adjusted payload structure
        id: number | undefined;
    };
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
            const { message, id } = action.payload;

            const privateKeyJsonString: string | null = localStorage.getItem("user_data");
            const privateKeyJson = privateKeyJsonString ? JSON.parse(privateKeyJsonString) : "";

            // Create a private key object
                const privateKey = forge.pki.privateKeyFromPem(privateKeyJson.private_key);

                // Convert the private key to PEM format
                const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            

            console.log(privateKeyPem, "private key in PEM format");

            var test =
                "SBC1YF/s5Ui/4OMjtU6wGNIqn1O2wewhOV3cmlM5AMdGn3w+6WkavmVlCMtn15PKtV0hbQJjYhz5ilb0wdpjopA4GCAv43BP087JeqdGl9o3gxQ3ho6xwIWMCTqYAL+WMrwg9qMppoaKgp+TzmYX6J9QGkLeI5VIsOWd6XYEZKlpyyO1/PZ1SwM5/gc56CSiecQIii9pB+mvlKwVDRPiQIrQ/VQ2kZ/vKJn8pfnFfdpqNjF7WKgcAq+OUs4At9rb5qpjdjq/aZMT+xky5sn5ZD93TUXroFysIV9slkbLy7DD9fVL/4PcIHnAvYmTZMp/ooH0J0ThzfDOpBW5TKIjkQ==";
            message.map((item: ChatScreen) => {
                const encryptedMessageBytes = forge.util.decode64(test);
                const decryptedMessage = privateKey.decrypt(encryptedMessageBytes, "RSA-OAEP");
                const decryptedMessageString = forge.util.decodeUtf8(decryptedMessage);

                console.log(decryptedMessageString, "decrypted message");
            });

            state.messageList = message;
        },
        setChatId: (state, action) => {
            state.chatId = action.payload.id;
            console.log(state.chatId, "chatId");
            state.opened = true;
            state.receiverName = action.payload.username;
        },
    },
});

export const { addToMessage, setChatId } = MessageSlice.actions;

export default MessageSlice.reducer;
