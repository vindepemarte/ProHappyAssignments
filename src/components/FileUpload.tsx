import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { FieldError } from 'react-hook-form';
import { Upload, X, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import {
  formatFileSize,
  isValidFileType,
  isValidFileSize,
  truncateFilename,
  getErrorMessage,
  hasError,
} from '../utils/formHelpers';

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  label: string;
  name: string;
  files: File[];
  onChange: (files: File[]) => void;
  error?: FieldError;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeInMB?: number;
  className?: string;
  description?: string;
  showProgress?: boolean;
  onUploadProgress?: (file: File, progress: number) => void;
  enableCamera?: boolean;
  mobileOptimized?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  files,
  onChange,
  error,
  required = false,
  multiple = true,
  maxFiles = 5,
  maxSizeInMB = 10,
  className = '',
  description,
  showProgress = false,
  onUploadProgress,
  enableCamera = true,
  mobileOptimized = true,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateFiles = useCallback((fileList: File[]): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileList.forEach((file) => {
      if (!isValidFileType(file)) {
        errors.push(`${file.name}: Invalid file type. Only PDF, Word, text, and image files are allowed.`);
        return;
      }

      if (!isValidFileSize(file, maxSizeInMB)) {
        errors.push(`${file.name}: File size exceeds ${maxSizeInMB}MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, errors };
  }, [maxSizeInMB]);

  const simulateUploadProgress = useCallback((fileWithProgress: FileWithProgress) => {
    if (!showProgress) return;

    const updateProgress = (progress: number) => {
      setFilesWithProgress(prev => 
        prev.map(f => 
          f.file === fileWithProgress.file 
            ? { ...f, progress, status: progress === 100 ? 'completed' : 'uploading' }
            : f
        )
      );
      
      if (onUploadProgress) {
        onUploadProgress(fileWithProgress.file, progress);
      }
    };

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      updateProgress(Math.min(progress, 100));
    }, 200);
  }, [showProgress, onUploadProgress]);

  const handleFiles = useCallback((newFiles: File[]) => {
    const { validFiles, errors } = validateFiles(newFiles);
    setUploadErrors(errors);

    if (validFiles.length > 0) {
      const combinedFiles = multiple ? [...files, ...validFiles] : validFiles;
      const finalFiles = combinedFiles.slice(0, maxFiles);
      
      if (showProgress) {
        const newFilesWithProgress = validFiles.map(file => ({
          file,
          progress: 0,
          status: 'pending' as const,
        }));
        
        setFilesWithProgress(prev => {
          const existingFiles = multiple ? prev : [];
          const combined = [...existingFiles, ...newFilesWithProgress];
          return combined.slice(0, maxFiles);
        });

        // Start upload simulation for new files
        newFilesWithProgress.forEach(fileWithProgress => {
          setTimeout(() => simulateUploadProgress(fileWithProgress), 100);
        });
      }
      
      onChange(finalFiles);
    }
  }, [files, multiple, maxFiles, onChange, validateFiles, showProgress, simulateUploadProgress]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsDragOver(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      handleFiles(fileList);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const fileList = Array.from(e.target.files);
      handleFiles(fileList);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
    
    if (showProgress) {
      setFilesWithProgress(prev => prev.filter((_, i) => i !== index));
    }
  }, [files, onChange, showProgress]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || (isTouchDevice && window.innerWidth <= 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openCameraDialog = useCallback(() => {
    if (enableCamera && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, [enableCamera]);

  const getAcceptAttribute = useCallback(() => {
    // Always prioritize document files, images are secondary
    return ".pdf,.doc,.docx,.txt,.rtf,.odt,.pages,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.webp";
  }, []);

  const getCaptureAttribute = useCallback(() => {
    // Never auto-capture, always let user choose
    return undefined;
  }, []);

  const labelClasses = `block text-sm font-medium mb-1 ${
    hasError(error) ? 'text-red-700' : 'text-gray-700'
  }`;

  const dropzoneClasses = `
    relative border-2 border-dashed rounded-lg text-center transition-all duration-200 cursor-pointer
    ${mobileOptimized && isMobile ? 'p-4 min-h-[120px]' : 'p-6'}
    ${isDragOver ? 'border-[#1d0fdb] bg-purple-100 scale-105 shadow-lg' : ''}
    ${dragActive && !isDragOver ? 'border-[#1d0fdb] bg-purple-50' : ''}
    ${hasError(error) ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
    ${files.length > 0 && !dragActive ? 'bg-gray-50' : !dragActive ? 'bg-white' : ''}
    ${isMobile ? 'active:bg-gray-100 active:scale-95' : ''}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      <label className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}

      <div
        className={dropzoneClasses}
        onDragEnter={!isMobile ? handleDragEnter : undefined}
        onDragLeave={!isMobile ? handleDragLeave : undefined}
        onDragOver={!isMobile ? handleDragOver : undefined}
        onDrop={!isMobile ? handleDrop : undefined}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileDialog();
          }
        }}
        aria-label="File upload area"
      >
        <input
          ref={fileInputRef}
          id={name}
          name={name}
          type="file"
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
          accept={getAcceptAttribute()}
          capture={getCaptureAttribute()}
          aria-describedby={`${name}-description`}
        />

        {/* Hidden camera input for mobile */}
        {isMobile && enableCamera && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="sr-only"
          />
        )}

        <div className={`space-y-2 ${isMobile ? 'space-y-3' : ''}`}>
          <Upload className={`mx-auto transition-colors duration-200 ${
            isMobile ? 'h-10 w-10' : 'h-8 w-8'
          } ${isDragOver ? 'text-[#1d0fdb]' : 'text-gray-400'}`} />
          
          <div className={`text-gray-600 ${isMobile ? 'text-base' : 'text-sm'}`}>
            {isDragOver ? (
              <span className="font-medium text-[#1d0fdb]">
                Drop files here to upload
              </span>
            ) : isMobile ? (
              <span className="font-medium text-[#1d0fdb]">
                Tap to select files
              </span>
            ) : (
              <>
                <span className="font-medium text-[#1d0fdb] hover:text-[#2f3b65]">
                  Click to upload
                </span>{' '}
                or drag and drop
              </>
            )}
          </div>
          
          <p id={`${name}-description`} className={`text-gray-500 ${
            isMobile ? 'text-sm' : 'text-xs'
          }`}>
            PDF, Word, Excel, PowerPoint, text, or image files up to {maxSizeInMB}MB each
            {multiple && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && mobileOptimized && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openFileDialog}
            className="flex items-center justify-center px-4 py-3 bg-[#4ECDC4] text-white rounded-lg text-sm font-medium hover:bg-[#2E86AB] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:ring-offset-2 transition-colors duration-200"
          >
            <File className="h-4 w-4 mr-2" />
            Browse Files
          </button>
          
          {enableCamera && (
            <button
              type="button"
              onClick={openCameraDialog}
              className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:ring-offset-2 transition-colors duration-200"
            >
              <Upload className="h-4 w-4 mr-2" />
              Take Photo
            </button>
          )}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className={`font-medium text-gray-700 ${isMobile ? 'text-base' : 'text-sm'}`}>
            Selected files ({files.length}):
          </p>
          {files.map((file, index) => {
            const fileWithProgress = showProgress 
              ? filesWithProgress.find(f => f.file === file)
              : null;
            
            return (
              <div
                key={`${file.name}-${index}`}
                className={`bg-gray-50 rounded-lg border transition-all duration-200 ${
                  isMobile ? 'p-4' : 'p-3'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {fileWithProgress?.status === 'completed' ? (
                        <CheckCircle className={`text-green-500 ${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      ) : fileWithProgress?.status === 'uploading' ? (
                        <Loader2 className={`text-[#1d0fdb] animate-spin ${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      ) : fileWithProgress?.status === 'error' ? (
                        <AlertCircle className={`text-red-500 ${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      ) : (
                        <File className={`text-gray-500 ${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-gray-900 truncate ${
                        isMobile ? 'text-base' : 'text-sm'
                      }`}>
                        {truncateFilename(file.name, isMobile ? 25 : 30)}
                      </p>
                      <div className={`flex items-center space-x-2 text-gray-500 ${
                        isMobile ? 'text-sm' : 'text-xs'
                      }`}>
                        <span>{formatFileSize(file.size)}</span>
                        {fileWithProgress && (
                          <>
                            <span>•</span>
                            <span className={`font-medium ${
                              fileWithProgress.status === 'completed' ? 'text-green-600' :
                              fileWithProgress.status === 'uploading' ? 'text-[#1d0fdb]' :
                              fileWithProgress.status === 'error' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {fileWithProgress.status === 'completed' ? 'Uploaded' :
                               fileWithProgress.status === 'uploading' ? `${Math.round(fileWithProgress.progress)}%` :
                               fileWithProgress.status === 'error' ? 'Error' :
                               'Pending'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className={`text-red-500 hover:text-red-700 active:text-red-800 transition-colors duration-200 flex-shrink-0 ${
                      isMobile ? 'ml-4 p-2 -m-1' : 'ml-3 p-1'
                    }`}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className={isMobile ? 'h-5 w-5' : 'h-4 w-4'} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                {showProgress && fileWithProgress && fileWithProgress.status === 'uploading' && (
                  <div className="mt-3">
                    <div className={`w-full bg-gray-200 rounded-full ${isMobile ? 'h-3' : 'h-2'}`}>
                      <div
                        className={`bg-[#1d0fdb] rounded-full transition-all duration-300 ease-out ${
                          isMobile ? 'h-3' : 'h-2'
                        }`}
                        style={{ width: `${fileWithProgress.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {fileWithProgress?.status === 'error' && fileWithProgress.error && (
                  <div className={`mt-2 text-red-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    {fileWithProgress.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="mt-2 space-y-1">
          {uploadErrors.map((errorMsg, index) => (
            <div key={index} className="flex items-start space-x-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form Validation Error */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {getErrorMessage(error)}
        </p>
      )}
    </div>
  );
};

export default FileUpload;