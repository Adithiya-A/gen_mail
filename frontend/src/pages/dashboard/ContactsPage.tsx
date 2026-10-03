import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Mail,
  MoreVertical,
  Sparkles,
  Phone,
  Trash2,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPromptConfig, showToast } = useEmailContext();

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Dr. K. Sharma', email: 'professor@pec.edu.in', role: 'Project Guide / Professor', tag: 'Academic', initials: 'KS', bg: 'bg-purple-100 text-[#635BFF]' },
    { id: '2', name: 'Mentor Team', email: 'mentor@pec.edu.in', role: 'Technical Advisor', tag: 'Academic', initials: 'MT', bg: 'bg-indigo-100 text-indigo-700' },
    { id: '3', name: 'Core Engineering Team', email: 'team@company.com', role: 'Development Team', tag: 'Professional', initials: 'CT', bg: 'bg-blue-100 text-blue-700' },
    { id: '4', name: 'Campus Recruiter', email: 'recruiter@abc.com', role: 'Talent Acquisition', tag: 'Professional', initials: 'CR', bg: 'bg-emerald-100 text-emerald-700' },
    { id: '5', name: 'HR Department', email: 'hr@xyz.com', role: 'Human Resources', tag: 'Professional', initials: 'HR', bg: 'bg-orange-100 text-orange-700' },
    { id: '6', name: 'Divya R', email: 'divya@student.pec.edu.in', role: 'Classmate / Peer', tag: 'Personal', initials: 'DR', bg: 'bg-rose-100 text-rose-700' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('');

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComposeTo = (contact: typeof contacts[0]) => {
    setPromptConfig((prev) => ({
      ...prev,
      promptText: `Write an email to ${contact.name} (${contact.email}) regarding...`,
    }));
    navigate('/compose');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newContact = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: newRole || 'Contact',
      tag: 'Professional',
      initials: newName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      bg: 'bg-purple-100 text-[#635BFF]',
    };

    setContacts([newContact, ...contacts]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('');
    showToast('Contact Added', `${newName} added to your contacts.`);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    showToast('Contact Removed', 'Contact was removed from your list.', 'info');
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Contacts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage your frequent email contacts and recipients.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, or role..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8F9FE] focus:bg-white text-[#13182E] placeholder-[#94A3B8] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none transition-all"
          />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="p-5 rounded-2xl border border-[#E8EBF8] hover:border-purple-300 hover:shadow-soft transition-all flex flex-col justify-between gap-4 group bg-[#FAFBFF] hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${contact.bg} font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0`}
                  >
                    {contact.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#13182E] group-hover:text-[#635BFF] transition-colors">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-[#64748B] truncate max-w-[170px]">{contact.email}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{contact.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  title="Delete contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action */}
              <button
                onClick={() => handleComposeTo(contact)}
                className="w-full py-2 px-3 bg-white hover:bg-purple-50 text-xs font-semibold text-[#635BFF] rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Compose with AI</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#13182E] mb-4">Add New Contact</h3>
            <form onSubmit={handleAddContact} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. K. Sharma"
                  required
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. professor@pec.edu.in"
                  required
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#13182E] mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Project Guide"
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5346E0] rounded-xl shadow-soft"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
