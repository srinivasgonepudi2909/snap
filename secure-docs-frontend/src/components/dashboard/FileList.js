import React from 'react';
import { Folder } from 'lucide-react';

const FileList = () => {
  const folders = [
    { id: 1, name: 'Documents', count: 8 },
    { id: 2, name: 'Photos', count: 15 },
    { id: 3, name: 'Certificates', count: 4 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">{folder.name}</h3>
                <p className="text-sm text-gray-500">{folder.count} files</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
