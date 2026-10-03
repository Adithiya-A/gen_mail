import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  User,
  Target,
  Pin,
  Calendar,
  Bookmark,
  ChevronLeft,
  ArrowRight,
  Edit2,
  Check,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';

export const IntentExtractionPage: React.FC = () => {
  const navigate = useNavigate();
  const { intentData, updateIntentItem } = useEmailContext();

  // Inline edit states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempRecipient, setTempRecipient] = useState(intentData.recipient);
  const [tempPurpose, setTempPurpose] = useState(intentData.purpose);
  const [tempTone, setTempTone] = useState(intentData.tone);
  const [tempDateTime, setTempDateTime] = useState(intentData.dateTime);
  const [tempPoints, setTempPoints] = useState(intentData.keyPoints.join(', '));

  const saveEdit = (field: string) => {
    if (field === 'recipient') updateIntentItem('recipient', tempRecipient);
    if (field === 'purpose') updateIntentItem('purpose', tempPurpose);
    if (field === 'tone') updateIntentItem('tone', tempTone);
    if (field === 'dateTime') updateIntentItem('dateTime', tempDateTime);
    if (field === 'keyPoints') {
      updateIntentItem(
        'keyPoints',
        tempPoints.split(',').map((p) => p.trim()).filter(Boolean)
      );
    }
    setEditingField(null);
  };

  const handleContinue = () => {
    navigate('/generate');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Main Intent Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EBF8] shadow-card flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
              Intent Extraction
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              GenMail has analyzed your request and extracted key details.
            </p>
          </div>
        </div>

        {/* 5 Extracted Intent Rows */}
        <div className="flex flex-col gap-3.5 mt-2">
          {/* 1. Recipient */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-200 transition-colors gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-bold text-[#13182E]">Recipient</span>
              </div>
              <div className="flex-1">
                {editingField === 'recipient' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempRecipient}
                      onChange={(e) => setTempRecipient(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#635BFF] focus:outline-none w-full"
                    />
                    <button
                      onClick={() => saveEdit('recipient')}
                      className="p-1.5 bg-[#635BFF] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[#505A74]">{intentData.recipient}</span>
                )}
              </div>
            </div>
            {editingField !== 'recipient' && (
              <button
                onClick={() => setEditingField('recipient')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-purple-50 rounded-xl transition-colors self-end sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* 2. Purpose */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-200 transition-colors gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-bold text-[#13182E]">Purpose</span>
              </div>
              <div className="flex-1">
                {editingField === 'purpose' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempPurpose}
                      onChange={(e) => setTempPurpose(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#635BFF] focus:outline-none w-full"
                    />
                    <button
                      onClick={() => saveEdit('purpose')}
                      className="p-1.5 bg-[#635BFF] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[#505A74]">{intentData.purpose}</span>
                )}
              </div>
            </div>
            {editingField !== 'purpose' && (
              <button
                onClick={() => setEditingField('purpose')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-purple-50 rounded-xl transition-colors self-end sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* 3. Tone */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-200 transition-colors gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0">
                <Pin className="w-5 h-5" />
              </div>
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-bold text-[#13182E]">Tone</span>
              </div>
              <div className="flex-1">
                {editingField === 'tone' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTone}
                      onChange={(e) => setTempTone(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#635BFF] focus:outline-none w-full"
                    />
                    <button
                      onClick={() => saveEdit('tone')}
                      className="p-1.5 bg-[#635BFF] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[#505A74]">{intentData.tone}</span>
                )}
              </div>
            </div>
            {editingField !== 'tone' && (
              <button
                onClick={() => setEditingField('tone')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-purple-50 rounded-xl transition-colors self-end sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* 4. Date / Time */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-200 transition-colors gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-bold text-[#13182E]">Date / Time</span>
              </div>
              <div className="flex-1">
                {editingField === 'dateTime' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempDateTime}
                      onChange={(e) => setTempDateTime(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#635BFF] focus:outline-none w-full"
                    />
                    <button
                      onClick={() => saveEdit('dateTime')}
                      className="p-1.5 bg-[#635BFF] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[#505A74]">{intentData.dateTime}</span>
                )}
              </div>
            </div>
            {editingField !== 'dateTime' && (
              <button
                onClick={() => setEditingField('dateTime')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-purple-50 rounded-xl transition-colors self-end sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* 5. Key Points */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between p-4 rounded-2xl border border-[#E8EBF8] hover:border-purple-200 transition-colors gap-3">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="w-28 flex-shrink-0 pt-2 sm:pt-0">
                <span className="text-xs font-bold text-[#13182E]">Key Points</span>
              </div>
              <div className="flex-1">
                {editingField === 'keyPoints' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempPoints}
                      onChange={(e) => setTempPoints(e.target.value)}
                      placeholder="Comma separated key points"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#635BFF] focus:outline-none w-full"
                    />
                    <button
                      onClick={() => saveEdit('keyPoints')}
                      className="p-1.5 bg-[#635BFF] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside text-xs font-semibold text-[#505A74] space-y-1">
                    {intentData.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {editingField !== 'keyPoints' && (
              <button
                onClick={() => setEditingField('keyPoints')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] hover:bg-purple-50 rounded-xl transition-colors self-end sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <Link
            to="/compose"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 text-xs font-semibold text-[#505A74] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#635BFF]" />
            <span>Back</span>
          </Link>

          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
