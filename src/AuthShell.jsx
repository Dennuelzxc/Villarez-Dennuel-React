export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-aside">
        <div className="brand">
          <span className="brand-mark">▲</span> Stockroom
        </div>
        <h2>Keep every product<br />in one place.</h2>
        <p>Add, edit and track your catalogue with a fast, focused workspace.</p>
        <div className="aside-orb orb-1" />
        <div className="aside-orb orb-2" />
      </div>
      <div className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
