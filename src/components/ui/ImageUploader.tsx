'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { X, Upload, Move } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  defaultImages?: File[];
  minImages?: number;
  maxImages?: number;
  maxSizeMB?: number;
  onImagesChange: (files: File[]) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

const ImageUploader = ({
  defaultImages,
  minImages = 4,
  maxImages = 10,
  maxSizeMB = 5,
  onImagesChange,
  isInvalid,
  errorMessage,
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [errorImages, setErrorImages] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [parent, images, _setValues] = useDragAndDrop<HTMLDivElement, File>([]);

  const addImages = useCallback(
    (files: File[]) => {
      setErrorImages(null);
      const validFiles = files.filter((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setErrorImages(`El tamaño máximo por imagen es ${maxSizeMB}MB`);
          return false;
        }
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          setErrorImages('Solo se permiten archivos .jpg, .jpeg y .png');
          return false;
        }
        return true;
      });

      _setValues((prevImages) => {
        const newImages = [...prevImages, ...validFiles].slice(0, maxImages);
        if (newImages.length > maxImages) {
          setErrorImages(
            `Has alcanzado el límite máximo de ${maxImages} imágenes`,
          );
        }
        if (newImages.length < minImages) {
          setErrorImages(`El mínimo de imágenes es de ${minImages}.`);
        }
        return newImages;
      });
    },
    [_setValues, maxImages, maxSizeMB, minImages],
  );

  const removeImage = useCallback(
    (index: number) => {
      _setValues((prevImages) => {
        const newImages = prevImages.filter((_, i) => i !== index);
        if (newImages.length < minImages) {
          setErrorImages(`El mínimo de imágenes es de ${minImages}.`);
        } else {
          setErrorImages(null);
        }
        return newImages;
      });
      setErrorImages(null);
    },
    [_setValues, minImages],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      addImages(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [addImages],
  );

  useEffect(() => {
    if (images.length) {
      onImagesChange(images);
    }
  }, [images, onImagesChange]);

  useEffect(() => {
    if (defaultImages?.length) {
      _setValues(defaultImages);
    } else {
      _setValues([]);
    }
  }, [_setValues, defaultImages]);

  useEffect(() => {
    if (isInvalid) {
      setErrorImages(errorMessage || '');
    } else {
      setErrorImages(null);
    }
  }, [errorMessage, setErrorImages, isInvalid]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        addImages(files);
      }
    },
    [addImages],
  );

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6">
        Subí {minImages > 1 ? ' tus imágenes' : ' tu imágen'}
      </h2>
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
          isDragging ? 'border-black bg-gray-200' : 'border-gray-300'
        } transition-colors duration-200 ${isInvalid ? 'border-red-500' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          <Upload className="w-5 h-5 mr-2" />
          Seleccionar {minImages > 1 ? ' imágenes' : ' imágen'}
        </label>
        <p className="mt-2 text-sm text-gray-600">
          o arrastra y suelta {minImages > 1 ? ' tus imágenes ' : 'tu imágen '}
          aquí
        </p>
      </div>

      <div className="text-center mb-4 w-full flex justify-center items-center">
        <div className="flex flex-col w-fit items-center px-3 py-1 rounded-xl text-sm font-medium bg-gray-200 text-gray-800">
          <span className="mr-1">ℹ️</span>
          <span>Formatos aceptados: .jpg, .jpeg, .png, .webp</span>
          <span>Tamaño máximo: 5Mb</span>
        </div>
      </div>

      {errorImages && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{errorImages}</span>
        </div>
      )}

      <div
        ref={parent}
        className={`${minImages > 1 ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : 'flex'} cursor-grab`}
      >
        {images.map((file, index) => (
          <div
            key={file.name}
            data-label={file.name}
            className={`relative group`}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md"
              width={180}
              height={160}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black rounded-lg bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Move className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
