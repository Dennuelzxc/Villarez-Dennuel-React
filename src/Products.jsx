import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, addProduct, updateProduct, deleteProduct } from './api'
import ProductModal from './ProductModal'
import ConfirmDialog from './ConfirmDialog'

const idOf = (p) => p.id

// Change 'PHP' to 'USD' (or any ISO currency code) if you prefer.
const CURRENCY = 'PHP'
const money = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: CURRENCY }).format(Number(n) || 0)

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // null | { product?: obj }
  const [toDelete, setToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const res = await getProducts()
      setProducts(Array.isArray(res.data) ? res.data : res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      [p.product_name, p.description].some((v) => String(v ?? '').toLowerCase().includes(q))
    )
  }, [products, query])

  const stats = useMemo(() => {
    const qty = (p) => Number(p.quantity) || 0
    return {
      count: products.length,
      units: products.reduce((s, p) => s + qty(p), 0),
      value: products.reduce((s, p) => s + qty(p) * (Number(p.price) || 0), 0),
    }
  }, [products])

  async function save(data) {
    if (modal.product) {
      await updateProduct(idOf(modal.product), data)
      notify('Product updated')
    } else {
      await addProduct(data)
      notify('Product created')
    }
    setModal(null)
    load()
  }

  async function remove() {
    try {
      await deleteProduct(idOf(toDelete))
      notify('Product deleted')
      setProducts((list) => list.filter((p) => idOf(p) !== idOf(toDelete)))
    } catch (err) {
      notify(err.response?.data?.error || err.message || 'Delete failed', 'err')
    }
    setToDelete(null)
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">▲</span> Laboratory 6</div>
        <button className="btn btn-ghost" onClick={logout}>Sign out</button>
      </header>

      <main className="container">
        <div className="page-head">
          <div>
            <h1>Products</h1>
            <p className="muted">Create, edit and remove items in your catalogue.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal({})}>＋ Add product</button>
        </div>

        <section className="stats">
          <div className="stat"><span>Products</span><strong>{stats.count}</strong></div>
          <div className="stat"><span>Units in stock</span><strong>{stats.units.toLocaleString()}</strong></div>
          <div className="stat"><span>Inventory value</span><strong>{money(stats.value)}</strong></div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <input
              className="search"
              placeholder="Search by name or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert m">
              {error} <button className="link" onClick={load}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="skeletons">
              {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
            </div>
          ) : filtered.length === 0 && !error ? (
            <div className="empty">
              <div className="empty-icon">📦</div>
              <h3>{products.length ? 'No matches' : 'No products yet'}</h3>
              <p className="muted">
                {products.length ? 'Try a different search term.' : 'Add your first product to get started.'}
              </p>
              {!products.length && (
                <button className="btn btn-primary" onClick={() => setModal({})}>＋ Add product</button>
              )}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="num">Price</th>
                    <th className="num">Stock</th>
                    <th className="actions-col" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const qty = Number(p.quantity) || 0
                    return (
                      <tr key={idOf(p)}>
                        <td data-label="Product">
                          <div className="pname">{p.product_name}</div>
                          {p.description && <div className="pdesc">{p.description}</div>}
                        </td>
                        <td className="num" data-label="Price">{money(p.price)}</td>
                        <td className="num" data-label="Stock">
                          <span className={`stock ${qty === 0 ? 'out' : qty < 10 ? 'low' : 'ok'}`}>{qty}</span>
                        </td>
                        <td className="actions-col">
                          <button className="btn btn-sm btn-ghost" onClick={() => setModal({ product: p })}>Edit</button>
                          <button className="btn btn-sm btn-ghost danger" onClick={() => setToDelete(p)}>Delete</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal && <ProductModal product={modal.product} onClose={() => setModal(null)} onSave={save} />}
      {toDelete && (
        <ConfirmDialog
          title="Delete product?"
          message={`“${toDelete.product_name}” will be permanently removed. This can't be undone.`}
          onCancel={() => setToDelete(null)}
          onConfirm={remove}
        />
      )}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
