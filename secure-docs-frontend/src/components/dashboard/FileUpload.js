import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, FileText } from 'lucide-react';

const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log('Files uploaded:', acceptedFiles);
    // Handle file upload logic here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/*': ['.txt']
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-red-600" />
          </div>
          
          {isDragActive ? (
            <p className="text-red-600 font-medium">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Drag & drop files here, or click to select</p>
              <p className="text-gray-500 text-sm">Support for images, PDFs, documents and more</p>
            </div>
          )}
          
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Choose Files
          </button>
        </div>
      </div>

      {/* File Type Icons */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2 text-gray-500">
          <Image className="w-5 h-5" />
          <span className="text-sm">Images</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <FileText className="w-5 h-5" />
          <span className="text-sm">Documents</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <File className="w-5 h-5" />
          <span className="text-sm">PDFs</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
