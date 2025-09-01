import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function SubPackagesPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [subPackages, setSubPackages] = useState<any[]>([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [newSubPackage, setNewSubPackage] = useState("")

  // 📌 تحميل الباكجات
  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data, error } = await supabase.from("packages").select("*")
    if (!error && data) setPackages(data)
  }

  // 📌 تحميل Sub-Packages
  const fetchSubPackages = async (packageId: string) => {
    const { data, error } = await supabase
      .from("subpackages")
      .select("*")
      .eq("package_id", packageId)

    if (!error && data) setSubPackages(data)
  }

  // 📌 إضافة Sub-Package جديد
  const addSubPackage = async () => {
    if (!newSubPackage || !selectedPackage) return
    const { data, error } = await supabase
      .from("subpackages")
      .insert([{ name: newSubPackage, package_id: selectedPackage }])
      .select()

    if (!error && data) {
      setSubPackages([...subPackages, data[0]])
      setNewSubPackage("")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Sub-Packages</h1>

      {/* اختيار Package */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Package: </label>
        <select
          value={selectedPackage}
          onChange={(e) => {
            setSelectedPackage(e.target.value)
            fetchSubPackages(e.target.value)
          }}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          <option value="">-- Choose --</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      {/* إضافة Sub-Package */}
      {selectedPackage && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="New Sub-Package Name"
            value={newSubPackage}
            onChange={(e) => setNewSubPackage(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={addSubPackage}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Sub-Package
          </button>
        </div>
      )}

      {/* عرض Sub-Packages */}
      {selectedPackage && (
        <ul>
          {subPackages.map((sub) => (
            <li key={sub.id}>{sub.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
