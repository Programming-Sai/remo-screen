"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon/Icon";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({
  id,
  type,
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 200);
  };

  const handleAction = () => {
    console.log("Toast action clicked", { actionLabel, onAction });
    if (onAction) {
      onAction();
    }
    // Optionally close the toast after action
    handleClose();
  };

  const iconMap = {
    success: "check_circle",
    error: "error",
    info: "notifications",
  };

  const accentColorMap = {
    success: "var(--success-border, #378664)",
    error: "var(--error)",
    info: "var(--secondary)",
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.enter : styles.exit}`}
      style={{ borderLeftColor: accentColorMap[type] }}
    >
      <div className={styles.iconWrapper}>
        <Icon name={iconMap[type]} size={20} fill={type === "success"} />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {message && <p className={styles.message}>{message}</p>}
        {actionLabel && onAction && (
          <button className={styles.actionButton} onClick={handleAction}>
            {actionLabel}
          </button>
        )}
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}
