export default function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>{label}</label>}
      <input className="input-field" {...props} />
    </div>
  );
}

