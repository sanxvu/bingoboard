import { useEffect, useState } from "react";
import axios from "axios";
import "./BoardSelector.css";

interface BoardSelectorProps {
  selectedBoard: string | null;
  onSelectBoard: (id: string) => void;
}

export default function BoardSelector({
  selectedBoard,
  onSelectBoard,
}: BoardSelectorProps) {
  const [boards, setBoards] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");

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
      console.log("Board created:", res.data);
      setNewTitle("");
      fetchBoards();
    } catch (err: any) {
      console.error("Error creating board:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="board-selector-container">
      <h2>Your Boards</h2>
      <input
        placeholder="Add title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={createBoard}>Create Board</button>
      {boards.map((board) => (
        <div key={board.id}>
          <button onClick={() => onSelectBoard(board.id)}>{board.title}</button>
        </div>
      ))}
    </div>
  );
}
