'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Plus, Trash2, Image as ImageIcon, XCircle, Grid, List as ListIcon } from 'lucide-react';

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    category: 'Architecture',
    span_class: ''
  });

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, url: data.url });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ url: '', category: 'Architecture', span_class: '' });
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this image from the gallery?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

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
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"
                >
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
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="font-playfair text-3xl mb-8">Upload Imagery</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Coastal Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                >
                  <option>Architecture</option>
                  <option>Interiors</option>
                  <option>Nature</option>
                  <option>Moments</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Grid Span (Layout)</label>
                <select 
                  value={formData.span_class}
                  onChange={(e) => setFormData({...formData, span_class: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                >
                  <option value="">Normal Square</option>
                  <option value="md:col-span-2 md:row-span-2">Large Feature (2x2)</option>
                  <option value="md:col-span-2">Wide Horizontal (2x1)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Image Selection</label>
                <div className="relative group">
                   <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   />
                   <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center space-y-4 group-hover:border-coastal-seafoam transition-colors">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-500 italic">
                        {isUploading ? 'Preparing seaside capture...' : formData.url ? 'File Ready' : 'Drop coastal captures here'}
                      </p>
                   </div>
                </div>
                {formData.url && (
                  <div className="mt-4 aspect-video rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={!formData.url || isUploading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-100 disabled:text-slate-400"
              >
                Publish to Gallery
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
