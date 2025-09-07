
// Re-export from the ui implementation to avoid circular dependencies
import { useToast, toast } from "@/components/ui/use-toast";

export { useToast, toast };

// Default export for backwards compatibility
export default useToast;
