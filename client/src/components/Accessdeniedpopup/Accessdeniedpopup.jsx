import { FiLock } from "react-icons/fi";
import "./AccessDeniedPopup.css";

export default function AccessDeniedPopup({ note, onClose }) {
  const creatorName = note?.uploadedBy?.name || "someone else";
  const creatorRole = note?.uploadedBy?.role || "";

  return (
    <div className="denied-overlay" onClick={onClose}>
      <div className="denied-card" onClick={(e) => e.stopPropagation()}>
        <div className="denied-icon">
          <FiLock size={18} />
        </div>
        <h3 className="denied-title">This note isn't yours</h3>
        <p className="denied-text">
          "{note?.title}" was created by <strong>{creatorName}</strong>
          {creatorRole && ` (${creatorRole})`}. Only they or a Teacher can edit or delete it.
        </p>
        <button className="denied-close" onClick={onClose}>
          got it
        </button>
      </div>
    </div>
  );
}