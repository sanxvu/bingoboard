import { tokens } from "../../styles/tokens";
import { colors } from "../../styles/colors";

interface KeyItemProps {
  label: string;
  variant: "empty" | "idle" | "completed";
}

function KeyItem({ label, variant }: KeyItemProps) {
  const baseStyle = {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
  };

  const variantStyle =
    variant === "empty"
      ? {
          backgroundColor: colors.board.bg,
          border: `2px dashed ${colors.square.emptyBorder}`,
        }
      : variant === "completed"
      ? {
          backgroundColor: colors.interaction.purple,
          border: "none",
        }
      : {
          backgroundColor: colors.square.idle,
          border: `1px solid ${colors.square.emptyBorder}`,
        };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.sm,
      }}
    >
      <div style={{ ...baseStyle, ...variantStyle }} />
      <span
        style={{
          fontSize: tokens.text.caption.fontSize,
          fontWeight: tokens.text.caption.fontWeight,
          color: colors.text.secondary,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function BoardKey() {
  return (
    <div
      style={{
        marginTop: tokens.spacing.lg,
        display: "flex",
        gap: tokens.spacing.lg,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <KeyItem label="Empty" variant="empty" />
      <KeyItem label="Goal Set" variant="idle" />
      <KeyItem label="Completed" variant="completed" />
    </div>
  );
}
