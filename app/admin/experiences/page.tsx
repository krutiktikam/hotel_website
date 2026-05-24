'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL, getImageUrl } from '@/lib/api';
import { Plus, Edit2, Trash2, Clock, DollarSign, Compass, XCircle, Loader2 } from 'lucide-react';

export default function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wellness',
    description: '',
    price: 0,
    duration: '',
    image_url: '',
    icon_name: 'Sunrise'
  });

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/experiences`);
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(`${API_BASE_URL}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenModal = (exp: any = null) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({
        title: exp.title,
        category: exp.category,
        description: exp.description,
        price: exp.price,
        duration: exp.duration,
        image_url: exp.image_url,
        icon_name: exp.icon_name
      });
    } else {
      setEditingExp(null);
      setFormData({
        title: '',
        category: 'Wellness',
        description: '',
        price: 0,
        duration: '',
        image_url: '',
        icon_name: 'Sunrise'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const url = editingExp 
      ? `${API_BASE_URL}/admin/experiences/${editingExp.id}` 
      : `${API_BASE_URL}/admin/experiences`;
    
    try {
      const response = await fetch(url, {
        method: editingExp ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchExperiences();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-slate-900 mb-2">Experiences</h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">Curate and manage lifestyle-driven guest activities.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {loading ? (
          <p className="col-span-full text-center py-20 text-slate-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading experiences...
          </p>
        ) : experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="h-48 relative overflow-hidden">
              <img src={getImageUrl(exp.image_url)} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{exp.category}</span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-playfair text-xl text-slate-900 mb-2">{exp.title}</h3>
              <p className="text-sm text-slate-500 font-light mb-6 line-clamp-2 italic">"{exp.description}"</p>
              
              <div className="flex justify-between items-center mb-8 border-y border-slate-50 py-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {exp.duration}
                </div>
                <div className="font-playfair text-slate-900 text-lg">₹{exp.price}</div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(exp)}
                  className="flex-grow py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(exp.id)}
                  className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/40 backdrop-blur-sm">
          <div className="flex min-h-full justify-center p-4 sm:p-6">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 relative shadow-2xl my-auto text-slate-900">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 sm:top-8 sm:right-8 text-slate-400 hover:text-slate-900 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
              <h2 className="font-playfair text-2xl sm:text-3xl mb-8">{editingExp ? 'Edit Experience' : 'New Experience'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium appearance-none"
                    >
                      <option>Wellness</option>
                      <option>Dining</option>
                      <option>Adventure</option>
                      <option>Culture</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all min-h-[100px] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 90 Minutes"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Experience Image</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <input 
                      type="text" 
                      placeholder="Paste image URL here..."
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all text-slate-900 font-medium text-xs"
                    />
                  </div>
                  <div className="relative group">
                    <button type="button" className="w-full sm:px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Upload'}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                </div>
                {formData.image_url && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm w-full sm:w-48">
                    <img src={getImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                {editingExp ? 'Save Changes' : 'Create Experience'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

