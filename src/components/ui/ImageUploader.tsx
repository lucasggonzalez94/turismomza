'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { X, Upload, Move } from 'lucide-react';

interface ImageUploaderProps {
  maxImages?: number;
  maxSizeMB?: number;
  onImagesChange?: (files: File[]) => void;
}

const ImageUploader = ({
  maxImages = 10,
  maxSizeMB = 5,
  onImagesChange,
}: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

      setImages((prevImages) => {
        const newImages = [...prevImages, ...validFiles].slice(0, maxImages);
        if (newImages.length === maxImages) {
          setError(`Has alcanzado el límite máximo de ${maxImages} imágenes`);
        }
        return newImages;
      });
    },
    [maxImages, maxSizeMB],
  );

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newImages = Array.from(images);
      const [reorderedItem] = newImages.splice(result.source.index, 1);
      newImages.splice(result.destination.index, 0, reorderedItem);

      setImages(newImages);
    },
    [images],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      addImages(files);
    },
    [addImages],
  );

  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(images);
    }
  }, [images, onImagesChange]);

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Subida de imágenes
      </h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {images.map((file, index) => (
                <Draggable
                  key={`${file.name}-${index}`}
                  draggableId={`${file.name}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group ${snapshot.isDragging ? 'z-10' : ''}`}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Move className="w-6 h-6 text-white" />
                      </div> */}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
