import { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io("http://localhost:4500", {
  auth: {
    token: localStorage.getItem("userToken"),
  },
  autoConnect: true,
});

const SocketProvider = (props) => {
    const { children } = props || {}; 
    if (!children) {
        console.error("SocketProvider: children prop is missing.");
    }
    return (
        <SocketContext.Provider value={socket}>
            {children || null}
        </SocketContext.Provider>
    );
};


export default SocketProvider;
