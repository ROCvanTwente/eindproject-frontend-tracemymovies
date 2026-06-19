import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

function Chat() {
    const [connection, setConnection] = useState(null);
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") + "/chatHub") // API URL
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        newConnection
            .start()
            .then(() => {
                console.log("Verbonden met SignalR");

                newConnection.on("ReceiveMessage", (user, message) => {
                    setMessages((prev) => [
                        ...prev,
                        { user, message }
                    ]);
                });
            })
            .catch((err) => console.error(err));

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (!connection) return;

        try {
            await connection.invoke(
                "SendMessage",
                user,
                message
            );

            setMessage("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Naam"
            />

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bericht"
            />

            <button onClick={sendMessage}>
                Verstuur
            </button>

            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Chat;