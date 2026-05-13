// components/ui/Icon.tsx
interface IconProps {
  name: string;
  className?: string;
  size?: number | string; // <-- add size prop
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: boolean;
  grade?: -25 | 0 | 25;
  opticalSize?: number;
}

export const Icon = ({
  name,
  className = "",
  size = 24, // default 24px
  weight = 400,
  fill = false,
  grade = 0,
  opticalSize = 24,
}: IconProps) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontSize: typeof size === "number" ? `${size}px` : size, // set actual size
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    }}
  >
    {name}
  </span>
);
