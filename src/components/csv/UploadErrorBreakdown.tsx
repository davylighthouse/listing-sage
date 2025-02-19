
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadStatus } from "@/types/listing";

interface UploadErrorBreakdownProps {
  status: UploadStatus | null;
}

export const UploadErrorBreakdown = ({ status }: UploadErrorBreakdownProps) => {
  if (!status) return null;

  const { total, processed, succeeded, failed, errors } = status;

  if (failed === 0 && errors.length === 0) return null;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle className="mb-2">Upload Issues Detected</AlertTitle>
      <AlertDescription>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>Total Records: {total}</div>
            <div>Processed: {processed}</div>
            <div>Succeeded: {succeeded}</div>
            <div>Failed: {failed}</div>
          </div>
          
          {errors.length > 0 && (
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm">
                    {error.row && <span className="font-medium">Row {error.row}: </span>}
                    {error.itemId && <span className="font-medium">{error.itemId} - </span>}
                    {error.field && <span className="italic">{error.field}: </span>}
                    <span>{error.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
