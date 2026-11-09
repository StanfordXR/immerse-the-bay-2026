import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "nav";
  id?: string;
  "aria-label"?: string;
}

export function Container({
  children,
  className,
  as: Tag = "div",
  ...attributes
}: ContainerProps) {
  return (
    <Tag {...attributes} className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
