import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const activeUsers = JSON.parse(localStorage.getItem("active_users") || "[]")

    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)

    // تحقق من تسجيل الدخول على جهاز واحد
    if (user.email !== "ahmed@admin.com" && !activeUsers.includes(user.email)) {
      localStorage.removeItem("user")
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    const email = storedUser.email

    if (email === "ahmed@admin.com") {
      localStorage.removeItem("session_admin")
    } else {
      const activeUsers = JSON.parse(localStorage.getItem("active_users") || "[]")
      const updatedUsers = activeUsers.filter((u: string) => u !== email)
      localStorage.setItem("active_users", JSON.stringify(updatedUsers))
    }

    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
