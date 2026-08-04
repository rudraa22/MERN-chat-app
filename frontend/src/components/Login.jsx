import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import { ChatState } from "../context/chatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = ChatState();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", { email, password });      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;