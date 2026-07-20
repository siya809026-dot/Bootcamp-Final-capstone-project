import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./NoteCard.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Matches your Note schema: { _id, title, description, subject, uploadedBy: { name, role }, createdAt }
export default function NoteCard({ note, rotation = 0, canModify = false, onEdit, onDelete, onDenied }) {
  const { title, description, subject, uploadedBy } = note;
  const creatorName = uploadedBy?.name || "unknown";
  const creatorRole = uploadedBy?.role || "";

  function handleEdit() {
    if (canModify) onEdit?.(note);
    else onDenied?.(note);
  }

  function handleDelete() {
    if (canModify) onDelete?.(note._id);
    else onDenied?.(note);
  }

  return (
    <div className="note-card" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="note-card-top">
        <div className="note-creator">
          <span className="note-avatar">{getInitials(creatorName)}</span>
          <div>
            <p className="note-creator-name">{creatorName}</p>
            <span className={`note-role-badge ${creatorRole === "Teacher" ? "role-teacher" : "role-student"}`}>
              {creatorRole}
            </span>
          </div>
        </div>

        <div className="note-icon-group">
          <button
            className={`note-icon-btn ${!canModify ? "note-icon-btn-locked" : ""}`}
            onClick={handleEdit}
            aria-label="Edit"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            className={`note-icon-btn ${!canModify ? "note-icon-btn-locked" : ""}`}
            onClick={handleDelete}
            aria-label="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {subject && <span className="note-subject-tag">{subject}</span>}

      {title && <h3 className="note-card-title">{title}</h3>}

      {description && <div className="note-card-highlight">{description}</div>}
    </div>
  );
}