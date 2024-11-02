import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react"
import { Button } from "../ui/button"
import axios from "axios"

export default function CourseContent({ course }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const [expandedSections, setExpandedSections] = useState([])

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    )
  }

  const handleCompleteVideo = async (videoIndex) => {
    try {
      const response = await axios.post(`/api/courses/${course._id}/complete/${videoIndex}`)
      alert(`Video completed! You earned ${response.data.xpEarned} XP.`)
    } catch (error) {
      console.error('Failed to complete video:', error)
      alert('Failed to complete video. Please try again.')
    }
  }

  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID from URL
    return `https://www.youtube.com/embed/${videoId}`; // Return embed URL
  }

  if (!course || !course.videos) {
    return <div>Loading course content...</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <Collapsible
          open={expandedSections.includes('Course Content')}
          onOpenChange={() => toggleSection('Course Content')}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {expandedSections.includes('Course Content') ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold">Course Content</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.videos.length} videos • {course.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="border-t pt-4">
              <div className="space-y-2">
                {course.videos.map((video, index) => (
                  <div
                    key={video._id}
                    className="group flex items-center justify-between rounded-lg p-2 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      <span
                        className="cursor-pointer"
                        onClick={() => setActiveVideo(activeVideo === getEmbedUrl(video.url) ? null : getEmbedUrl(video.url))}
                      >
                        {video.title}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteVideo(index)}
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            {activeVideo && (
              <div className="aspect-video p-4">
                <iframe
                  src={activeVideo}
                  className="h-full w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
