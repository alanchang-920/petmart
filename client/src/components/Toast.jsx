/**
 * Fixed-position toast banner. The parent owns the timer + state and renders
 * <Toast> only while a message exists.
 */
function Toast({ message, type = "success" }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "⚠"}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
