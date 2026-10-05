import "./StatCard.css";

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h2 className="stat-value">{value}</h2>
      </div>

      <div className="stat-icon">{icon}</div>
    </div>
  );
}

export default StatCard;
