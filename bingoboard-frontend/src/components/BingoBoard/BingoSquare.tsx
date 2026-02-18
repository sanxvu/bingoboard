import { useState, useRef } from "react";
import { tokens } from "../../styles/tokens";
import { colors } from "../../styles/colors";
import "../../styles/typography.css";

type Task = {
  id: string;
  description: string;
  completed: boolean;
  position: number;
};

interface BingoSquareProps {
  task: Task | null;
  index: number;
  onToggleTask: (task: Task) => void;
  onCreateTask: (index: number) => void;
  onEditTask: (task: Task) => void;
}

export default function BingoSquare({
  task,
  index,
  onToggleTask,
  onCreateTask,
  onEditTask,
}: BingoSquareProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isEmpty = !task;
  const isCompleted = task?.completed ?? false;

  // handle single vs double click ux
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // background logic
  const backgroundColor = isCompleted
    ? colors.square.completed
    : hovered
      ? colors.interaction.purpleBg
      : isEmpty
        ? colors.square.emptyBg
        : pressed
          ? colors.square.pressed
          : colors.square.idle;

  // border logic
  const border = isEmpty
    ? `2px dashed ${
        hovered ? colors.interaction.purple : colors.square.emptyBorder
      }`
    : hovered
      ? `1px solid ${colors.interaction.purple}`
      : "none";

  // text color
  const textColor = isCompleted
    ? colors.square.completedText
    : hovered
      ? colors.interaction.purple
      : isEmpty
        ? colors.square.emptyText
        : isCompleted
          ? colors.square.completedText
          : colors.square.text;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => {
        if (!task) {
          onCreateTask(index);
          return;
        }

        if (clickTimeout.current) return;

        clickTimeout.current = setTimeout(() => {
          onToggleTask(task);
          clickTimeout.current = null;
        }, 200);
      }}
      onDoubleClick={() => {
        if (!task) return;

        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
        }

        onEditTask(task);
      }}
      style={{
        backgroundColor,
        border,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.md,
        height: 100,
        width: 100,
        boxSizing: "border-box",

        boxShadow: isEmpty || hovered || pressed ? "none" : tokens.shadow.soft,

        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: `
          background-color ${tokens.motion.normal} ease-out,
          border ${tokens.motion.normal} ease-out,
          transform 300ms ease-out
        `,

        cursor: "pointer",
        userSelect: "none",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <span
        style={{
          color: textColor,
          fontSize: 14,
          lineHeight: 1.4,
          transition: `color ${tokens.motion.normal} ease-out`,
        }}
      >
        {task ? task.description : "+ Add goal"}
      </span>
    </div>
  );
}
