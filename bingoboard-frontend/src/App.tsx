import { Routes, Route } from "react-router-dom";
import "./App.css";
import BoardList from "./components/BoardList";
import BoardDetail from "./components/BoardDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardList />} />
      <Route path="/boards/:id" element={<BoardDetail />} />
    </Routes>
  );
}
