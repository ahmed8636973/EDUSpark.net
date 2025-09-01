import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function UsersList() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState<{ email: string; password: string }[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    const user = JSON.parse(storedUser)
    if (user.email !== "ahmed@admin.com") {
      router.push("/dashboard")
    } else {
      setIsAdmin(true)
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
      setUsers(storedUsers)
    }
  }, [router])

  const handleDelete = (emailToDelete: string) => {
    const updatedUsers = users.filter(u => u.email !== emailToDelete)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  if (!isAdmin) return null

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users List</h1>
      {users.length === 0 && <p>No users found</p>}
      <ul>
        {users.map((u, i) => (
          <li key={i}>
            {u.email}{" "}
            <button onClick={() => handleDelete(u.email)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
