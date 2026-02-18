import { useEffect, useState } from "react";

type Task = {
  id: string;
  description: string;
  completed: boolean;
  position: number;
};

interface EditTaskModalProps {
  isOpen: boolean;
  mode: "edit" | "create";
  initialValue?: string;
  onSave: (description: string) => void;
  onClose: () => void;
  onDelete: (taskId: string) => void;
}

export default function EditTaskModal({
  isOpen,
  mode,
  initialValue = "",
  onSave,
  onClose,
  onDelete,
}: EditTaskModalProps) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    setDescription(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalStyle = {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 300,
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>{mode === "edit" ? "Edit Goal" : "Add New Goal"}</h2>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter goal..."
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <button
            onClick={async () => {
              if (description.trim() === "") return;
              onSave(description);
              onClose();
            }}
          >
            {mode === "edit" ? "Save Changes" : "Add Goal"}
          </button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
