import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Send,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useEmailContext } from '../../context/EmailContext';
import { TimingCalendarGraphic } from '../../components/illustrations/FeatureIllustrations';
import confetti from 'canvas-confetti';

export const ScheduleEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { scheduleConfig, setScheduleConfig, completeScheduleOrSend } = useEmailContext();

  // Real Date tracking
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Time tracking
  const [sendType, setSendType] = useState<'now' | 'later'>(scheduleConfig.sendType || 'later');
  const [selectedHour, setSelectedHour] = useState('06');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  const [timeZone, setTimeZone] = useState(
    scheduleConfig.timeZone || '(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi'
  );
  const [sendReminder, setSendReminder] = useState(scheduleConfig.sendReminder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popover toggles
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(true);

  // Formatted date string for input (e.g., "27 September 2026")
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formattedDate = formatDate(selectedDate);
  const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

  const getScheduledAtISO = () => {
    let hour = parseInt(selectedHour, 10);

    if (selectedPeriod === 'PM' && hour !== 12) {
      hour += 12;
    }

    if (selectedPeriod === 'AM' && hour === 12) {
      hour = 0;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const minute = parseInt(selectedMinute, 10);

    /*
    * The timezone dropdown currently uses fixed GMT offsets.
    * Example:
    * (GMT+5:30) Chennai...
    * (GMT-5:00) Eastern Time...
    */
    const offsetMatch = timeZone.match(/GMT([+-])(\d+):(\d+)/);

    if (!offsetMatch) {
      throw new Error('Invalid timezone format');
    }

    const sign = offsetMatch[1] === '+' ? 1 : -1;
    const offsetHours = parseInt(offsetMatch[2], 10);
    const offsetMinutes = parseInt(offsetMatch[3], 10);

    const totalOffsetMinutes =
      sign * (offsetHours * 60 + offsetMinutes);

    /*
    * Build the selected date/time as UTC first,
    * then subtract the selected timezone offset.
    */
    const utcTimestamp =
      Date.UTC(
        year,
        month,
        day,
        hour,
        minute
      ) -
      totalOffsetMinutes * 60 * 1000;

    return new Date(utcTimestamp).toISOString();
  };

  // Month navigation
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const setToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewDate(now);
  };

  // Generate real calendar grid days
  const generateCalendarDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        dateObj: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        dateObj: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }

    // Next month leading days to fill 35 or 42 grid cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        dateObj: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleSelectDay = (dateObj: Date) => {
    setSelectedDate(dateObj);
    setViewDate(dateObj);
  };

  // Hour navigation
  const incrementHour = () => {
    const h = (parseInt(selectedHour, 10) % 12) + 1;
    setSelectedHour(h.toString().padStart(2, '0'));
  };

  const decrementHour = () => {
    const h = (parseInt(selectedHour, 10) - 2 + 12) % 12 + 1;
    setSelectedHour(h.toString().padStart(2, '0'));
  };

  const handleSelectHour = (h: number) => {
    setSelectedHour(h.toString().padStart(2, '0'));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const configPayload = {
      sendType,
      date: formattedDate,
      time: formattedTime,
      timeZone,
      scheduledAt:
        sendType === 'later'
          ? getScheduledAtISO()
          : undefined,
      sendReminder,
    };

    setScheduleConfig(configPayload);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#635BFF', '#7C3AED', '#3B82F6', '#10B981'],
      });
    } catch {}

    await completeScheduleOrSend(configPayload);
    setIsSubmitting(false);

    if (sendType === 'now') {
      navigate('/sent');
    } else {
      navigate('/scheduled');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Main Container Card */}
      <div className="bg-white rounded-3xl shadow-card border border-[#E8EBF8] overflow-visible grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Form Area */}
        <div className="lg:col-span-8 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#13182E] tracking-tight">
                  Schedule Email
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  Choose when you want this email to be sent.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Option 1: Send Now */}
              <label
                onClick={() => setSendType('now')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  sendType === 'now'
                    ? 'bg-purple-50/50 border-[#635BFF] shadow-xs'
                    : 'bg-white border-[#E8EBF8] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      sendType === 'now' ? 'border-[#635BFF]' : 'border-slate-300'
                    }`}
                  >
                    {sendType === 'now' && <div className="w-2 h-2 rounded-full bg-[#635BFF]" />}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#635BFF] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#13182E]">Send Now</span>
                    <p className="text-[11px] text-[#64748B]">Send the email immediately.</p>
                  </div>
                </div>
              </label>

              {/* Option 2: Schedule for Later */}
              <label
                onClick={() => setSendType('later')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  sendType === 'later'
                    ? 'bg-purple-50/50 border-[#635BFF] shadow-xs'
                    : 'bg-white border-[#E8EBF8] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      sendType === 'later' ? 'border-[#635BFF]' : 'border-slate-300'
                    }`}
                  >
                    {sendType === 'later' && <div className="w-2 h-2 rounded-full bg-[#635BFF]" />}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#635BFF] flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#13182E]">
                      Schedule for Later
                    </span>
                    <p className="text-[11px] text-[#64748B]">Choose a specific date and time.</p>
                  </div>
                </div>
              </label>

              {/* Date & Time Side-by-Side Row */}
              {sendType === 'later' && (
                <div className="flex flex-col gap-5 pt-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative">
                    {/* Left: Date Field with Real Interactive Calendar Popover */}
                    <div className="md:col-span-7 relative">
                      <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                        DATE
                      </label>
                      <div
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="text"
                          readOnly
                          value={formattedDate}
                          className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#635BFF] focus:outline-none cursor-pointer shadow-xs"
                        />
                        <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635BFF]" />
                      </div>

                      {/* Real Live Calendar Dropdown Popover */}
                      {showDatePicker && (
                        <div className="mt-2 w-full max-w-sm bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                          {/* Month / Year Header with Real Live Prev/Next buttons */}
                          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                            <button
                              type="button"
                              onClick={prevMonth}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#635BFF] hover:bg-purple-50 transition-colors"
                              title="Previous Month"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-[#13182E]">
                              {monthName}
                            </span>
                            <button
                              type="button"
                              onClick={nextMonth}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#635BFF] hover:bg-purple-50 transition-colors"
                              title="Next Month"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Day-of-Week Labels */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                              <span key={d} className="text-[11px] font-semibold text-[#94A3B8]">
                                {d}
                              </span>
                            ))}
                          </div>

                          {/* Dynamic Calendar Matrix Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {calendarDays.map((item, idx) => {
                              const isSelected =
                                selectedDate.getDate() === item.dateObj.getDate() &&
                                selectedDate.getMonth() === item.dateObj.getMonth() &&
                                selectedDate.getFullYear() === item.dateObj.getFullYear();

                              const isToday =
                                today.getDate() === item.dateObj.getDate() &&
                                today.getMonth() === item.dateObj.getMonth() &&
                                today.getFullYear() === item.dateObj.getFullYear();

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectDay(item.dateObj)}
                                  className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs transition-all ${
                                    !item.isCurrentMonth
                                      ? 'text-slate-300 hover:text-slate-500'
                                      : isSelected
                                      ? 'bg-[#635BFF] text-white font-bold shadow-sm'
                                      : isToday
                                      ? 'border border-[#635BFF] text-[#635BFF] font-bold bg-purple-50/50'
                                      : 'text-[#13182E] hover:bg-purple-50 hover:text-[#635BFF]'
                                  }`}
                                >
                                  {item.day}
                                </button>
                              );
                            })}
                          </div>

                          {/* Bottom Today Button */}
                          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={setToday}
                              className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#635BFF] text-xs font-semibold transition-colors"
                            >
                              Today
                            </button>
                            <span className="text-[10.5px] text-[#94A3B8]">
                              {formatDate(today)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Time Field with Real Interactive Wheel Popover */}
                    <div className="md:col-span-5 relative">
                      <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                        TIME
                      </label>
                      <div
                        onClick={() => setShowTimePicker(!showTimePicker)}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="text"
                          readOnly
                          value={formattedTime}
                          className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm font-semibold bg-white text-[#13182E] rounded-xl border border-[#635BFF] focus:outline-none cursor-pointer shadow-xs"
                        />
                        <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635BFF]" />
                      </div>

                      {/* Real Interactive Time Picker Dropdown Popover */}
                      {showTimePicker && (
                        <div className="mt-2 w-full bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] p-3 z-40 animate-in fade-in zoom-in-95 duration-150">
                          {/* 3 Column Wheel: Hour | Minute | AM/PM */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            {/* Column 1: Hour */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
                                Hour
                              </span>
                              <button
                                type="button"
                                onClick={decrementHour}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                                title="Previous Hour"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Relative Hour Slots */}
                              {[
                                (parseInt(selectedHour, 10) - 2 + 12) % 12 || 12,
                                (parseInt(selectedHour, 10) - 1 + 12) % 12 || 12,
                              ].map((h) => (
                                <button
                                  key={h}
                                  type="button"
                                  onClick={() => handleSelectHour(h)}
                                  className="text-xs text-slate-400 py-0.5 hover:text-slate-700"
                                >
                                  {h.toString().padStart(2, '0')}
                                </button>
                              ))}

                              {/* Selected Hour */}
                              <div className="w-full py-1 rounded-xl bg-purple-50 text-[#635BFF] font-bold text-xs">
                                {selectedHour}
                              </div>

                              {[
                                (parseInt(selectedHour, 10) % 12) + 1,
                                ((parseInt(selectedHour, 10) + 1) % 12) + 1,
                              ].map((h) => (
                                <button
                                  key={h}
                                  type="button"
                                  onClick={() => handleSelectHour(h)}
                                  className="text-xs text-slate-400 py-0.5 hover:text-slate-700"
                                >
                                  {h.toString().padStart(2, '0')}
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={incrementHour}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                                title="Next Hour"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Column 2: Minute */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
                                Minute
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const mins = ['00', '15', '30', '45'];
                                  const idx = mins.indexOf(selectedMinute);
                                  setSelectedMinute(mins[(idx - 1 + mins.length) % mins.length]);
                                }}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>

                              {['00', '15', '30', '45'].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setSelectedMinute(m)}
                                  className={`w-full py-1 rounded-xl text-xs transition-colors ${
                                    selectedMinute === m
                                      ? 'bg-purple-50 text-[#635BFF] font-bold'
                                      : 'text-slate-400 hover:text-slate-700'
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() => {
                                  const mins = ['00', '15', '30', '45'];
                                  const idx = mins.indexOf(selectedMinute);
                                  setSelectedMinute(mins[(idx + 1) % mins.length]);
                                }}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Column 3: AM/PM */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
                                AM/PM
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedPeriod(selectedPeriod === 'AM' ? 'PM' : 'AM')}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedPeriod('AM')}
                                className={`w-full py-1.5 rounded-xl text-xs font-semibold mt-2 ${
                                  selectedPeriod === 'AM'
                                    ? 'bg-purple-50 text-[#635BFF] font-bold'
                                    : 'text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                AM
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedPeriod('PM')}
                                className={`w-full py-1.5 rounded-xl text-xs font-semibold ${
                                  selectedPeriod === 'PM'
                                    ? 'bg-purple-50 text-[#635BFF] font-bold'
                                    : 'text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                PM
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedPeriod(selectedPeriod === 'PM' ? 'AM' : 'PM')}
                                className="p-0.5 text-slate-400 hover:text-[#635BFF]"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Time Zone
                    </label>
                    <div className="relative">
                      <select
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 text-xs font-semibold bg-white text-[#13182E] rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi">
                          (GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi
                        </option>
                        <option value="(GMT+0:00) London, Dublin, Lisbon">
                          (GMT+0:00) London, Dublin, Lisbon
                        </option>
                        <option value="(GMT-5:00) Eastern Time (US & Canada)">
                          (GMT-5:00) Eastern Time (US & Canada)
                        </option>
                        <option value="(GMT-8:00) Pacific Time (US & Canada)">
                          (GMT-8:00) Pacific Time (US & Canada)
                        </option>
                      </select>
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                    </div>
                  </div>

                  {/* Send Reminder Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={sendReminder}
                      onChange={(e) => setSendReminder(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#635BFF] rounded border-gray-300 focus:ring-[#635BFF] accent-[#635BFF]"
                    />
                    <label htmlFor="reminder" className="text-xs text-[#13182E] font-semibold select-none cursor-pointer">
                      Send me a reminder before sending <br />
                      <span className="text-[11px] text-[#64748B] font-normal">
                        You'll receive a notification 10 minutes before sending.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <Link
              to="/review"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8EBF8] hover:bg-slate-50 text-xs font-semibold text-[#505A74] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#635BFF]" />
              <span>Back</span>
            </Link>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#635BFF] hover:bg-[#5346E0] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{sendType === 'now' ? 'Send Now' : 'Schedule Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Visual Panel */}
        <div className="hidden lg:flex lg:col-span-4 bg-gradient-to-br from-[#EDE9FE]/50 via-[#F5F3FF] to-white p-8 flex-col items-center justify-center text-center relative border-l border-[#E8EBF8]">
          <TimingCalendarGraphic className="mb-6" />

          <h3 className="text-xl font-bold text-[#13182E] mb-2">
            Perfect Timing <br />
            <span className="text-[#635BFF]">Better Responses</span>
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-xs">
            Schedule emails and never miss an important conversation.
          </p>
        </div>
      </div>
    </div>
  );
};
