
import React from "react";

interface CSVPreviewProps {
  previewData: string[][];
}

export const CSVPreview = ({ previewData }: CSVPreviewProps) => {
  if (previewData.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border animate-fade-in overflow-x-auto">
      <h3 className="font-medium text-gray-900 mb-4">Data Preview</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {previewData[0].map((header, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewData.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
