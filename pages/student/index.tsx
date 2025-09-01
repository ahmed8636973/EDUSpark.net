import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function StudentPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [subPackages, setSubPackages] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [selectedSubPackage, setSelectedSubPackage] = useState("")

  // 📌 تحميل الـ Packages
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

  // 📌 تحميل الفيديوهات
  const fetchVideos = async (subPackageId: string) => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("subpackage_id", subPackageId)
    if (!error && data) setVideos(data)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎓 Student Portal</h1>

      {/* اختيار Package */}
      <div style={{ marginBottom: "20px" }}>
        <label>Choose Package: </label>
        <select
          value={selectedPackage}
          onChange={(e) => {
            setSelectedPackage(e.target.value)
            setSelectedSubPackage("")
            setVideos([])
            fetchSubPackages(e.target.value)
          }}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          <option value="">-- Select --</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      {/* اختيار Sub-Package */}
      {selectedPackage && (
        <div style={{ marginBottom: "20px" }}>
          <label>Choose Sub-Package: </label>
          <select
            value={selectedSubPackage}
            onChange={(e) => {
              setSelectedSubPackage(e.target.value)
              fetchVideos(e.target.value)
            }}
            style={{ padding: "8px", marginLeft: "10px" }}
          >
            <option value="">-- Select --</option>
            {subPackages.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* عرض الفيديوهات */}
      {selectedSubPackage && (
        <div>
          <h2>📺 Videos</h2>
          {videos.length === 0 ? (
            <p>No videos found for this Sub-Package.</p>
          ) : (
            <ul>
              {videos.map((vid) => (
                <li key={vid.id} style={{ marginBottom: "15px" }}>
                  <iframe
                    width="400"
                    height="250"
                    src={vid.url.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
