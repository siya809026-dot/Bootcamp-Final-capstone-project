import { FiMail, FiUser } from "react-icons/fi";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="profile-page">
          <p className="profile-empty">Couldn't find your profile — try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">{getInitials(user.name)}</div>

          <h1 className="profile-name">{user.name}</h1>
          <span className={`profile-role-badge ${user.role === "Teacher" ? "role-teacher" : "role-student"}`}>
            {user.role}
          </span>

          <div className="profile-details">
            <div className="profile-row">
              <FiUser size={14} />
              <span>{user.name}</span>
            </div>
            <div className="profile-row">
              <FiMail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}