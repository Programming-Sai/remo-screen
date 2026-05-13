import type { CSSProperties } from "react";

import styles from "./Skeleton.module.css";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className}`.trim()} style={style} />;
}
