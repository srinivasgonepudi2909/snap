import { useState, useEffect } from "react";

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/documents`);
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  return { documents, loading };
}
