"use client";
import React, { useState } from 'react';

const App = ({customers}) => {
   
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Customer List</h1>

        {/* Customer List Table */}
        <div>
          {customers.length === 0 ? (
            <p className="text-slate-500 text-center">No customers found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {customers.map(customer => (
                    <tr key={customer._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{customer.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{customer.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{customer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
