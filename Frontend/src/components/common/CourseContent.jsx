import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, PlayCircle, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const CourseContent = ({ course }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedSections, setExpandedSections] = useState(['Course Content']);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/course/${course._id}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    };

    fetchQuiz();
  }, [course._id]);

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((title) => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const handleCompleteVideo = async (videoIndex) => {
    try {
      const response = await axios.post(`/api/courses/${course._id}/complete/${videoIndex}`);
      alert(`Video completed! You earned ${response.data.xpEarned} XP.`);
    } catch (error) {
      console.error('Failed to complete video:', error);
      alert('Failed to complete video. Please try again.');
    }
  };

  const getEmbedUrl = (url) => {
    let videoId;
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = quiz.questions.reduce((acc, question) => {
      return acc + (quizAnswers[question._id] === question.correctAnswer ? 1 : 0);
    }, 0);
    alert(`Quiz submitted! You scored ${score} out of ${quiz.questions.length}.`);
  };

  if (!course || !course.videos) {
    return <div>Loading course content...</div>;
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

      {quiz && (
        <Card>
          <Collapsible
            open={expandedSections.includes('Quiz')}
            onOpenChange={() => toggleSection('Quiz')}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {expandedSections.includes('Quiz') ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold">Course Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="border-t pt-4">
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <div key={question._id} className="space-y-2">
                      <p className="font-medium">{index + 1}. {question.questionText}</p>
                      <RadioGroup
                        onValueChange={(value) => setQuizAnswers((prev) => ({ ...prev, [question._id]: value }))}
                        disabled={quizSubmitted}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question._id}-${optionIndex}`} />
                            <Label htmlFor={`${question._id}-${optionIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={quizSubmitted}
                  >
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
};

export default CourseContent;
