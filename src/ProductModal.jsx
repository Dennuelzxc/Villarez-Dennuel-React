import { useEffect, useState } from 'react'

const empty = { product_name: '', price: '', quantity: '', description: '' }

export default function ProductModal({ product, onClose, onSave }) {
  const editing = !!product
  const [form, setForm] = useState(
    product
      ? {
          product_name: product.product_name ?? '',
          price: product.price ?? '',
          quantity: product.quantity ?? '',
          description: product.description ?? '',
        }
      : empty
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({
        product_name: form.product_name.trim(),
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed')
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h3>{editing ? 'Edit product' : 'New product'}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {error && <div className="alert">{error}</div>}
        <label className="field">
          <span>Name</span>
          <input value={form.product_name} onChange={set('product_name')} placeholder="Stand fan" required autoFocus />
        </label>
        <div className="row">
          <label className="field">
            <span>Price</span>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" required />
          </label>
          <label className="field">
            <span>Quantity</span>
            <input type="number" min="0" step="1" value={form.quantity} onChange={set('quantity')} placeholder="0" required />
          </label>
        </div>
        <label className="field">
          <span>Description</span>
          <textarea rows="3" value={form.description} onChange={set('description')} placeholder="Short description (optional)" />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  )
}
