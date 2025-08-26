// components/FileList.jsx
import React from 'react';
import { FileText, Eye, Download, Trash2 } from 'lucide-react';

const FileList = ({ files, folderName, onFileAction }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'zip': case 'rar': return '🗜️';
      case 'txt': return '📃';
      default: return '📄';
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <div className="text-white font-semibold mb-2 text-xl">No files in this folder</div>
        <div className="text-gray-400">Upload some files to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Files in {folderName} ({files.length})
        </h3>
        <div className="text-sm text-gray-400">
          Total size: {formatFileSize(files.reduce((sum, file) => sum + (file.file_size || 0), 0))}
        </div>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div key={file._id || index} className="group flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
            {/* File Icon */}
            <div className="text-3xl">
              {getFileIcon(file.name || file.original_name)}
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <div className="text-white font-medium truncate">
                  {file.name || file.original_name}
                </div>
                {file.status === 'completed' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{formatFileSize(file.file_size)}</span>
                <span>•</span>
                <span>{formatDate(file.created_at)}</span>
                {file.file_type && (
                  <>
                    <span>•</span>
                    <span className="uppercase">{file.file_type.replace('.', '')}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
              <button 
                onClick={() => onFileAction && onFileAction('view', file)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onFileAction && onFileAction('download', file)}
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onFileAction && onFileAction('delete', file)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;