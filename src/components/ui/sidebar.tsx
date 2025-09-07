
import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  SidebarProvider, 
  useSidebar,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON 
} from "./sidebar-context";
import { 
  Sidebar,
  SidebarContent,
  SidebarTrigger, 
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarInset,
  SidebarInput,
  SidebarRail,
} from "./sidebar-components";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel
} from "./sidebar-group";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  sidebarMenuButtonVariants
} from "./sidebar-menu";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./sidebar-menu-sub";

// Wrapped provider with TooltipProvider
const SidebarProviderWithTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SidebarProvider>
>(({ className, ...props }, ref) => {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        )}
        ref={ref}
        {...props}
      />
    </TooltipProvider>
  );
});
SidebarProviderWithTooltip.displayName = "SidebarProvider";

// Export all sidebar components
export {
  SidebarProviderWithTooltip as SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
};
