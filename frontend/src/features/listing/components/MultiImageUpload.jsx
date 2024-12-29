import { useEffect, useState } from "react";

const MultiImageUpload = ({ files = [], onFilesChange }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    setPreviews([]);
    if (files.length > 0) {
      const filePreviews = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePreviews).then((previewUrls) => setPreviews(previewUrls));
    } else {
      setPreviews([]); // Reset previews when no files are passed
    }
  }, [files]);

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files || []);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-md mx-auto bg-white shadow-md rounded-lg">
      <label
        htmlFor="multi-image-input"
        className="cursor-pointer text-center text-gray-600 font-medium py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:text-gray-800"
      >
        Upload Images
        <input
          id="multi-image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 w-full">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
