import React, { useState } from 'react';
import { File, Folder, MoreVertical, Download, Trash2, Eye } from 'lucide-react';

const FileList = () => {
  const [files] = useState([
    { id: 1, name: 'Passport.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15', folder: 'Documents' },
    { id: 2, name: 'Resume.docx', type: 'doc', size: '156 KB', date: '2024-01-14', folder: 'Documents' },
    { id: 3, name: 'Profile_Photo.jpg', type: 'image', size: '892 KB', date: '2024-01-13', folder: 'Photos' },
    { id: 4, name: 'Certificate.pdf', type: 'pdf', size: '1.1 MB', date: '2024-01-12', folder: 'Certificates' }
  ]);

  const [folders] = useState([
    { id: 1, name: 'Documents', count: 8, color: 'blue' },
    { id: 2, name: 'Photos', count: 15, color: 'green' },
    { id: 3, name: 'Certificates', count: 4, color: 'purple' },
    { id: 4, name: 'Personal', count: 6, color: 'orange' }
  ]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File className="w-8 h-8 text-red-500" />;
      case 'doc':
        return <File className="w-8 h-8 text-blue-500" />;
      case 'image':
        return <File className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Folders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${folder.color}-100 rounded-lg flex items-center justify-center`}>
                  <Folder className={`w-6 h-6 text-${folder.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{folder.name}</h3>
                  <p className="text-sm text-gray-500">{folder.count} files</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Files</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Folder</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <span className="font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{file.folder}</td>
                  <td className="py-3 px-4 text-gray-600">{file.size}</td>
                  <td className="py-3 px-4 text-gray-600">{file.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;
