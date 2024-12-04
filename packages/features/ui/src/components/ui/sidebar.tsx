import * as React from "react";
import { cn } from "../../lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  toggled?: boolean;
  onBackdropClick?: () => void;
  position?: "left" | "right";
  width?: string;
  collapsedWidth?: string;
  breakPoint?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      children,
      collapsed = false,
      toggled = false,
      onBackdropClick,
      position = "left",
      width = "240px",
      collapsedWidth = "80px",
      breakPoint = "lg",
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
    const [isToggled, setIsToggled] = React.useState(toggled);

    React.useEffect(() => {
      setIsCollapsed(collapsed);
    }, [collapsed]);

    React.useEffect(() => {
      setIsToggled(toggled);
    }, [toggled]);

    return (
      <>
        {isToggled && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => {
              onBackdropClick?.();
              setIsToggled(false);
            }}
          />
        )}
        <aside
          ref={ref}
          className={cn(
            "fixed top-0 bottom-0 z-50 flex flex-col bg-background transition-all duration-300",
            position === "left" ? "left-0" : "right-0",
            isCollapsed ? `w-[${collapsedWidth}]` : `w-[${width}]`,
            `${breakPoint}:relative ${breakPoint}:z-0`,
            !isToggled && `max-${breakPoint}:hidden`,
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b px-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto p-4", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-t px-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter };
