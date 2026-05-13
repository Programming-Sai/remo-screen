// components/ui/Icon.tsx
interface IconProps {
  name: string;
  className?: string;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: boolean;
  grade?: -25 | 0 | 25;
  opticalSize?: 20 | 24 | 40 | 48;
}

export const Icon = ({
  name,
  className = "",
  weight = 400,
  fill = false,
  grade = 0,
  opticalSize = 24,
}: IconProps) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    }}
  >
    {name}
  </span>
);
