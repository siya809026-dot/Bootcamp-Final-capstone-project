import { useState } from "react";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

import noteApi from "../../services/noteApi";
import Loader from "../Loader/Loader";
import "./Modal.css";

// Pass `editingNote` to open the modal in edit mode instead of create mode.
export default function Modal({ onClose, onCreated, onUpdated, editingNote = null }) {
  const isEditing = Boolean(editingNote);

  const [form, setForm] = useState({
    title: editingNote?.title || "",
    description: editingNote?.description || "",
    subject: editingNote?.subject || "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isEditing) {
        const res = await noteApi.put(`/${editingNote._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Note updated");
        onUpdated?.(res.data.note);
      } else {
        const res = await noteApi.post("/create", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Note added");
        onCreated?.(res.data.note);
      }
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isEditing ? "Couldn't update note" : "Couldn't create note")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FiX size={16} />
        </button>

        <h2 className="modal-title">{isEditing ? "edit note" : "new note"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="modal-input"
            name="title"
            placeholder="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="modal-input"
            name="subject"
            placeholder="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
          <textarea
            className="modal-textarea"
            name="description"
            placeholder="write something..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
          <button className="modal-submit" type="submit" disabled={loading}>
            {loading ? <Loader inline /> : isEditing ? "update note" : "save note"}
          </button>
        </form>
      </div>
    </div>
  );
}