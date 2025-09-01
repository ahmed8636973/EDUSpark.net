import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../../utils/supabaseClient"

export default function UserPackages() {
  const router = useRouter()
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase.from("packages").select("*")
      if (error) {
        console.error(error)
      } else {
        setPackages(data || [])
      }
      setLoading(false)
    }
    fetchPackages()
  }, [])

  const handleOpen = (id: string) => {
    router.push(`/user/packages/${id}`)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Packages</h2>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg.id} style={{ marginBottom: "10px" }}>
            <span style={{ marginRight: "10px" }}>{pkg.name}</span>
            <button onClick={() => handleOpen(pkg.id)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
