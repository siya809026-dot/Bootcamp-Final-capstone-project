import "./Sidebar.css";

export default function Sidebar({ subjects = [], activeSubject, onSelect }) {
  return (
    <aside className="sidebar">
      <p className="sidebar-heading">subjects</p>
      <button
        className={`sidebar-item ${!activeSubject ? "sidebar-item-active" : ""}`}
        onClick={() => onSelect(null)}
      >
        all notes
      </button>
      {subjects.map((subject) => (
        <button
          key={subject}
          className={`sidebar-item ${activeSubject === subject ? "sidebar-item-active" : ""}`}
          onClick={() => onSelect(subject)}
        >
          {subject}
        </button>
      ))}
    </aside>
  );
}