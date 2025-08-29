'use client';

import NavBar from '../../components/NavBar';
import Player from '../../components/Player';

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="relative flex-1 bg-gradient-to-b from-blue-100 to-purple-100 overflow-hidden">
        <div
          data-ladder
          className="absolute left-40 bottom-0 w-8 h-48 bg-yellow-500"
        ></div>
        <div
          data-ledge
          className="absolute left-96 bottom-24 w-32 h-8 bg-gray-600"
        ></div>
        <Player />
      </div>
    </div>
  );
}

