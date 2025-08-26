// hooks/useDocuments.js
import { useState, useEffect } from 'react';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      console.log('🔄 Fetching documents...');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents`);
      const data = await response.json();
      
      console.log('📄 Documents response:', data);
      
      if (data.success) {
        setDocuments(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} documents`);
      } else {
        setError('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (err) {
      console.error('❌ Error fetching documents:', err);
      setError('Network error while fetching documents');
      setDocuments([]);
    }
  };

  const fetchFolders = async () => {
    try {
      console.log('🔄 Fetching folders...');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`);
      const data = await response.json();
      
      console.log('📁 Folders response:', data);
      
      if (data.success) {
        setFolders(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} folders`);
      } else {
        console.warn('⚠️ Folders fetch not successful:', data.message);
        setFolders([]);
      }
    } catch (err) {
      console.error('❌ Error fetching folders:', err);
      setError('Network error while fetching folders');
      setFolders([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchDocuments(), fetchFolders()]);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 Force refreshing data...');
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { 
    documents, 
    folders, 
    loading, 
    error, 
    refetch: fetchAll,
    forceRefresh
  };
};