'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { X, Upload, Move } from 'lucide-react';

interface ImageUploaderProps {
  defaultImages?: File[];
  minImages?: number;
  maxImages?: number;
  maxSizeMB?: number;
  onImagesChange?: (files: File[]) => void;
}

const ImageUploader = ({
  defaultImages,
  minImages = 4,
  maxImages = 10,
  maxSizeMB = 5,
  onImagesChange,
}: ImageUploaderProps) => {
  const [error, setError] = useState<string | null>(null);

  const [parent, images, _setValues] = useDragAndDrop<HTMLDivElement, File>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      addImages(files);
    },
    [],
  );

  const addImages = useCallback(
    (files: File[]) => {
      setError(null);
      const validFiles = files.filter((file) => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          setError('Solo se permiten archivos .jpg, .jpeg y .png');
          return false;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`El tamaño máximo por imagen es ${maxSizeMB}MB`);
          return false;
        }
        return true;
      });

      _setValues((prevImages) => {
        const newImages = [...prevImages, ...validFiles].slice(0, maxImages);
        if (newImages.length === maxImages) {
          setError(`Has alcanzado el límite máximo de ${maxImages} imágenes`);
        }
        if (newImages.length < minImages) {
          setError(`El mínimo de imágenes es de ${minImages}.`);
        }
        return newImages;
      });
    },
    [maxImages, maxSizeMB],
  );

  const removeImage = useCallback((index: number) => {
    _setValues((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      if (newImages.length < minImages) {
        setError(`El mínimo de imágenes es de ${minImages}.`);
      } else {
        setError(null);
      }
      return newImages;
    });
    setError(null);
  }, []);

  useEffect(() => {
    if (images.length && onImagesChange) {
      onImagesChange(images);
    }
  }, [images, onImagesChange]);

  useEffect(() => {
    if (defaultImages?.length) {
      _setValues(defaultImages);
    }
  }, [defaultImages]);

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Subida de imágenes
      </h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 'border-gray-300`}
      >
        <input
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
          Seleccionar imágenes
        </label>
        <p className="mt-2 text-sm text-gray-600">
          o arrastra y suelta tus imágenes aquí
        </p>
      </div>

      <div className="text-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
          <span className="mr-1">ℹ️</span> Formatos aceptados: .jpg, .jpeg, .png
        </span>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div
        ref={parent}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 cursor-grab"
      >
        {images.map((file, index) => (
          <div
            data-label={file.name}
            key={file.name}
            className={`relative group`}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md"
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