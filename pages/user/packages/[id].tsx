import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "../../../utils/supabaseClient"

export default function PackageDetails() {
  const router = useRouter()
  const { id } = router.query
  const [subPackages, setSubPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchSubPackages = async () => {
      const { data, error } = await supabase
        .from("subpackages")
        .select("*")
        .eq("package_id", id)
      if (error) {
        console.error(error)
      } else {
        setSubPackages(data || [])
      }
      setLoading(false)
    }
    fetchSubPackages()
  }, [id])

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sub-Packages</h2>
      <ul>
        {subPackages.map((sp) => (
          <li key={sp.id} style={{ marginBottom: "10px" }}>
            <span style={{ marginRight: "10px" }}>{sp.name}</span>
            <button onClick={() => router.push(`/user/subpackage/${sp.id}`)}>
              Open
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
