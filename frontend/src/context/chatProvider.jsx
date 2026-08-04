import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // On app load, check if user info is saved in localStorage (from a previous login)
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // If no user is logged in, redirect to the login/signup page
    if (!userInfo) navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook so components can easily access this context
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;