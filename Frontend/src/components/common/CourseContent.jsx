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
  const [expandedSections, setExpandedSections] = useState(["Course Content"]);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAttempt, setUserAttempt] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [completedVideos, setCompletedVideos] = useState({});

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

        if (response.data.quiz) {          
          setQuiz(response.data.quiz);
          setUserAttempt(response.data.userAttempted);
          setUserScore(response.data.userScore);

          if (response.data.userAttempted) {
            setQuizSubmitted(true);
          }
        } else {
          setQuiz(null); // Handle no quiz case
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
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/courses/${course._id}/videos/${videoIndex}/complete`,
        {},
        config
      );
      toast({
        title: "Video completed!",
        description: `You earned ${response.data.xpEarned} XP.`,
      });

      setCompletedVideos((prev) => ({
        ...prev,
        [videoIndex]: true, // Track video as completed
      }));
    } catch (error) {
      console.error("Failed to complete video:", error);
      toast({
        title: "Error",
        description: "Failed to complete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEmbedUrl = (url) => {
    let videoId;
    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else {
      return null;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleQuizSubmit = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You need to be logged in to submit the quiz.",
      });
      return;
    }
  
    if (!quiz || !quiz.questions) {
      toast({
        variant: "destructive",
        title: "Quiz not found",
        description: "Please try again later.",
      });
      return;
    }
  
    const answers = quiz.questions.reduce((acc, question) => {
      const selectedAnswer = quizAnswers[question._id];
      if (selectedAnswer) {
        acc[question._id] = selectedAnswer;
      }
      return acc;
    }, {});
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/quizzes/submit`,
        {
          quizId: quiz._id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setQuizSubmitted(true);
      setUserAttempt(response.data.attempt);
      setUserScore(response.data.attempt.score);
  
      // Provide immediate feedback to the user
      toast({
        title: "Quiz submitted!",
        description: `You scored ${response.data.attempt.score} out of ${
          quiz.questions.length * 10
        }.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to submit quiz:", error.response?.data || error.message);
      toast({
        title: "Submission failed",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!course || !course.videos) {
    return <div>Loading course content...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <Collapsible
          open={expandedSections.includes("Course Content")}
          onOpenChange={() => toggleSection("Course Content")}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {expandedSections.includes("Course Content") ? (
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
                        onClick={() =>
                          setActiveVideo(
                            activeVideo === getEmbedUrl(video.url)
                              ? null
                              : getEmbedUrl(video.url)
                          )
                        }
                      >
                        {video.title}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteVideo(video._id)}
                      disabled={
                        completedVideos[video._id] ||
                        video.progress === "completed"
                      }
                    >
                      {completedVideos[video._id] || video.progress === "completed"
                        ? "Completed"
                        : "Complete"}
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

      {quiz ? (
        <Card className="mt-6">
          <Collapsible
            open={expandedSections.includes("Quiz")}
            onOpenChange={() => toggleSection("Quiz")}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {expandedSections.includes("Quiz") ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Course Quiz</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions •{" "}
                      {quizSubmitted ? "Completed" : "Not attempted"}
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="border-t pt-6">
                <div className="space-y-6">
                  {quizSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="font-medium text-green-800">
                        You have already submitted this quiz.
                      </p>
                      <p className="text-muted-foreground">
                        Your score: <b>{userScore} / {quiz.questions.length * 10}</b>
                      </p>
                    </div>
                  ) : (
                    quiz.questions.map((question, index) => (
                      <div
                        key={question._id}
                        className="space-y-2 rounded-lg border border-muted p-4"
                      >
                        <h4 className="font-semibold">
                          {index + 1}. {question.questionText}
                        </h4>
                        <RadioGroup
                          className="grid gap-4"
                          value={quizAnswers[question._id] || ""}
                          onValueChange={(value) =>
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [question._id]: value,
                            }))
                          }
                        >
                          {question.options.map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`q${index}-${option}`}
                              />
                              <Label htmlFor={`q${index}-${option}`}>
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))
                  )}
                  {!quizSubmitted && (
                    <Button
                      onClick={handleQuizSubmit}
                      variant="outline"
                      className="w-full"
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ) : (
        <div className="mt-6 p-4 text-center text-muted-foreground">
          <p>No quiz available for this course.</p>
        </div>
      )}
    </div>
  );
};

export default CourseContent;
