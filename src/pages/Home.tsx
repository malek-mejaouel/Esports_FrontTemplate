"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit room ID
    navigate(`/game/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate(`/game/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-2xl border-none bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-indigo-800 mb-2">Belote Online</CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Create or join a game room to play with friends!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              className="w-full py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Create New Room
            </Button>
          </div>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="space-y-4">
            <Label htmlFor="room-id" className="text-base font-medium text-gray-700">Join Existing Room</Label>
            <Input
              id="room-id"
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
            />
            <Button
              onClick={handleJoinRoom}
              disabled={!roomId.trim()}
              className="w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Home;