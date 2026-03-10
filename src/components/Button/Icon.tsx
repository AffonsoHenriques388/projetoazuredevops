import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  bgColor?: string;
  color?: string;
  padding?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
}
export function IconButton({
  onClick,
  children,
  padding = "medium",
  bgColor = "bg-gray",
  color = "text-black",
}: Props) {
  const paddingProps = {
    small: "p-1",
    medium: "p-2",
    large: "p-3",
  };

  return (
    <div
      className={`${paddingProps[padding]} ${bgColor} ${color} rounded-md hover:cursor-pointer hover:opacity-80`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
