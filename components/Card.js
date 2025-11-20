export default function Card({ children, title, className = '' }) {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '24px' }}>
      {title && <h3 style={{ marginBottom: '16px' }}>{title}</h3>}
      {children}
    </div>
  );
}

