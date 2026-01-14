import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Get all boards
app.get("/boards", async (req, res) => {
  const { data, error } = await supabase.from("boards").select("*");
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
  const { id } = req.params;
  const { description } = req.body;
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ board_id: id, description }]);
  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

// Mark task as completed by a user (MVP: simple boolean for now)
app.patch("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body; // true/false
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);
  if (error) return res.status(500).json({ error });
  res.json(data[0]);
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
