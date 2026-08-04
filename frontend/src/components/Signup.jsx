import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../config/api";
import { ChatState } from "../context/chatProvider";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(""); // will hold the Cloudinary URL
  const [picUploading, setPicUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = ChatState();
  const navigate = useNavigate();

  const uploadPic = async (file) => {
    if (!file) return;

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setError("Please select a JPEG or PNG image");
      return;
    }

    setPicUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setPic(data.secure_url);
      setPicUploading(false);
    } catch (err) {
      console.log("Cloudinary upload error:", err);
      setError("Image upload failed, please try again");
      setPicUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/signup", { name, email, password, pic });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Profile Picture (optional)
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => uploadPic(e.target.files[0])}
        />
        {picUploading && <p>Uploading picture...</p>}
        {pic && (
          <img
            src={pic}
            alt="Preview"
            style={{ width: "60px", height: "60px", borderRadius: "50%", marginTop: "8px" }}
          />
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading || picUploading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default Signup;