import { useState } from "react";
import BoardSelector from "../components/BoardSelector/BoardSelector";
import Board from "../components/BingoBoard/BingoBoard";
import "./Home.css";
export default function Home() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Goal Bingo</h1>
        <p>
          Set 25 goals, complete them to get BINGO! Track your progress and
          celebrate your wins.
        </p>
      </div>
      <div className="boards-container">
        <BoardSelector
          selectedBoard={selectedBoard}
          onSelectBoard={setSelectedBoard}
        />

        <div>
          {selectedBoard ? (
            <Board boardId={selectedBoard} />
          ) : (
            <p>Select a board</p>
          )}
        </div>
      </div>
    </div>
  );
}
