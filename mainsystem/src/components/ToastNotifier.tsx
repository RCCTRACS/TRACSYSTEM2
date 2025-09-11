"use client";

import { useToast } from "@/components/ui/use-toast";

export function useNotifier(module: string) {
  const { toast } = useToast();

  return {
    // ✅ General notifications
    success: (msg: string) =>
      toast({ title: "✅ Success", description: msg, variant: "default" }),

    error: (msg: string) =>
      toast({ title: "❌ Error", description: msg, variant: "destructive" }),

    // ✅ Action-specific notifications
    added: () =>
      toast({
        title: "✅ Added Successfully",
        description: `${module} has been added successfully.`,
        variant: "default",
      }),

    updated: () =>
      toast({
        title: "✅ Updated Successfully",
        description: `${module} has been updated successfully.`,
        variant: "default",
      }),

    deleted: () =>
      toast({
        title: "🗑️ Deleted Successfully",
        description: `${module} has been deleted successfully.`,
        variant: "default",
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
