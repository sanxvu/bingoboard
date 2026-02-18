import { useSearchParams } from "react-router-dom";
import BoardSelector from "../components/BoardSelector/BoardSelector";
import BingoBoard from "../components/BingoBoard/BingoBoard";
import { tokens } from "../styles/tokens";
import "./Home.css";
import "../styles/typography.css";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBoardId = searchParams.get("board");

  const handleSelectBoard = (boardId: string) => {
    setSearchParams({ board: boardId });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="text-title">Goal Bingo</h1>
        <p className="text-body">
          Set 25 goals, complete them to get BINGO! Track your progress and
          celebrate your wins.
        </p>
      </div>
      <div className="boards-container">
        <BoardSelector
          selectedBoard={selectedBoardId}
          onSelectBoard={handleSelectBoard}
        />

        <div>
          {selectedBoardId ? (
            <BingoBoard boardId={selectedBoardId} />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                padding: tokens.spacing.lg,
                textAlign: "center",
              }}
            >
              <span className="text-body">
                No board selected. <br />
                Create a new board or select one from the sidebar
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
