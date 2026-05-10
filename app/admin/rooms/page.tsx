'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Maximize, 
  Users, 
  DollarSign,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Save,
  Loader2,
  Upload
} from 'lucide-react';

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    guests: '',
    image_url: '',
    gallery_images: [] as string[],
    is_active: true,
    total_inventory: 1,
    seo_title: '',
    seo_description: '',
    features: [] as string[]
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      setFormData({
        name: currentRoom.name,
        slug: currentRoom.slug,
        description: currentRoom.description,
        price: currentRoom.price,
        guests: currentRoom.guests,
        image_url: currentRoom.image_url,
        gallery_images: Array.isArray(currentRoom.gallery_images) ? currentRoom.gallery_images : [],
        is_active: currentRoom.is_active,
        total_inventory: currentRoom.total_inventory || 1,
        seo_title: currentRoom.seo_title || '',
        seo_description: currentRoom.seo_description || '',
        features: Array.isArray(currentRoom.features) ? currentRoom.features : []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        guests: '',
        image_url: '',
        gallery_images: [],
        is_active: true,
        total_inventory: 1,
        seo_title: '',
        seo_description: '',
        features: []
      });
    }
  }, [currentRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = currentRoom 
        ? `${API_BASE_URL}/admin/rooms/${currentRoom.id}` 
        : `${API_BASE_URL}/admin/rooms`;
      
      const response = await fetch(url, {
        method: currentRoom ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchRooms();
      } else {
        const errData = await response.json();
        alert(`Error: ${JSON.stringify(errData.detail)}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
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
        if (isGallery) {
          setFormData(prev => ({ 
            ...prev, 
            gallery_images: [...prev.gallery_images, data.url] 
          }));
        } else {
          setFormData({ ...formData, image_url: data.url });
        }
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchRooms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-slate-900 mb-2">Sanctuaries</h1>
          <p className="text-slate-500 font-light">Manage room types, pricing, and availability.</p>
        </div>
        <button 
          onClick={() => { setCurrentRoom(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" /> Add New Room
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <p className="col-span-2 text-center py-20 text-slate-400 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading sanctuaries...
          </p>
        ) : rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                <img 
                  src={room.image_url} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    room.is_active ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {room.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="md:w-3/5 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-playfair text-2xl text-slate-900 mb-1">{room.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{room.slug}</p>
                  </div>
                  <p className="text-2xl font-playfair text-slate-900">₹{room.price}<span className="text-xs text-slate-400 font-sans">/nt</span></p>
                </div>
                
                <p className="text-sm text-slate-500 font-light line-clamp-2 mb-6 flex-grow italic">
                  "{room.description}"
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Maximize className="w-3.5 h-3.5" /> {room.size}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" /> {room.guests}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setCurrentRoom(room); setIsModalOpen(true); }}
                    className="flex-grow flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(room.id)}
                    className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h2 className="font-playfair text-3xl mb-8">{currentRoom ? 'Edit Sanctuary' : 'Add New Sanctuary'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Room Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Slug</label>
                  <input 
                    required
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g. ocean-suite"
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Price/Night (₹)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Total Inventory</label>
                  <input 
                    required
                    type="number" 
                    value={formData.total_inventory}
                    onChange={(e) => setFormData({...formData, total_inventory: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Guests</label>
                  <input 
                    required
                    type="text" 
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">SEO Title</label>
                  <input 
                    type="text" 
                    value={formData.seo_title}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    placeholder="Search engine title..."
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">SEO Description</label>
                  <input 
                    type="text" 
                    value={formData.seo_description}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    placeholder="Search engine meta description..."
                    className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-coastal-seafoam focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Sanctuary Gallery</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(formData.gallery_images || []).map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                      <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = formData.gallery_images.filter((_, i) => i !== idx);
                          setFormData(prev => ({
                            ...prev,
                            gallery_images: newGallery,
                            image_url: newGallery[0] || ''
                          }));
                        }}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors text-slate-400 hover:text-coastal-seafoam hover:border-coastal-seafoam overflow-hidden">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-[8px] uppercase font-bold tracking-widest">Add View</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => handleFileUpload(e, true)} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-200 text-coastal-seafoam focus:ring-coastal-seafoam"
                />
                <label htmlFor="is_active" className="text-sm text-slate-600 font-medium">Room is active and available for booking</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-5 rounded-2xl border border-slate-100 font-medium text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-medium shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {currentRoom ? 'Update Sanctuary' : 'Create Sanctuary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
