import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Groups = () => {
  const { token, user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groups");
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, []);

  const createGroup = async () => {
    if (!groupName.trim() || !groupDescription.trim()) {
      alert("Please provide both group name and description");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/groups/create",
        { name: groupName, description: groupDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setGroups((prev) => [...prev, res.data.group]);
      setGroupName("");
      setGroupDescription("");
    } catch (err) {
      console.error("Create group failed:", err);
      alert(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/groups/join/${groupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Joined group successfully");
      setGroups((prevGroups) =>
        prevGroups.map((grp) =>
          grp._id === groupId ? { ...grp, members: [...grp.members, user.id] } : grp
        )
      );
    } catch (err) {
      console.error("Join group failed:", err);
      alert(err.response?.data?.message || "Failed to join group");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Group</h2>
      <div style={styles.formRow}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Group Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={createGroup}
          disabled={loading}
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>

      <h2 style={{ ...styles.heading, marginTop: 40 }}>Available Groups</h2>
      {groups.length === 0 ? (
        <p style={styles.noGroupsText}>No groups available</p>
      ) : (
        <div style={styles.groupsGrid}>
          {groups.map((group) => {
            const isMember = group.members.includes(user.id);
            return (
              <div key={group._id} style={styles.groupCard}>
                <h3 style={styles.groupName}>{group.name}</h3>
                <p style={styles.groupDescription}>{group.description}</p>
                {isMember ? (
                  <span style={styles.joinedBadge}>Joined</span>
                ) : (
                  <button
                    onClick={() => joinGroup(group._id)}
                    style={styles.joinButton}
                  >
                    Join Group
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  heading: {
    fontWeight: "600",
    fontSize: 28,
    marginBottom: 20,
    color: "white"
  },
  formRow: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    flex: "1 1 200px",
    padding: "10px 15px",
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  button: {
    padding: "10px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    fontSize: 16,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  groupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  groupCard: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  groupName: {
    margin: 0,
    marginBottom: 8,
    fontSize: 22,
    fontWeight: "700",
  },
  groupDescription: {
    flexGrow: 1,
    fontSize: 16,
    color: "#555",
  },
  joinButton: {
    marginTop: 15,
    padding: "10px 20px",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: 5,
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  joinedBadge: {
    marginTop: 15,
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    borderRadius: 12,
    fontWeight: "600",
    fontSize: 14,
    display: "inline-block",
  },
  noGroupsText: {
    fontStyle: "italic",
    color: "#888",
  },
};

export default Groups;
