import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/Button.module.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "edit"
  | "delete"
  | "assign"
  | "unassign";

interface ButtonProps {
  variant: ButtonVariant;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  children,
  small = false,
  disabled = false,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        small ? styles.small : ""
      }`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
