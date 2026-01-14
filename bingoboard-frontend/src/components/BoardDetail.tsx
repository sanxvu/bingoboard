import {useEffect, useState} from "react";
import axios from "axios";

interface Task {
    id: string;
    description: string;
    completed: boolean;
}

interface BoardDetailProps {
    boardId: string;
    onBack: () => void;
}

export default function BoardDetail({boardId, onBack}:BoardDetailProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        const res = await axios.get(`https://localhost:4000/boards/${boardId}/tasks`);
        setTasks(res.data);
    }

    const addTask = async () => {
        if (!newTask) return;
        await axios.post(`http://localhost:4000/boards/${boardId}/tasks`, {description: newTask });
        setNewTask("");
        fetchTasks();
    };

    const toggleComplete = async (taskId: string, completed: boolean) => {
        await axios.patch(`https://localhost:4000/tasks/${taskId}`, {completed: !completed});
        fetchTasks();
    }

    useEffect(()=> {fetchTasks();}, [boardId]);
    return (
        <div>
            <button onClick={onBack}>Back to Boards</button>
            <h3>Tasks</h3>

            <input
                placeholder="New task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id, task.completed)}
                        />
                        {task.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}