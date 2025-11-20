export default function Button({ children, variant = 'primary', onClick, type = 'button', ...props }) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick} 
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

