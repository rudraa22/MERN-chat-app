import MyChats from "../components/MyChats";
import { ChatState } from "../context/chatProvider";

const ChatPage = () => {
  const { selectedChat } = ChatState();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <MyChats />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
        {selectedChat ? (
          <p>Chat window for: <strong>{selectedChat.chatName || "1-on-1 chat"}</strong></p>
        ) : (
          <p>Select a chat or search for a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;