export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-aside">
        <h2>Laboratory 6<br />Web Development 2</h2>
        <p>Simple CRUD Application</p>
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
