import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

export const CLOUDINARY_CLOUD_NAME = "w3tbgzmr";
export const CLOUDINARY_UPLOAD_PRESET = "whatsapp_clone_preset";

export default API;