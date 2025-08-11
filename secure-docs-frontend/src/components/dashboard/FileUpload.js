import React from 'react';
import { Upload } from 'lucide-react';

const FileUpload = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-700 font-medium">Drag & drop files here, or click to select</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Choose Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
