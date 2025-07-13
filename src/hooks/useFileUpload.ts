import { useState, useCallback } from 'react';

interface UploadedFile {
  name: string;
  content: string;
  type: string;
  size: number;
}

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      if (
        file.type.includes('text') ||
        file.type.includes('pdf') ||
        file.name.endsWith('.md')
      ) {
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setIsProcessing(true);
    const fileArray = Array.from(files);
    const processedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      try {
        const content = await readFileContent(file);
        processedFiles.push({
          name: file.name,
          content,
          type: file.type,
          size: file.size,
        });
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
      }
    }

    setUploadedFiles((prev) => [...prev, ...processedFiles]);
    setIsProcessing(false);

    return processedFiles;
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const getFilesSummary = useCallback(() => {
    if (uploadedFiles.length === 0) return '';

    const summary = uploadedFiles
      .map((file) => {
        const preview = file.content.slice(0, 200);
        return `[Document: ${file.name}]\n${preview}${file.content.length > 200 ? '...' : ''}`;
      })
      .join('\n\n');

    return `\n\n--- Attached Documents ---\n${summary}\n--- End of Documents ---`;
  }, [uploadedFiles]);

  return {
    uploadedFiles,
    isProcessing,
    processFiles,
    removeFile,
    clearFiles,
    getFilesSummary,
  };
}
