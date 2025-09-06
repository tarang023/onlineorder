"use client";
import React, { useState } from 'react';
import axios from 'axios';
export default function SupportPage({faqs}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [formMessage, setFormMessage] = useState('');

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        if (!name || !email || !message) {
            setFormMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }
       
        const response=await axios.post('/api/admin/add-help-message',{name,email,message})
        
        if(response.status==200){
            setFormMessage({ type: 'success', text: 'Your message has been sent! We will get back to you shortly.' });
        }else{
            setFormMessage({ type: 'error', text: 'There was an error sending your message. Please try again later.' });
        }

        // Clear the form
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <>
            {/* The <Head> component and its import have been removed to resolve the error. */}
            <main 
                className="bg-gray-50 dark:bg-gray-900"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                            How can we help?
                        </h1>
                        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                            Find answers to your questions or get in touch with our team.
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
                        
                        {/* Search Bar */}
                        <div className="mb-8">
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-6">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <details key={index} className="group border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 dark:text-gray-200">
                                            <span>{faq.question}</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-500 dark:text-gray-400 mt-3 group-open:animate-fadeIn">
                                            {faq.answer}
                                        </p>
                                    </details>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400">No matching questions found.</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Us Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mt-12">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Still need help?</h2>
                         <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Send us a message and we'll get back to you as soon as possible.</p>

                        <form onSubmit={handleContactSubmit} className="space-y-6 max-w-lg mx-auto">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                <textarea id="message" rows="4" value={message} onChange={e => setMessage(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Send Message
                                </button>
                            </div>
                            {formMessage && (
                                <p className={`text-center text-sm ${formMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                    {formMessage.text}
                                </p>
                            )}
                        </form>
                    </div>

                </div>
            </main>
        </>
    );
}

