import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [newPackage, setNewPackage] = useState("")

  // 📌 تحميل الباكجات من Supabase
  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data, error } = await supabase.from("packages").select("*")
    if (!error && data) setPackages(data)
  }

  // 📌 إضافة Package جديد
  const addPackage = async () => {
    if (!newPackage) return
    const { data, error } = await supabase
      .from("packages")
      .insert([{ name: newPackage }])
      .select()

    if (!error && data) {
      setPackages([...packages, data[0]])
      setNewPackage("")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Packages</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New Package Name"
          value={newPackage}
          onChange={(e) => setNewPackage(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          onClick={addPackage}
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Package
        </button>
      </div>

      <ul>
        {packages.map((pkg) => (
          <li key={pkg.id}>{pkg.name}</li>
        ))}
      </ul>
    </div>
  )
}
