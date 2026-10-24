import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Building2, Plus, X, RefreshCw, Globe, Mail, Phone, MapPin, Edit2, Check } from 'lucide-react';

export const TNPCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ company_name: '', industry_type: '', location: '', website: '', contact_email: '', contact_phone: '' });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getTNPCompanies().then(r => { setCompanies(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) { setMsg({ type: 'error', text: 'Company name is required.' }); return; }
    setSaving(true);
    try {
      if (editId) {
        await api.updateCompany(editId, form);
        setMsg({ type: 'success', text: 'Company updated successfully.' });
      } else {
        await api.addCompany(form);
        setMsg({ type: 'success', text: 'Company added successfully.' });
      }
      setShowForm(false);
      setEditId(null);
      setForm({ company_name: '', industry_type: '', location: '', website: '', contact_email: '', contact_phone: '' });
      load();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Failed to save company.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: any) => {
    setEditId(c.company_id);
    setForm({ company_name: c.company_name, industry_type: c.industry_type || '', location: c.location || '', website: c.website || '', contact_email: c.contact_email || '', contact_phone: c.contact_phone || '' });
    setShowForm(true);
  };

  const industries = ['IT / Software', 'Manufacturing', 'Banking / Finance', 'Core Engineering', 'Consulting', 'E-Commerce', 'Healthcare', 'Government / PSU', 'FMCG', 'Other'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Company Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">{companies.length} companies registered in the placement cell</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ company_name: '', industry_type: '', location: '', website: '', contact_email: '', contact_phone: '' }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all shadow-md">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
          <button onClick={() => setMsg(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 mb-4">{editId ? 'Edit Company' : 'Add New Company'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Company Name *</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Industry Type</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.industry_type} onChange={e => setForm({ ...form, industry_type: e.target.value })}>
                <option value="">Select Industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mumbai, Pune" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Website</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://company.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Email</label>
              <input type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="hr@company.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Phone</label>
              <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-400" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} placeholder="9876543210" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-60 transition-all">
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} {editId ? 'Update' : 'Add Company'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Company Cards */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-green-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(c => (
            <div key={c.company_id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{c.company_name}</h3>
              <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{c.industry_type || 'N/A'}</span>
              <div className="mt-3 space-y-1">
                {c.location && <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><MapPin className="w-3 h-3" />{c.location}</div>}
                {c.contact_email && <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Mail className="w-3 h-3" />{c.contact_email}</div>}
                {c.website && <div className="flex items-center gap-1.5 text-[11px] text-blue-500"><Globe className="w-3 h-3" />{c.website}</div>}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">{c.total_drives || 0}</span> total drives •
                <span className="font-bold text-green-600">{c.active_drives || 0}</span> active
              </div>
            </div>
          ))}
          {!companies.length && <div className="col-span-3 text-center py-12 text-slate-400 text-sm">No companies yet. Click "Add Company" to register the first company.</div>}
        </div>
      )}
    </div>
  );
};

export default TNPCompaniesPage;
