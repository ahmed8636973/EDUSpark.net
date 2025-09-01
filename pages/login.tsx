import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // تحقق من الأدمن
    if (email === "ahmed@admin.com" && password === "Mmna01275074528") {
      const session = localStorage.getItem("session_admin")
      if (session) {
        setError("Admin already logged in on another device!")
        return
      }
      localStorage.setItem("session_admin", "active")
      localStorage.setItem("user", JSON.stringify({ email }))
      router.push("/dashboard")
      return
    }

    // المستخدم العادي
    const user = users.find((u: any) => u.email === email && u.password === password)
    if (!user) {
      setError("Invalid credentials")
      return
    }

    const activeUsers = JSON.parse(localStorage.getItem("active_users") || "[]")
    if (activeUsers.includes(email)) {
      setError("This user is already logged in on another device!")
      return
    }

    // تسجيل الدخول
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("active_users", JSON.stringify([...activeUsers, email]))
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
      />
      <button type="submit" style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  )
}
