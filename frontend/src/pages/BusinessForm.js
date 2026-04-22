import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusinessForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    description: "",
    category: ""
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("owner", userData.email || "");
    formData.append("image", image);

    await axios.post("http://localhost:5000/api/business", formData);

    alert("Business Added!");
    navigate("/profile");
  };

  return (
    <div>
      <h2>Add Business</h2>

      <input placeholder="Name"
        onChange={e => setData({...data, name: e.target.value})} />

      <input placeholder="Description"
        onChange={e => setData({...data, description: e.target.value})} />

      <input placeholder="Category"
        onChange={e => setData({...data, category: e.target.value})} />

      <input type="file"
        onChange={e => setImage(e.target.files[0])} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
