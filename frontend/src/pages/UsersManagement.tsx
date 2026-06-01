import React, { useEffect, useState } from "react";
import api from "../services/api";

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { api.get("/users").then((r) => setUsers(r.data.data.rows || [])); }, []);
  return (
    <div>
      <h2>Users</h2>
      <ul>{users.map((u) => <li key={u.id}>{u.email} - {u.role}</li>)}</ul>
    </div>
  );
};

export default UsersManagement;
