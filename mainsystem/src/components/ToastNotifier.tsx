"use client";

import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export function useNotifier(module: string) {
  const { toast } = useToast();

  // Helper to safely stringify JSX for title/description
  const jsxToString = (jsx: ReactNode) =>
    typeof jsx === "string" ? jsx : "";

  return {
    // ✅ General notifications
    success: (msg: string) =>
      toast({
        title: "✅ Success",
        description: msg,
        className: "border-green-600 bg-green-50",
      }),

    error: (msg: string) =>
      toast({
        title: "❌ Error",
        description: msg,
        variant: "destructive",
        className: "border-red-600 bg-red-50",
      }),

    // ✅ Action-specific notifications
    added: () =>
      toast({
        title: "✅ Added Successfully",
        description: `${module} added successfully!`,
        className: "border-green-600 bg-green-50",
      }),

    updated: () =>
      toast({
        title: "✅ Updated Successfully",
        description: `${module} has been updated successfully.`,
        variant: "default",
      }),

    deleted: () =>
      toast({
        title: "🗑️ Deleted",
        description: `${module} deleted successfully!`,
        className: "border-[#5C4033] bg-[#f9eacb]",
      }),

    bulkUploaded: () =>
      toast({
        title: "📂 Bulk Upload Complete",
        description: `${module}s have been uploaded successfully.`,
        variant: "default",
      }),

    exported: () =>
      toast({
        title: "📤 Export Complete",
        description: `${module}s have been exported successfully.`,
        variant: "default",
      }),
  };
}
