// pages/add-user.tsx
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function AddUser() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === "ahmed@admin.com") {
        setIsAdmin(true)
      } else {
        router.push("/dashboard") // لو مش الأدمن الأساسي
      }
    } else {
      router.push("/") // لو مش مسجل دخول
    }
  }, [router])

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    // نخزن المستخدم الجديد في localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const exists = users.find((u: any) => u.email === email)

    if (exists) {
      setError("This user already exists")
      return
    }

    users.push({ email, password })
    localStorage.setItem("users", JSON.stringify(users))
    setSuccess("User added successfully ✅")
    setEmail("")
    setPassword("")
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>Add New User</h1>
      <form onSubmit={handleAddUser}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="User Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "10px", width: "100%" }}
        />
        <button
          type="submit"
          style={{
            background: "blue",
            color: "white",
            padding: "10px",
            border: "none",
            width: "100%",
            cursor: "pointer"
          }}
        >
          Add User
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  )
}
