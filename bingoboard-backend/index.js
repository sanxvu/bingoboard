import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Get all boards
app.get("/boards", async (req, res) => {
  const { data, error } = await supabase.from("boards").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Get one board
app.get("/boards/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Create a board
app.post("/boards", async (req, res) => {
  const { title, owner_id } = req.body;
  const { data, error } = await supabase
    .from("boards")
    .insert([{ title, owner_id: owner_id || null }])
    .select();
  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

// Get tasks for a board
app.get("/boards/:id/tasks", async (req, res) => {
  console.log("GET TASKS FOR BOARD", req.params.id);

  const { id } = req.params;
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", id);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Add task to board
app.post("/boards/:id/tasks", async (req, res) => {
  console.log("ADD TASK TO BOARD", req.params.id);
  const { id } = req.params;
  const { description, position } = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ board_id: id, description, position }])
    .select()
    .single(); // returns one object

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// Update task - description, completed
app.patch("/tasks/:id", async (req, res) => {
  console.log("PATCH TASK", req.params.id);
  console.log("BODY:", req.body);

  const { id } = req.params;

  const { data, error } = await supabase
    .from("tasks")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  console.log("UPDATED TASK:", data);
  res.json(data);
});

// Update board - title
app.patch("/boards/:id", async (req, res) => {
  console.log("PATCH BOARD", req.params.id);
  console.log("BODY:", req.body);

  const { id } = req.params;

  const { data, error } = await supabase
    .from("boards")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  console.log("UPDATED BOARD:", data);
  res.json(data);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /tasks", id);

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task deleted successfully", task: data[0] });
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
