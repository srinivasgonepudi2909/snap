// components/FileList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import useFilePreview from '../../hooks/useFilePreview';
import FilePreviewModal from './FilePreviewModal';

const FileList = ({ 
  files,
  onFileAction,
  formatFileSize,
  formatDate,
  getFileIcon 
}) => {
  // Initialize preview hook
  const {
    isPreviewOpen,
    currentFile,
    currentIndex,
    fileList,
    openPreview,
    closePreview,
    navigatePreview
  } = useFilePreview();

  return (
    <div className="space-y-4">
      {/* File list */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        {files.map((file, index) => (
          <div 
            key={file._id}
            className="flex items-center justify-between p-4 border-b border-white/10 last:border-b-0"
          >
            {/* File info section */}
            <div className="flex items-center flex-1 min-w-0 mr-4">
              <span className="text-2xl mr-3">{getFileIcon(file.name)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">
                  {file.name}
                </div>
                <div className="text-sm text-gray-400">
                  {formatFileSize(file.size)} • {formatDate(file.created_at)}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openPreview(file, files)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                         rounded-lg transition-colors"
                title="Preview file"
              >
                <Eye className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onFileAction('download', file)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                         rounded-lg transition-colors"
                title="Download file"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onFileAction('delete', file)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                         rounded-lg transition-colors"
                title="Delete file"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        file={currentFile}
        allFiles={files}
        currentIndex={currentIndex}
        onNavigate={navigatePreview}
      />
    </div>
  );
};

FileList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    created_at: PropTypes.string,
    url: PropTypes.string
  })).isRequired,
  onFileAction: PropTypes.func.isRequired,
  formatFileSize: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired
};

export default FileList;