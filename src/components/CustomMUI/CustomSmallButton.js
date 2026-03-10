import { Button } from "@mui/material";
import React from "react";

export function CustomSmallButton(prop) {
  const { onClick, disabled, name, type, style } = prop;

  const getTextColor = (type, disabled) => {
    if (disabled) {
      return "var(--primary-color-700)";
    }

    switch (type) {
      case "btn-lightyellow":
        return "var(--color-orange)";
      case "btn-gray":
        return "black";
      default:
        return "var(--primary-color-white)";
    }
  };

  const textColor = getTextColor(type, disabled);

  const getBackgroundColor = (type, disabled) => {
    if (disabled) {
      return "var(--primary-color-500)";
    }

    switch (type) {
      case "btn-success":
        return "var(--secondary-color-300)";
      case "btn-warning":
        return "var(--warning-color)";
      case "btn-danger":
        return "var(--error-color)";
      case "btn-primary":
        return "var(--primary-color-700)";
      case "btn-lightyellow":
        return "var(--fill-lightyellow-color)";
      case "btn-edit":
        return "var(--secondary-color-200)";
      case "btn-delete":
        return "var(--delete-btn-bg)";
      case "btn-gray":
        return "var(--bg1)";
      default:
        return "var(--primary-color-700)";
    }
  };

  const backgroundColor = getBackgroundColor(type, disabled);

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        minWidth: '80px',
        overflow: 'hidden',
        color: textColor,
        backgroundColor: backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "10px",
        ...style
      }}
      className="customSmallButton"
      {...prop}
    >
      {name}
    </Button>
  );
}

export function CustomCardButton(prop) {
  const { onClick, disabled, name, active } = prop;
  const backgroundColor =
    name === "Verified" || name === "View" ? "var(--card-1-bg)"
      : ["Selected", "Select"].some((value) => name.includes(value)) ? "var(--netural-color-900)"
        : active ? "var(--netural-color-900)" : "var(--card-1-bg)";
  const textColor =
    name === "Verified" || name === "View" ? "var(--primary-color-700)"
      : ["Selected", "Select"].some((value) => name.includes(value)) ? "var(--placeholder-bg)"
        : active ? "var(--card-1-bg)" : "#000";

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "8px",
        fontSize: "15px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}

export function CustomAddPlayerButton(prop) {
  const { onClick, disabled, name } = prop;

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        color: "var(--primary-color-700)",
        backgroundColor: "var(--fill-lightyellow-color)",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "8px",
        fontSize: "15px",
      }}
      className="customSmallButton"
    >
      {name}
    </Button>
  );
}