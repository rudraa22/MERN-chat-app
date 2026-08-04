import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, skip straight to the chat page
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) navigate("/chats");
  }, [navigate]);

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "20px" }}>
    <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px" }}>WhatsApp Clone</h1> 
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("login")}
          style={{
            flex: 1,
            padding: "10px",
            fontWeight: activeTab === "login" ? "bold" : "normal",
            borderBottom: activeTab === "login" ? "2px solid green" : "1px solid gray",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          style={{
            flex: 1,
            padding: "10px",
            fontWeight: activeTab === "signup" ? "bold" : "normal",
            borderBottom: activeTab === "signup" ? "2px solid green" : "1px solid gray",
          }}
        >
          Sign Up
        </button>
      </div>

      {activeTab === "login" ? <Login /> : <Signup />}
    </div>
  );
};

export default HomePage;