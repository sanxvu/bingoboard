import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

type Board = {
  id: string;
  title: string;
  created_at: string;
};

type Task = {
  id: string;
  description: string;
  completed: boolean;
  position: number;
};

export default function BoardDetail() {
  const { id } = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blackout, setBlackout] = useState(false);

  const gridSize = 9;
  const tasksByPosition = Array(gridSize).fill(null);
  tasks.forEach((task) => {
    tasksByPosition[task.position] = task;
  });

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      console.error("Error fetching board", err);
    }
  };

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:4000/boards/${id}/tasks`);
    setTasks(res.data);
  };

  const addTask = async (position: number) => {
    const description = prompt("Task name?");
    if (!description) return;

    try {
      const res = await axios.post(`http://localhost:4000/boards/${id}/tasks`, {
        description,
        position,
      });
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

  const checkBlackout = (tasks: Task[]) => {
    // tasksByPosition may have empty cells, so filter out nulls
    const realTasks = tasks.filter(Boolean);
    return realTasks.every((t) => t.completed);
  };

  useEffect(() => {
    if (!id) return;
    fetchBoard();
    fetchTasks();
  }, [id]);

  useEffect(() => {
    fetchTasks();
  }, [tasks]);

  useEffect(() => {
    setBlackout(checkBlackout(tasksByPosition));
  }, [tasksByPosition]);

  if (!board) return <p>Loading board...</p>;

  return (
    <div>
      <Link to={"/"} relative="path">
        &larr; <span>Back to Boards</span>
      </Link>

      <h3>{board.title}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          maxWidth: "400px",
        }}
      >
        {tasksByPosition.map((task, index) => (
          <div
            key={index}
            onClick={() => {
              if (task) toggleTask(task);
              else addTask(index);
            }}
            style={{
              border: "2px solid black",
              width: "100px",
              height: "100px",
              cursor: "pointer",
              background: task?.completed ? "#c8f7c5" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "8px",
            }}
          >
            {task ? task.description : "+"}
          </div>
        ))}
      </div>
      {blackout && <p> 🎉 BLACKOUT BINGO! 🎉</p>}
    </div>
  );
}
