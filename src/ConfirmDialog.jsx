import { useState } from 'react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false)

  async function go() {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm">
        <div className="confirm-icon">!</div>
        <h3>{title}</h3>
        <p className="muted">{message}</p>
        <div className="modal-actions center">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={go} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
