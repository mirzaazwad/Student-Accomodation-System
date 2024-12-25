import { useState } from "react";

const ApartmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 flex flex-col gap-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="rent"
        placeholder="Rent"
        value={formData.rent}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default ApartmentForm;
