"use client";
import React, { useState } from 'react';
import axios from 'axios';
// --- Component Definition ---
const App = () => {
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  // This is a placeholder function for you to add your item handling logic.
  const handleAddCategory = async () => {
    
    if (newCategoryId.trim() === '' || newCategoryName.trim() === '' || newCategoryIcon.trim() === '') {
      console.error('Category ID, name, and icon cannot be empty.');
      return;
    }

     

    console.log("New category to be added:", {
      id: newCategoryId,
      name: newCategoryName,
      icon: newCategoryIcon,
    });
    try {
      const response = await axios.post("/api/addCategories", {
        id: newCategoryId,
        name: newCategoryName,
        icon: newCategoryIcon,
      });

      console.log('Category added successfully:', response.data);
      alert('Category added successfully.');
      // Clear the input fields after successful submission
      setNewCategoryId('');
      setNewCategoryName('');
      setNewCategoryIcon('');

    } catch (error) {
       
        console.error('Failed to add category:', error.response?.data || error.message);
        alert('Failed to add category. Please try again.');
      }
    }

   
   
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Add New Category</h1>

        {/* Add new category form */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <input
              type="text"
              className="flex-1 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category ID"
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="text"
              className="flex-1 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Icon (e.g., Utensils, ChefHat)"
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out shadow-sm"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
