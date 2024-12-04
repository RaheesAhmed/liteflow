import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const breadcrumbVariants = cva("flex items-center gap-1.5 text-sm", {
  variants: {
    variant: {
      default: "text-muted-foreground hover:text-foreground",
      ghost: "hover:text-foreground/80",
      link: "text-primary underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  isCollapsed?: boolean;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

interface BreadcrumbItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof breadcrumbVariants> {
  href?: string;
  isCurrent?: boolean;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      separator = <ChevronRight className="h-4 w-4" />,
      className,
      isCollapsed = true,
      maxItems = 8,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      children,
      ...props
    },
    ref
  ) => {
    const allItems = React.Children.toArray(children);
    const totalItems = allItems.length;

    const items = React.useMemo(() => {
      if (!isCollapsed || totalItems <= maxItems) {
        return allItems;
      }

      const collapsedItems = [
        ...allItems.slice(0, itemsBeforeCollapse),
        <BreadcrumbItem key="ellipsis" className="min-w-[24px]">
          <MoreHorizontal className="h-4 w-4" />
        </BreadcrumbItem>,
        ...allItems.slice(totalItems - itemsAfterCollapse),
      ];

      return collapsedItems;
    }, [
      allItems,
      isCollapsed,
      totalItems,
      maxItems,
      itemsBeforeCollapse,
      itemsAfterCollapse,
    ]);

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("relative", className)}
        {...props}
      >
        <ol className="flex items-center gap-1.5">
          {items.map((item, index) => {
            if (index === items.length - 1) {
              return item;
            }
            return (
              <li key={index} className="flex items-center gap-1.5">
                {item}
                <span className="text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, href, variant, isCurrent, children, ...props }, ref) => {
    const Comp = href ? "a" : "span";
    return (
      <li
        ref={ref}
        className={cn(breadcrumbVariants({ variant }), className)}
        aria-current={isCurrent ? "page" : undefined}
        {...props}
      >
        <Comp
          href={href}
          className={cn("transition-colors", href && "hover:text-foreground")}
        >
          {children}
        </Comp>
      </li>
    );
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export { Breadcrumbs, BreadcrumbItem };
