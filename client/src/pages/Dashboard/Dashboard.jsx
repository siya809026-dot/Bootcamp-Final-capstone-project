import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiSearch } from "react-icons/fi";

import noteApi from "../../services/noteApi";
import aiApi from "../../services/aiApi";
import Notecard from "../../components/Notecard/Notecard";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/Modal";
import AccessdeniedPopup from "../../components/AccessdeniedPopup/AccessdeniedPopup";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { canModifyNote } from "../../services/Permissions";
import "./Dashboard.css";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // null = no active AI search
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deniedNote, setDeniedNote] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchNotes();
  }, []);

  // debounced AI semantic search — runs 500ms after user stops typing
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const token = localStorage.getItem("token");
        const res = await aiApi.get("/search", {
          params: { q: search },
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(res.data.notes || []);
      } catch (err) {
        console.error("AI search error:", err);
        toast.error("Search failed");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  async function fetchNotes() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await noteApi.get("/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.notes || res.data?.data || res.data;
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchNotes error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      toast.error("Couldn't load your notes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");
      await noteApi.delete(`/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete note");
    }
  }

  function handleEdit(note) {
    setEditingNote(note);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingNote(null);
  }

  const subjects = [...new Set(notes.map((n) => n.subject).filter(Boolean))];

  // when an AI search is active, use its results; otherwise show all notes
  const baseList = searchResults !== null ? searchResults : notes;

  const filteredNotes = baseList.filter((n) =>
    activeSubject ? n.subject === activeSubject : true
  );

  // subtle alternating rotation so the grid feels pinned, not templated
  const rotations = [-1.2, 0.8, -0.5, 1, -0.9, 0.5];

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar subjects={subjects} activeSubject={activeSubject} onSelect={setActiveSubject} />

        <div className="dashboard">
          <div className="dashboard-toolbar">
            <div className="dashboard-search">
              <FiSearch size={14} />
              <input
                placeholder="Search your notes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {searching && <span className="dashboard-search-loading">searching…</span>}
            </div>
            <button
              className="dashboard-new-btn"
              onClick={() => {
                setEditingNote(null);
                setShowModal(true);
              }}
            >
              <FiPlus size={14} /> New
            </button>
          </div>

          {showModal && (
            <Modal
              onClose={closeModal}
              editingNote={editingNote}
              onCreated={(newNote) => setNotes((prev) => [newNote, ...prev])}
              onUpdated={(updated) =>
                setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)))
              }
            />
          )}

          {deniedNote && (
            <AccessDeniedPopup note={deniedNote} onClose={() => setDeniedNote(null)} />
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <p className="dashboard-empty">Error: {error}</p>
          ) : filteredNotes.length === 0 ? (
            <p className="dashboard-empty">No notes yet — start writing.</p>
          ) : (
            <div className="dashboard-grid">
              {filteredNotes.map((note, i) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  rotation={rotations[i % rotations.length]}
                  canModify={canModifyNote(note, currentUser)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDenied={setDeniedNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}