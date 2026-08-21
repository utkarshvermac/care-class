import Modal from "./Modal.jsx";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = true, loading }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    footer={
      <>
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className={danger ? "btn-danger" : "btn-primary"}>
          {loading ? "Working…" : confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm text-paper-100/60">{message}</p>
  </Modal>
);

export default ConfirmDialog;
