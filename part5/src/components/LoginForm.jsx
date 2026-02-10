const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => (
  <div>
    <h2>log in to application</h2>

    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">login</button>
    </form>
  </div>
)

export default LoginForm
