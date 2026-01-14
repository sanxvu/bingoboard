import { useEffect, useState } from "react";
import axios from "axios";
import BoardDetail from "./BoardDetail";

interface Board {
  id: string;
  title: string;
}

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

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

  if (selectedBoardId) {
    return (
      <BoardDetail
        boardId={selectedBoardId}
        onBack={() => setSelectedBoardId(null)}
      />
    );
  }

  return (
    <>
      <div>
        <h1>Bingo Boards</h1>
        <input
          placeholder="Add title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createBoard}>Create Board</button>
        <ul>
          {boards.map((board) => (
            <li key={board.id}>{board.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
