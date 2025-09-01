import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function VideosPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [subPackages, setSubPackages] = useState<any[]>([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [selectedSubPackage, setSelectedSubPackage] = useState("")
  const [videos, setVideos] = useState<any[]>([])
  const [newVideoUrl, setNewVideoUrl] = useState("")

  // 📌 تحميل Packages
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

  // 📌 تحميل فيديوهات
  const fetchVideos = async (subPackageId: string) => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("subpackage_id", subPackageId)
    if (!error && data) setVideos(data)
  }

  // 📌 إضافة فيديو
  const addVideo = async () => {
    if (!newVideoUrl || !selectedSubPackage) return
    const { data, error } = await supabase
      .from("videos")
      .insert([{ url: newVideoUrl, subpackage_id: selectedSubPackage }])
      .select()
    if (!error && data) {
      setVideos([...videos, data[0]])
      setNewVideoUrl("")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Videos</h1>

      {/* اختيار Package */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Package: </label>
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
          <option value="">-- Choose --</option>
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
          <label>Select Sub-Package: </label>
          <select
            value={selectedSubPackage}
            onChange={(e) => {
              setSelectedSubPackage(e.target.value)
              fetchVideos(e.target.value)
            }}
            style={{ padding: "8px", marginLeft: "10px" }}
          >
            <option value="">-- Choose --</option>
            {subPackages.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* إضافة فيديو */}
      {selectedSubPackage && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="YouTube Video URL"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            style={{ padding: "8px", marginRight: "10px", width: "300px" }}
          />
          <button
            onClick={addVideo}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Video
          </button>
        </div>
      )}

      {/* عرض الفيديوهات */}
      {selectedSubPackage && (
        <ul>
          {videos.map((vid) => (
            <li key={vid.id}>
              <a href={vid.url} target="_blank" rel="noopener noreferrer">
                {vid.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
