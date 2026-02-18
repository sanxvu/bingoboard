import { useEffect, useState } from "react";
import axios from "axios";
import "./BingoBoard.css";
import BingoSquare from "./BingoSquare";
import BoardKey from "./BoardKey";
import { tokens } from "../../styles/tokens";
import { colors } from "../../styles/colors";
import "../../styles/typography.css";
import EditTaskModal from "./EditTaskModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "create">("edit");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  // Build 5x5 grid
  const gridSize = 25;
  const tasksByPosition = Array(gridSize).fill(null);
  tasks.forEach((task) => {
    tasksByPosition[task.position] = task;
  });

  // Fetch board
  const fetchBoard = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/boards/${boardId}`);
      setBoard(res.data);
    } catch (err) {
      console.error("Error fetching board", err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:4000/boards/${boardId}/tasks`,
    );
    setTasks(res.data);
  };

  // Add new goal
  const createTask = (position: number) => {
    setSelectedTask(null);
    setSelectedPosition(position);
    setModalMode("create");
    setModalOpen(true);
  };

  // Edit goal
  const editTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedPosition(task.position);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Handle save for create and edit task
  const handleSave = async (description: string) => {
    if (!description.trim() || selectedPosition === null) return;

    try {
      if (modalMode === "edit" && selectedTask) {
        const res = await axios.patch(
          `http://localhost:4000/tasks/${selectedTask.id}`,
          {
            description,
          },
        );
        console.log("CREATE RESPONSE:", res.data);
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? res.data : t)),
        );
      } else if (modalMode === "create") {
        const res = await axios.post(
          `http://localhost:4000/boards/${boardId}/tasks`,
          {
            description,
            position: selectedPosition,
          },
        );
        console.log("CREATE RESPONSE:", res.data);
        setTasks((prev) => [...prev, res.data]);
      }
      setSelectedTask(null);
      setSelectedPosition(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Mark task as completed
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

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Update board title
  const updateBoardTitle = async () => {
    if (!titleInput.trim() || !board) return;

    try {
      const res = await axios.patch(`http://localhost:4000/boards/${boardId}`, {
        title: titleInput,
      });

      setBoard(res.data);
    } catch (err) {
      console.error("Error updating board title:", err);
    } finally {
      setEditingTitle(false);
    }
  };

  useEffect(() => {
    if (!boardId) return;
    fetchBoard();
    fetchTasks();
  }, [boardId]);

  useEffect(() => {
    if (board) setTitleInput(board.title);
  }, [board]);

  if (!board) return <p>Loading board...</p>;

  return (
    <div>
      {editingTitle ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateBoardTitle();
            setEditingTitle(false);
          }}
        >
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            autoFocus
            onBlur={() => {
              updateBoardTitle();
              setEditingTitle(false);
            }}
            style={{
              fontSize: 24,
              fontWeight: 600,
            }}
          />
        </form>
      ) : (
        <h2 onClick={() => setEditingTitle(true)}>{board.title}</h2>
      )}
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
            onCreateTask={createTask}
            onEditTask={editTask}
          />
        ))}
      </div>

      {/* --- Legend --- */}
      <BoardKey />

      <EditTaskModal
        isOpen={modalOpen}
        mode={modalMode}
        initialValue={selectedTask?.description}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
        onDelete={deleteTask}
      />
    </div>
  );
}
