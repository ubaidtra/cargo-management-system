export default function StatusBadge({ status, type }) {
  // type can be 'status' (Sent/Received) or 'payment' (Paid/Unpaid)
  const className = `badge badge-${status.toLowerCase()}`;
  
  return (
    <span className={className}>
      {status}
    </span>
  );
}

