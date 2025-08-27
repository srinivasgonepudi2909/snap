// src/utils/storageUtils.js - UNIFIED STORAGE CALCULATIONS
export class StorageCalculator {
  constructor(documents = [], totalStorageGB = 15) {
    this.documents = documents;
    this.totalStorageBytes = totalStorageGB * 1024 * 1024 * 1024; // Convert GB to bytes
    this.calculate();
  }

  calculate() {
    // Calculate real total used storage from all documents
    this.usedStorageBytes = this.documents.reduce((sum, doc) => {
      const fileSize = doc.file_size || 0;
      return sum + fileSize;
    }, 0);

    // Convert to different units
    this.usedStorageKB = this.usedStorageBytes / 1024;
    this.usedStorageMB = this.usedStorageBytes / (1024 * 1024);
    this.usedStorageGB = this.usedStorageBytes / (1024 * 1024 * 1024);

    // Calculate percentages
    this.usagePercentage = this.totalStorageBytes > 0 
      ? Math.min((this.usedStorageBytes / this.totalStorageBytes) * 100, 100) 
      : 0;

    // Calculate remaining storage
    this.remainingStorageBytes = Math.max(this.totalStorageBytes - this.usedStorageBytes, 0);
    this.remainingStorageGB = this.remainingStorageBytes / (1024 * 1024 * 1024);
    this.remainingPercentage = Math.max(100 - this.usagePercentage, 0);

    // Calculate average file size
    this.averageFileSize = this.documents.length > 0 
      ? this.usedStorageBytes / this.documents.length 
      : 0;

    return this;
  }

  // Format bytes to human readable format
  formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  // Get storage status color based on usage percentage
  getStatusColor() {
    if (this.usagePercentage >= 90) return {
      gradient: 'from-red-500/20 via-red-600/15 to-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      progress: 'from-red-500 to-red-600'
    };
    if (this.usagePercentage >= 75) return {
      gradient: 'from-orange-500/20 via-orange-600/15 to-yellow-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      progress: 'from-orange-500 to-orange-600'
    };
    if (this.usagePercentage >= 50) return {
      gradient: 'from-yellow-500/20 via-yellow-600/15 to-orange-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      progress: 'from-yellow-500 to-yellow-600'
    };
    return {
      gradient: 'from-blue-500/20 via-blue-600/15 to-cyan-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      progress: 'from-blue-500 to-purple-600'
    };
  }

  // Get storage status text
  getStatusText() {
    if (this.usagePercentage >= 95) return 'Storage Almost Full!';
    if (this.usagePercentage >= 90) return 'Storage Running Low';
    if (this.usagePercentage >= 75) return 'Storage Getting Full';
    return `${this.remainingPercentage.toFixed(1)}% Available`;
  }

  // Get warning level
  getWarningLevel() {
    if (this.usagePercentage >= 95) return 'critical';
    if (this.usagePercentage >= 90) return 'high';
    if (this.usagePercentage >= 85) return 'medium';
    return 'low';
  }

  // Calculate recent uploads (last 7 days)
  calculateRecentUploads() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return this.documents.filter(doc => {
      if (!doc.created_at) return false;
      const docDate = new Date(doc.created_at);
      return docDate >= sevenDaysAgo;
    });
  }

  // Get comprehensive storage stats object
  getStorageStats() {
    const recentUploads = this.calculateRecentUploads();
    const colors = this.getStatusColor();
    
    return {
      // Raw values
      usedBytes: this.usedStorageBytes,
      totalBytes: this.totalStorageBytes,
      remainingBytes: this.remainingStorageBytes,
      
      // Formatted values
      usedFormatted: this.formatBytes(this.usedStorageBytes),
      totalFormatted: this.formatBytes(this.totalStorageBytes),
      remainingFormatted: this.formatBytes(this.remainingStorageBytes),
      averageFileSizeFormatted: this.formatBytes(this.averageFileSize),
      
      // Percentages
      usagePercentage: this.usagePercentage,
      remainingPercentage: this.remainingPercentage,
      
      // File counts
      totalFiles: this.documents.length,
      recentUploadsCount: recentUploads.length,
      
      // Status
      statusText: this.getStatusText(),
      warningLevel: this.getWarningLevel(),
      
      // Colors
      colors: colors,
      
      // Additional data
      recentUploads: recentUploads,
      averageFileSize: this.averageFileSize
    };
  }

  // Static method to create calculator from documents
  static from(documents, totalStorageGB = 15) {
    return new StorageCalculator(documents, totalStorageGB);
  }
}

// Utility functions for backward compatibility
export const calculateStorageStats = (documents = [], totalStorageGB = 15) => {
  return StorageCalculator.from(documents, totalStorageGB).getStorageStats();
};

export const formatFileSize = (bytes, decimals = 1) => {
  return new StorageCalculator().formatBytes(bytes, decimals);
};

// Real-time storage hook for React components
import { useMemo } from 'react';

export const useStorageCalculator = (documents = [], totalStorageGB = 15) => {
  const storageStats = useMemo(() => {
    console.log('🔄 Recalculating storage stats for', documents.length, 'documents');
    return calculateStorageStats(documents, totalStorageGB);
  }, [documents, totalStorageGB]);

  return storageStats;
};