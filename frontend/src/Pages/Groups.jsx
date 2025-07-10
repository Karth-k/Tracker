// src/Pages/Groups.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const { token } = useContext(AuthContext);

useEffect(() => {
  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  fetchGroups();
}, []);


  const joinGroup = async (groupId) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/groups/join/${groupId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message || "Joined successfully!");

  } catch (err) {
    console.error("Join group failed:", err);
    alert(err.response?.data?.message || "Failed to join group");
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Available Learning Groups</h2>
      {groups.map((group) => (
        <div key={group._id} style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10 }}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          <button onClick={() => joinGroup(group._id)}>Join</button>
        </div>
      ))}
    </div>
  );
};

export default Groups;
