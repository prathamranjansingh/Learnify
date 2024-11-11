import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from 'lucide-react';
import axios from 'axios'; // Import axios for making API calls
import { useParams } from 'react-router-dom'; // Import useParams for courseId

const LeaderBoard = () => {
  const { courseId } = useParams(); // Get courseId from the URL params
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/gamification/leaderboard/${courseId}`);
        setLeaderboard(response.data);
        console.log(response.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setIsLoading(false); // Stop loading if error occurs
      }
    };

    fetchLeaderboard();
  }, [courseId]); // Fetch leaderboard data whenever courseId changes

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Course Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading leaderboard...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow key={entry._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      <span>{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(entry.studentId.username)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{entry.studentId.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">
                      {entry.xp.toLocaleString()} XP
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono">
                      {entry.progress}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderBoard;
