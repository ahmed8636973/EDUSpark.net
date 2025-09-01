import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../../lib/supabaseClient"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push("/admin/login")
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => router.push("/admin/packages")}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Manage Packages
        </button>

        <button
          onClick={() => router.push("/admin/sub-packages")}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Manage Sub-Packages
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
