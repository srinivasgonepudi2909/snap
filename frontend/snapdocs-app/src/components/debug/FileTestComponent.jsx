// components/debug/FileTestComponent.jsx - FOR TESTING FILE SERVING
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const FileTestComponent = ({ file }) => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testUrls = [
    {
      name: 'Direct File URL (Static)',
      url: `${process.env.REACT_APP_DOCUMENT_API}/files/${file.unique_name}`,
      description: 'Direct static file serving'
    },
    {
      name: 'API Stream URL',
      url: `${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${file._id}/stream`,
      description: 'API streaming endpoint'
    },
    {
      name: 'API Download URL',
      url: `${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${file._id}/download`,
      description: 'API download endpoint'
    }
  ];

  const testUrl = async (urlInfo) => {
    try {
      console.log(`🔍 Testing URL: ${urlInfo.url}`);
      
      const response = await fetch(urlInfo.url, {
        method: 'HEAD', // Use HEAD to avoid downloading the full file
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(`📊 Response status: ${response.status}`);
      console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));

      return {
        success: response.ok,
        status: response.status,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
        error: response.ok ? null : `HTTP ${response.status}`
      };
    } catch (error) {
      console.error(`❌ Error testing ${urlInfo.url}:`, error);
      return {
        success: false,
        status: 0,
        error: error.message
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    const results = {};

    for (const urlInfo of testUrls) {
      const result = await testUrl(urlInfo);
      results[urlInfo.name] = result;
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, [file]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">File Access Test</h3>
        <button 
          onClick={runTests}
          disabled={testing}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Retest'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-400 mb-3">
          <p><strong>File:</strong> {file.name || file.original_name}</p>
          <p><strong>Unique Name:</strong> {file.unique_name}</p>
          <p><strong>File Path:</strong> {file.file_path}</p>
          <p><strong>Size:</strong> {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</p>
        </div>

        {testUrls.map((urlInfo) => {
          const result = testResults[urlInfo.name];
          return (
            <div key={urlInfo.name} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {result ? (
                    result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                  )}
                  <span className="text-white font-medium">{urlInfo.name}</span>
                </div>
                <a 
                  href={urlInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>