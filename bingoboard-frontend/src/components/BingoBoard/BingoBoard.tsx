import { useEffect, useState } from "react";
import axios from "axios";
import "./BingoBoard.css";
import BingoSquare from "./BingoSquare";
import BoardKey from "./BoardKey";
import { tokens } from "../../styles/tokens";
import { colors } from "../../styles/colors";
import "../../styles/typography.css";

type Task = {
  id: string;
  description: string;
  completed: boolean;
  position: number;
};

interface BoardProps {
  boardId: string;
}

interface BoardData {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
}

export default function Board({ boardId }: BoardProps) {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blackout, setBlackout] = useState(false);

  const gridSize = 25;
  const tasksByPosition = Array(gridSize).fill(null);
  tasks.forEach((task) => {
    tasksByPosition[task.position] = task;
  });

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/boards/${boardId}`);
      setBoard(res.data);
    } catch (err) {
      console.error("Error fetching board", err);
    }
  };

  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:4000/boards/${boardId}/tasks`,
    );
    setTasks(res.data);
  };

  const addTask = async (position: number) => {
    const description = prompt("Task name?");
    if (!description) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/boards/${boardId}/tasks`,
        {
          description,
          position,
        },
      );
      console.log("Task created:", res.data);
      setTasks((prev) => [...prev, res.data]);
    } catch (err: any) {
      console.error("Error creating task:", err.response?.data || err.message);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      const res = await axios.patch(`http://localhost:4000/tasks/${task.id}`, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  const editTask = async (task: Task) => {
    console.log("edit");
    const newDescription = prompt("Edit task", task.description);
    if (!newDescription || newDescription === task.description) return;
    try {
      const res = await axios.patch(`http://localhost:4000/tasks/${task.id}`, {
        description: newDescription,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Error editing task", err);
    }
  };

  const checkBlackout = (positions: (Task | null)[]) => {
    // All cells must be filled and every one completed
    return (
      positions.length === gridSize &&
      positions.every((cell) => cell !== null && cell.completed)
    );
  };

  useEffect(() => {
    if (!boardId) return;
    fetchBoard();
    fetchTasks();
  }, [boardId, tasks]);

  useEffect(() => {
    setBlackout(checkBlackout(tasksByPosition));
  }, [tasks, gridSize]);

  if (!board) return <p>Loading board...</p>;

  return (
    <div>
      <h2
        className="text-heading"
        style={{
          marginTop: tokens.spacing.sm,
          marginBottom: "0",
        }}
      >
        {board.title}
      </h2>
      <p
        className="text-caption"
        style={{
          marginTop: tokens.spacing.sm,
          marginBottom: tokens.spacing.lg,
        }}
      >
        Click a cell to mark complete • Double-click to edit
      </p>
      <div
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          backgroundColor: colors.board.bg,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.lg,
          display: "grid",
          gap: tokens.spacing.md,
          boxShadow: tokens.shadow.container,
        }}
      >
        {tasksByPosition.map((task, index) => (
          <BingoSquare
            key={index}
            task={task}
            index={index}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onEditTask={editTask}
          />
        ))}
      </div>

      {/* --- Legend --- */}
      <BoardKey />

      {/* --- Blackout banner --- */}
      {blackout && (
        <div className="blackout-banner">
          <h3 className="blackout-title">Blackout! 🎉</h3>
          <p className="blackout-message">
            You completed all your goals. Congratulations!
          </p>
        </div>
      )}
    </div>
  );
}
