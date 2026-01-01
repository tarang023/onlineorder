"use client";
import React, { useState } from 'react';
import axios from 'axios';

// --- Component Definition ---
const App = () => {
  const [menuItem, setMenuItem] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    dietary: '',
    spiceLevel: 0,
    prepTime: '',
    allergens: '',
    isAvailable: true,
    isPopular: false,
    discount: '',
    rating: '',
    reviewCount: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItem(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddMenuItem = async () => {
    const parsedItem = {
      ...menuItem,
      id: parseInt(menuItem.id, 10),
      price: parseFloat(menuItem.price),
      originalPrice: menuItem.originalPrice ? parseFloat(menuItem.originalPrice) : undefined,
      spiceLevel: parseInt(menuItem.spiceLevel, 10),
      prepTime: menuItem.prepTime ? parseInt(menuItem.prepTime, 10) : undefined,
      rating: menuItem.rating ? parseFloat(menuItem.rating) : undefined,
      reviewCount: parseInt(menuItem.reviewCount, 10),
      dietary: menuItem.dietary.split(',').map(item => item.trim()),
      allergens: menuItem.allergens.split(',').map(item => item.trim()),
    };

    console.log("New menu item to be added:", parsedItem);

    try {
      const apiEndpoint = '/api/addItem';
      const response = await axios.post(apiEndpoint, parsedItem);

      console.log('Menu item added successfully:', response.data);

      // Reset the form after successful submission
      setMenuItem({
        id: '',
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        category: '',
        dietary: '',
        spiceLevel: 0,
        prepTime: '',
        allergens: '',
        isAvailable: true,
        isPopular: false,
        discount: '',
        rating: '',
        reviewCount: 0,
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to add menu item:', error.response?.data || error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Add New Menu Item</h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-700">ID</span>
            <input
              type="number"
              name="id"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.id}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Name</span>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.name}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Description</span>
            <textarea
              name="description"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.description}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Price</span>
            <input
              type="number"
              name="price"
              step="0.01"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.price}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Original Price (optional)</span>
            <input
              type="number"
              name="originalPrice"
              step="0.01"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.originalPrice}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Image URL</span>
            <input
              type="text"
              name="image"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.image}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Category</span>
            <input
              type="text"
              name="category"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.category}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Dietary (comma-separated, e.g., Vegetarian, Gluten-Free)</span>
            <input
              type="text"
              name="dietary"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.dietary}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Spice Level (0-10)</span>
            <input
              type="number"
              name="spiceLevel"
              min="0"
              max="10"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.spiceLevel}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Preparation Time (minutes)</span>
            <input
              type="number"
              name="prepTime"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.prepTime}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Allergens (comma-separated)</span>
            <input
              type="text"
              name="allergens"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.allergens}
              onChange={handleChange}
            />
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAvailable"
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
              checked={menuItem.isAvailable}
              onChange={handleChange}
            />
            <span className="text-slate-700">Is Available</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPopular"
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
              checked={menuItem.isPopular}
              onChange={handleChange}
            />
            <span className="text-slate-700">Is Popular</span>
          </label>
          <label className="block">
            <span className="text-slate-700">Discount</span>
            <input
              type="text"
              name="discount"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.discount}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Rating</span>
            <input
              type="number"
              name="rating"
              step="0.1"
              min="0"
              max="5"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.rating}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Review Count</span>
            <input
              type="number"
              name="reviewCount"
              min="0"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={menuItem.reviewCount}
              onChange={handleChange}
            />
          </label>

          <button
            onClick={handleAddMenuItem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out shadow-sm mt-4"
          >
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
