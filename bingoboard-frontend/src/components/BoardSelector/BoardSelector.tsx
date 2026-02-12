import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../styles/tokens";
import { colors } from "../../styles/colors";

interface BoardSelectorProps {
  selectedBoard: string | null;
  onSelectBoard: (id: string) => void;
}

export default function BoardSelector({ onSelectBoard }: BoardSelectorProps) {
  const [boards, setBoards] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [addingBoard, setAddingBoard] = useState(false);

  const fetchBoards = async () => {
    const res = await axios.get("http://localhost:4000/boards");
    setBoards(res.data);
  };

  const createBoard = async () => {
    if (!newTitle) return;
    try {
      const res = await axios.post("http://localhost:4000/boards", {
        title: newTitle,
      });
      setNewTitle("");
      setAddingBoard(false);
      fetchBoards();
    } catch (err: any) {
      console.error("Error creating board:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: tokens.spacing.md,
        borderRadius: tokens.radius.md,
        backgroundColor: colors.square.idle,
        boxShadow: tokens.shadow.container,
        width: 300,
      }}
    >
      {/* --- Top row: label + +New button --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: tokens.spacing.sm,
        }}
      >
        <span
          className="text-secondary"
          style={{
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          YOUR BOARDS
        </span>

        <button
          onClick={() => setAddingBoard((prev) => !prev)}
          className="text-secondary"
          style={{
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>

      {/* --- Input bar appears below top row --- */}
      {addingBoard && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: tokens.radius.md,
            backgroundColor: colors.square.idle,
            gap: tokens.spacing.sm,
            marginBottom: tokens.spacing.sm,
          }}
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Board name..."
            className="text-body"
            style={{
              flex: 1,
              padding: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              border: `1px solid ${colors.square.emptyBorder}`,
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim()) {
                createBoard();
              }
            }}
          />

          <button
            onClick={() => {
              if (newTitle.trim()) createBoard();
            }}
            className="text-body"
            style={{
              backgroundColor: colors.interaction.purple,
              color: "#fff",
              borderRadius: tokens.radius.sm,
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </div>
      )}

      {/* --- Board list --- */}
      {boards.length === 0 ? (
        <div
        className="text-body"
          style={{
            padding: tokens.spacing.md,
            borderRadius: tokens.radius.sm,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          No boards yet
        </div>
      ) : (
        boards.map((board) => (
          <button
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className="text-body"
            style={{
              padding: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              backgroundColor: colors.square.emptyBg,
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: tokens.shadow.soft,
            }}
          >
            {board.title}
          </button>
        ))
      )}
    </div>
  );
}
