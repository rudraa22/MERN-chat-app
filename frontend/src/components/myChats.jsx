import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import { ChatState } from "../context/chatProvider";

const MyChats = () => {
  const { user, setUser, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  // Fetch all of the logged-in user's chats
  const fetchChats = async () => {
    try {
      const { data } = await API.get("/chats", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(data);
    } catch (error) {
      console.log("Error fetching chats", error);
    }
  };

  useEffect(() => {
    if (user) fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Search for users by name/email (we'll build this backend endpoint next)
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const { data } = await API.get(`/users?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResults(data);
      setSearching(false);
    } catch (error) {
      console.log("Search error", error);
      setSearching(false);
    }
  };

  // Start (or open existing) a 1-on-1 chat with a searched user
  const accessChat = async (userId) => {
    try {
      const { data } = await API.post(
        "/chats",
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // If this chat isn't already in our list, add it
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setSearch("");
      setSearchResults([]);
    } catch (error) {
      console.log("Access chat error", error);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  // Figures out the "other person's" name for a 1-on-1 chat (not a group)
  const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find((u) => u._id !== user._id);
    return otherUser ? otherUser.name : "Unknown";
  };

  return (
    <div style={{ width: "320px", borderRight: "1px solid #333", display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>{user?.name}</h3>
        <button onClick={logoutHandler}>Logout</button>
      </div>

      <div style={{ padding: "12px", borderBottom: "1px solid #333" }}>
        <input
          type="text"
          placeholder="Search users to chat..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        {searching && <p style={{ fontSize: "12px" }}>Searching...</p>}
        {searchResults.map((u) => (
          <div
            key={u._id}
            onClick={() => accessChat(u._id)}
            style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #222" }}
          >
            {u.name} <span style={{ fontSize: "12px", color: "#888" }}>({u.email})</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              backgroundColor: selectedChat?._id === chat._id ? "#333" : "transparent",
              borderBottom: "1px solid #222",
            }}
          >
            <strong>{getChatName(chat)}</strong>
            {chat.latestMessage && (
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#999" }}>
                {chat.latestMessage.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;