import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


const CourseContent = ({ course }) => {
  const { toast } = useToast();
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedSections, setExpandedSections] = useState(['Course Content']);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAttempt, setUserAttempt] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {},
        };
  
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
  
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/quizzes/course/${course._id}`,
          config
        );
        setQuiz(response.data.quiz);
        setUserAttempt(response.data.userAttempted);
        
  
  
        if (response.data.userAttempted) {
          setQuizSubmitted(true);
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
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

  const handleQuizSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
  
    if (!token) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You need to be logged in to enroll.",
      });
      return;
    }
  
    // Ensure quiz is loaded before trying to access its questions
    if (!quiz || !quiz.questions) {
      toast({
        variant: "destructive",
        title: "Quiz not found",
        description: "Please try again later.",
      });
      return;
    }
  
    // Prepare the answers object based on user selections
    const answers = quiz.questions.reduce((acc, question) => {
      const selectedAnswer = quizAnswers[question._id]; // quizAnswers should map question IDs to answers
      if (selectedAnswer) {
        acc[question._id] = selectedAnswer;
      }
      return acc;
    }, {});
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/quizzes/submit`,
        {
          quizId: quiz._id, // Ensure quiz._id is correct
          answers: answers,  // This should now match the expected format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setQuizSubmitted(true);
      setUserAttempt(response.data.attempt);
      alert(`Quiz submitted! You scored ${response.data.attempt.score} out of ${quiz.questions.length * 10}.`);
    } catch (error) {
      console.error('Failed to submit quiz:', error.response?.data || error.message);
      alert('Failed to submit quiz. Please try again.');
    }
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
                  {quizSubmitted ? (
                    <div>
                      <p>You have already submitted this quiz.</p>
                      <p>Your score: {userAttempt.score} out of {quiz.questions.length * 10}</p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
