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
        }}
      >
        <span
          style={{
            ...tokens.text.secondary,
            color: colors.text.secondary,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          YOUR BOARDS
        </span>

        <button
          onClick={() => setAddingBoard((prev) => !prev)}
          style={{
            ...tokens.text.secondary,
            color: colors.text.purple,
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
            marginTop: tokens.spacing.sm,
            borderRadius: tokens.radius.md,
            backgroundColor: colors.square.idle,
            gap: tokens.spacing.sm,
          }}
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Board name..."
            style={{
              flex: 1,
              padding: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              border: `1px solid ${colors.square.emptyBorder}`,
              fontSize: tokens.text.body.fontSize,
              fontWeight: tokens.text.body.fontWeight,
              lineHeight: tokens.text.body.lineHeight,
              outline: "none",
              marginBottom: tokens.spacing.sm,
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
            style={{
              ...tokens.text.secondary,
              backgroundColor: colors.interaction.purple,
              color: "#fff",
              borderRadius: tokens.radius.sm,
              cursor: "pointer",
              fontSize: tokens.text.body.fontSize,
              fontWeight: tokens.text.body.fontWeight,
              lineHeight: tokens.text.body.lineHeight,
              marginBottom: tokens.spacing.sm,
            }}
          >
            Create
          </button>
        </div>
      )}

      {/* --- Board list --- */}
      {boards.length === 0 ? (
        <div
          style={{
            padding: tokens.spacing.md,
            borderRadius: tokens.radius.sm,
            textAlign: "center",
            fontSize: tokens.text.body.fontSize,
            fontWeight: tokens.text.body.fontWeight,
            color: colors.text.secondary,
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
            style={{
              padding: tokens.spacing.sm,
              borderRadius: tokens.radius.sm,
              backgroundColor: colors.square.emptyBg,
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: tokens.text.body.fontSize,
              fontWeight: tokens.text.body.fontWeight,
              color: colors.text.primary,
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
