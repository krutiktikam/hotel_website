'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Compass, XCircle } from 'lucide-react';

export default function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/experiences');
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-slate-900 mb-2">Experiences</h1>
          <p className="text-slate-500 font-light">Curate and manage lifestyle-driven guest activities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <p className="col-span-full text-center py-20 text-slate-400">Loading experiences...</p>
        ) : experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="h-48 relative overflow-hidden">
              <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{exp.category}</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-playfair text-xl text-slate-900 mb-2">{exp.title}</h3>
              <p className="text-sm text-slate-500 font-light mb-6 line-clamp-2 h-10 italic">"{exp.description}"</p>
              
              <div className="flex justify-between items-center mb-8 border-y border-slate-50 py-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {exp.duration}
                </div>
                <div className="font-playfair text-slate-900 text-lg">${exp.price}</div>
              </div>

              <div className="flex gap-2">
                <button className="flex-grow py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">Edit</button>
                <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
            <h2 className="font-playfair text-3xl mb-8">New Experience</h2>
            <p className="text-slate-400 italic mb-8">Experience creation form will be implemented in the next phase.</p>
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
