
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { User } from "@supabase/supabase-js";

interface FileHandlingHook {
  isDragging: boolean;
  file: File | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, processFile: (file: File) => Promise<void>) => Promise<void>;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>, processFile: (file: File) => Promise<void>) => Promise<void>;
}

export const useFileHandling = (user: User | null): FileHandlingHook => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, processFile: (file: File) => Promise<void>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(droppedFile);
    await processFile(droppedFile);
  }, [user, toast]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, processFile: (file: File) => Promise<void>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    await processFile(selectedFile);
  }, [user, toast]);

  return {
    isDragging,
    file,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput
  };
};
