import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const nav = useNavigate();
  const submit = async (e: any) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    nav("/login");
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="First" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Last" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
