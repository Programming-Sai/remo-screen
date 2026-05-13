"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";

import styles from "./NotFoundState.module.css";

type ActionVariant = "primary" | "secondary";

interface Action {
  label: string;
  href: string;
  icon?: string;
  variant?: ActionVariant;
}

interface NotFoundStateProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  primaryAction: Action;
  secondaryAction?: Action;
  bullets?: string[];
  className?: string;
}

export default function NotFoundState({
  eyebrow,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  bullets = [],
  className = "",
}: NotFoundStateProps) {
  return (
    <section className={`${styles.state} ${className}`.trim()}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{eyebrow}</span>

          <div className={styles.iconWrap} aria-hidden="true">
            <Icon name={icon} size={32} fill />
          </div>
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        {bullets.length > 0 && (
          <ul className={styles.bulletList}>
            {bullets.map((bullet) => (
              <li key={bullet} className={styles.bulletItem}>
                <Icon name="check_circle" size={18} fill className={styles.bulletIcon} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <Link
            className={`${styles.actionButton} ${
              primaryAction.variant === "secondary"
                ? styles.secondaryAction
                : styles.primaryAction
            }`}
            href={primaryAction.href}
          >
            {primaryAction.icon && (
              <Icon name={primaryAction.icon} size={18} />
            )}
            <span>{primaryAction.label}</span>
          </Link>

          {secondaryAction && (
            <Link
              className={`${styles.actionButton} ${
                secondaryAction.variant === "primary"
                  ? styles.primaryAction
                  : styles.secondaryAction
              }`}
              href={secondaryAction.href}
            >
              {secondaryAction.icon && (
                <Icon name={secondaryAction.icon} size={18} />
              )}
              <span>{secondaryAction.label}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
