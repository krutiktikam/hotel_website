'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, XCircle, Grid, List as ListIcon } from 'lucide-react';

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/gallery');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-slate-900 mb-2">Gallery</h1>
          <p className="text-slate-500 font-light">Visual storytelling through curated seaside imagery.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" /> Upload Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 text-slate-400">Loading gallery images...</p>
        ) : images.map((img) => (
          <div key={img.id} className="aspect-square relative rounded-3xl overflow-hidden group border border-slate-100 shadow-sm bg-white">
            <img src={img.url} alt={img.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{img.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="font-playfair text-3xl mb-8">Upload Imagery</h2>
            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-500 italic">Drag and drop coastal captures here</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
