import { useState, useCallback } from 'react';

const useFilePreview = () => {
  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileList, setFileList] = useState([]);

  // Open preview with file and optional file list
  const openPreview = useCallback((file, files = []) => {
    setIsPreviewOpen(true);
    setCurrentFile(file);
    setFileList(files);
    
    // Find index of current file in list
    const index = files.findIndex(f => f._id === file._id);
    setCurrentIndex(index >= 0 ? index : 0);
  }, []);

  // Close preview and reset state
  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setCurrentFile(null);
    setCurrentIndex(0);
    setFileList([]);
  }, []);

  // Navigate through files (direction: 1 for next, -1 for previous)
  const navigatePreview = useCallback((direction) => {
    if (!fileList.length) return;

    const newIndex = (currentIndex + direction + fileList.length) % fileList.length;
    setCurrentIndex(newIndex);
    setCurrentFile(fileList[newIndex]);
  }, [currentIndex, fileList]);

  return {
    // State
    isPreviewOpen,
    currentFile,
    currentIndex,
    fileList,
    
    // Navigation info
    hasNext: fileList.length > 0 && currentIndex < fileList.length - 1,
    hasPrevious: fileList.length > 0 && currentIndex > 0,
    totalFiles: fileList.length,
    
    // Functions
    openPreview,
    closePreview,
    navigatePreview,
  };
};

export default useFilePreview;