import { useState, useEffect } from "react"

function App() {
  // UI state
  const [isLogin, setIsLogin] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // popup state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success"
  })

  // 🔗 BACKEND URLS (FIXED & EXPLICIT)
  const BASE_URL = "http://localhost:7000/api/v1/customers"
  const REGISTER_URL = `${BASE_URL}/register`
  const LOGIN_URL = `${BASE_URL}/login`
  const LOGOUT_URL = `${BASE_URL}/logout`

  // popup helpers
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type })
  }

  const closePopup = () => {
    setPopup({ show: false, message: "", type: "success" })
  }

  // auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) setIsAuthenticated(true)
  }, [])

  // REGISTER
  const handleRegister = async () => {
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        showPopup(data.message || "Register failed", "error")
        return
      }

      showPopup("Registration successful 🎉 Please login")
      setIsLogin(true)

    } catch {
      showPopup("Server not reachable", "error")
    }
  }

  // LOGIN
  const handleLogin = async () => {
  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // VERY IMPORTANT
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      showPopup(data.message || "Login failed", "error")
      return
    }

    // ❌ DO NOT read accessToken from body
    // ❌ DO NOT store in localStorage

    setIsAuthenticated(true)
    showPopup("Welcome 🎉 Login successful")

  } catch (err) {
    console.error(err)
    showPopup("Unexpected error during login", "error")
  }
}


  // LOGOUT
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      await fetch(LOGOUT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

    } catch {}

    localStorage.removeItem("accessToken")
    setIsAuthenticated(false)
    setIsLogin(true)
    showPopup("Logged out successfully 👋")
  }

  return (
    <div className="container">
      <style>{css}</style>

      {/* AUTHENTICATED VIEW */}
      {isAuthenticated ? (
        <>
          <h2>Welcome 🎉</h2>
          <p>You are logged in successfully.</p>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={handleRegister}>Register</button>
          )}

          <p className="switch" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create new account" : "Already have an account?"}
          </p>
        </>
      )}

      {/* POPUP */}
      {popup.show && (
        <div className="overlay">
          <div className={`popup ${popup.type}`}>
            <p>{popup.message}</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

const css = `
* {
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: #f4f6f8;
}

.container {
  width: 350px;
  margin: 80px auto;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #007bff;
  border: none;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.logout {
  background: #dc3545;
}

.switch {
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
}

/* POPUP */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 300px;
  text-align: center;
}

.popup.success {
  border-top: 5px solid #28a745;
}

.popup.error {
  border-top: 5px solid #dc3545;
}

.popup button {
  margin-top: 15px;
}
`

export default App
