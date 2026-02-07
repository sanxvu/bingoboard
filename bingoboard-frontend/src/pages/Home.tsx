import { useState } from "react";
import BoardSelector from "../components/BoardSelector/BoardSelector";
import Board from "../components/BingoBoard/BingoBoard";
import "./Home.css";
import { tokens } from "../styles/tokens";
import { colors } from "../styles/colors";

export default function Home() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1
          style={{
            fontSize: tokens.text.title.fontSize,
            fontWeight: tokens.text.title.fontWeight,
            lineHeight: tokens.text.title.lineHeight,
            color: colors.text.primary,
          }}
        >
          Goal Bingo
        </h1>
        <p
          style={{
            fontSize: tokens.text.body.fontSize,
            fontWeight: tokens.text.body.fontWeight,
            lineHeight: tokens.text.body.lineHeight,
            color: colors.text.secondary,
          }}
        >
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
