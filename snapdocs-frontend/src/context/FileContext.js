import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([
    { id: 1, name: 'Documents', color: 'blue' },
    { id: 2, name: 'Photos', color: 'green' },
    { id: 3, name: 'Certificates', color: 'purple' }
  ]);

  const uploadFile = (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const createFolder = (name, color = 'blue') => {
    const newFolder = {
      id: Date.now(),
      name,
      color,
      createdAt: new Date().toISOString()
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const value = {
    files,
    folders,
    uploadFile,
    deleteFile,
    createFolder
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
