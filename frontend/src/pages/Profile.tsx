import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <h2>Profile</h2>
      {currentUser && (
        <div>
          <p>Email: {currentUser.email}</p>
          <p>Role: {currentUser.role}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
