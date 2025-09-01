import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "../../../utils/supabaseClient"

export default function SubPackageDetails() {
  const router = useRouter()
  const { id } = router.query
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("subpackage_id", id)
      if (error) {
        console.error(error)
      } else {
        setVideos(data || [])
      }
      setLoading(false)
    }
    fetchVideos()
  }, [id])

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id} style={{ marginBottom: "20px" }}>
            <p>{video.title}</p>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
