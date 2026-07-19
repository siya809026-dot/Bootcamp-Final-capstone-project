import "./Loader.css";

export default function Loader({ inline = false }) {
  return (
    <div className={inline ? "loader-wrap loader-inline" : "loader-wrap"}>
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
    </div>
  );
}