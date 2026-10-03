import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Send,
  Variable,
  X,
  FileText,
  Upload,
  ExternalLink,
  Check,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxChars?: number;
  showSendButton?: boolean;
  onSend?: () => void;
  showVariables?: boolean;
  onInsertVariable?: (variable: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type your email content here...',
  maxChars = 2000,
  showSendButton = false,
  onSend,
  showVariables = false,
  onInsertVariable,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedSelectionRange = useRef<Range | null>(null);

  // Formatting active states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Modals & Popovers
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVarDropdown, setShowVarDropdown] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkText, setLinkText] = useState('');

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  // Attachments
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; type?: string }>>([]);

  // Character counter
  const [charCount, setCharCount] = useState(0);

  // Emojis list
  const emojis = [
    '👋', '✨', '🙏', '😊', '🚀', '💼', '📌', '💡',
    '✅', '🎉', '🔥', '❤️', '👏', '⭐', '📩', '📅',
    '👍', '🤝', '🎯', '⏳', '💬', '🌟', '🏆', '💯'
  ];

  const variables = [
    '[Name]',
    '[Your Name]',
    '[date]',
    '[reason]',
    '[Project Name]',
    '[Topic]',
    '[Time]',
  ];

  // Helper to format initial raw string into HTML if not already HTML
  const formatInitialHtml = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('<p>') || raw.includes('<div>') || raw.includes('<br>') || raw.includes('<strong>') || raw.includes('<em>')) {
      return raw;
    }
    // Convert newlines to paragraphs/breaks
    const paragraphs = raw.split(/\n\n+/);
    if (paragraphs.length > 1) {
      return paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }
    return raw.replace(/\n/g, '<br>');
  };

  // Sync initial content to editor on mount
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML.trim() && value) {
      const formatted = formatInitialHtml(value);
      editorRef.current.innerHTML = formatted;
      setCharCount(editorRef.current.innerText.length);
    }
  }, []);

  // Save selection before opening modals
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection
  const restoreSelection = () => {
    if (savedSelectionRange.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange.current);
      }
    }
  };

  // Update active formatting states based on current selection
  const updateToolbarStates = useCallback(() => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsBulletList(document.queryCommandState('insertUnorderedList'));
      setIsNumberedList(document.queryCommandState('insertOrderedList'));

      if (document.queryCommandState('justifyCenter')) {
        setTextAlign('center');
      } else if (document.queryCommandState('justifyRight')) {
        setTextAlign('right');
      } else {
        setTextAlign('left');
      }

      if (editorRef.current) {
        setCharCount(editorRef.current.innerText.length);
      }
    } catch {
      // Ignore query errors in edge browsers
    }
  }, []);

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText;
      setCharCount(text.length);
      onChange(html);
      updateToolbarStates();
    }
  };

  // Format Commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
    updateToolbarStates();
  };

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    executeCommand('bold');
  };

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    executeCommand('italic');
  };

  const handleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    executeCommand('underline');
  };

  const handleBulletList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
      if (!editorRef.current.innerHTML.trim() || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '<ul><li>First item</li></ul>';
        handleInput();
        return;
      }
    }
    executeCommand('insertUnorderedList');
  };

  const handleNumberedList = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.focus();
      if (!editorRef.current.innerHTML.trim() || editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '<ol><li>First item</li></ol>';
        handleInput();
        return;
      }
    }
    executeCommand('insertOrderedList');
  };

  const handleToggleAlignment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (textAlign === 'left') {
      executeCommand('justifyCenter');
      setTextAlign('center');
    } else if (textAlign === 'center') {
      executeCommand('justifyRight');
      setTextAlign('right');
    } else {
      executeCommand('justifyLeft');
      setTextAlign('left');
    }
  };

  // Link Modal
  const handleOpenLinkModal = (e: React.MouseEvent) => {
    e.preventDefault();
    saveSelection();
    const sel = window.getSelection();
    const selectedText = sel ? sel.toString() : '';
    setLinkText(selectedText || '');
    setLinkUrl('https://');
    setShowLinkModal(true);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLinkModal(false);
    restoreSelection();

    if (!linkUrl) return;

    if (linkText && (!savedSelectionRange.current || savedSelectionRange.current.collapsed)) {
      // Insert new linked text
      const anchorHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #635BFF; text-decoration: underline; font-weight: 500;">${linkText}</a>`;
      executeCommand('insertHTML', anchorHtml);
    } else {
      executeCommand('createLink', linkUrl);
    }
  };

  // Image Modal
  const handleOpenImageModal = (e: React.MouseEvent) => {
    e.preventDefault();
    saveSelection();
    setImageUrl('');
    setShowImageModal(true);
  };

  const handleInsertImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setShowImageModal(false);
    restoreSelection();

    if (!imageUrl) return;
    const imgHtml = `<img src="${imageUrl}" alt="Email illustration" style="max-width: 100%; height: auto; border-radius: 12px; margin: 12px 0; border: 1px solid #E8EBF8;" /><br/>`;
    executeCommand('insertHTML', imgHtml);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setShowImageModal(false);
        restoreSelection();
        const imgHtml = `<img src="${dataUrl}" alt="${file.name}" style="max-width: 100%; max-height: 280px; object-fit: contain; border-radius: 12px; margin: 12px 0; border: 1px solid #E8EBF8;" /><br/>`;
        executeCommand('insertHTML', imgHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  // Emojis
  const handleInsertEmoji = (emoji: string) => {
    setShowEmojiPicker(false);
    restoreSelection();
    executeCommand('insertText', emoji);
  };

  // Variables (for template editor)
  const handleInsertVariable = (v: string) => {
    setShowVarDropdown(false);
    restoreSelection();
    executeCommand('insertText', v);
    if (onInsertVariable) onInsertVariable(v);
  };

  // Attachments
  const handleAttachClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList: File[] = Array.from(e.target.files);
      const newFiles = filesList.map((file: File) => {
        const sizeMb = file.size / (1024 * 1024);
        const sizeStr = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
        return {
          name: file.name,
          size: sizeStr,
          type: file.type || 'Document',
        };
      });
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8EBF8] bg-white overflow-hidden shadow-xs focus-within:border-[#635BFF] transition-all relative">
      {/* Hidden file input for attachments */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      {/* Hidden file input for images */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* WYSIWYG Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#FBFBFE] border-b border-[#E8EBF8] text-[#505A74] select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* 1. Bold Button */}
          <button
            type="button"
            onMouseDown={handleBold}
            className={`p-1.5 rounded-lg transition-colors text-xs font-bold ${
              isBold
                ? 'bg-purple-100 text-[#635BFF]'
                : 'hover:bg-purple-50 hover:text-[#635BFF] text-[#505A74]'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* 2. Italic Button */}
          <button
            type="button"
            onMouseDown={handleItalic}
            className={`p-1.5 rounded-lg transition-colors text-xs ${
              isItalic
                ? 'bg-purple-100 text-[#635BFF]'
                : 'hover:bg-purple-50 hover:text-[#635BFF] text-[#505A74]'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* 3. Underline Button */}
          <button
            type="button"
            onMouseDown={handleUnderline}
            className={`p-1.5 rounded-lg transition-colors text-xs ${
              isUnderline
                ? 'bg-purple-100 text-[#635BFF]'
                : 'hover:bg-purple-50 hover:text-[#635BFF] text-[#505A74]'
            }`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1" />

          {/* 4. Bullet List Button */}
          <button
            type="button"
            onMouseDown={handleBulletList}
            className={`p-1.5 rounded-lg transition-colors text-xs ${
              isBulletList
                ? 'bg-purple-100 text-[#635BFF]'
                : 'hover:bg-purple-50 hover:text-[#635BFF] text-[#505A74]'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* 5. Numbered List Button */}
          <button
            type="button"
            onMouseDown={handleNumberedList}
            className={`p-1.5 rounded-lg transition-colors text-xs ${
              isNumberedList
                ? 'bg-purple-100 text-[#635BFF]'
                : 'hover:bg-purple-50 hover:text-[#635BFF] text-[#505A74]'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1" />

          {/* 6. Alignment Button */}
          <button
            type="button"
            onMouseDown={handleToggleAlignment}
            className="p-1.5 hover:bg-purple-50 hover:text-[#635BFF] rounded-lg transition-colors"
            title={`Text Alignment: ${textAlign.toUpperCase()} (Click to toggle)`}
          >
            {textAlign === 'left' && <AlignLeft className="w-4 h-4" />}
            {textAlign === 'center' && <AlignCenter className="w-4 h-4 text-[#635BFF]" />}
            {textAlign === 'right' && <AlignRight className="w-4 h-4 text-[#635BFF]" />}
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1" />

          {/* 7. Insert Link Button */}
          <button
            type="button"
            onMouseDown={handleOpenLinkModal}
            className="p-1.5 hover:bg-purple-50 hover:text-[#635BFF] rounded-lg transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* 8. Insert Image Button */}
          <button
            type="button"
            onMouseDown={handleOpenImageModal}
            className="p-1.5 hover:bg-purple-50 hover:text-[#635BFF] rounded-lg transition-colors"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* 9. Emoji Picker Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                showEmojiPicker ? 'bg-purple-100 text-[#635BFF]' : 'hover:bg-purple-50 hover:text-[#635BFF]'
              }`}
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Emoji Dropdown Popover */}
            {showEmojiPicker && (
              <div className="absolute left-0 mt-2 p-3 bg-white rounded-2xl shadow-soft-lg border border-[#E8EBF8] grid grid-cols-6 gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 w-64">
                <div className="col-span-6 pb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pick an Emoji
                </div>
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => handleInsertEmoji(e)}
                    className="p-1.5 text-lg hover:scale-125 hover:bg-purple-50 rounded-xl transition-all text-center flex items-center justify-center cursor-pointer"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 10. Attachment Button */}
          <button
            type="button"
            onMouseDown={handleAttachClick}
            className="p-1.5 hover:bg-purple-50 hover:text-[#635BFF] rounded-lg transition-colors"
            title="Attach Document or Files"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* 11. Variables Dropdown (for Templates) */}
          {showVariables && (
            <div className="relative ml-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveSelection();
                  setShowVarDropdown(!showVarDropdown);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-[#635BFF] text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Variable className="w-3.5 h-3.5" />
                <span>Insert Variable</span>
              </button>

              {showVarDropdown && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white rounded-xl shadow-soft-lg border border-[#E8EBF8] p-1.5 z-50 flex flex-col gap-1 animate-in fade-in duration-100">
                  {variables.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#635BFF] rounded-lg font-mono transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Send Button on Toolbar Right */}
        {showSendButton && onSend && (
          <button
            type="button"
            onClick={onSend}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition-all shadow-2xs cursor-pointer transform hover:scale-[1.02]"
            title="Send Email Immediately"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Send</span>
          </button>
        )}
      </div>

      {/* Visual ContentEditable Editor Workspace */}
      <div className="relative p-5">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyUp={updateToolbarStates}
          onMouseUp={updateToolbarStates}
          placeholder={placeholder}
          className="rich-text-content min-h-[220px] max-h-[480px] overflow-y-auto focus:outline-none text-sm text-[#13182E] leading-relaxed font-normal empty:before:content-[attr(placeholder)] empty:before:text-[#94A3B8]"
        />

        {/* Attachment Chips Display */}
        {attachments.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {attachments.length} {attachments.length === 1 ? 'Attachment' : 'Attachments'}
            </span>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-[#635BFF] text-xs font-semibold border border-purple-200 shadow-2xs animate-in fade-in duration-150"
                >
                  <FileText className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span className="font-medium text-[#13182E]">{att.name}</span>
                  <span className="text-[10px] text-slate-500">({att.size})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="hover:text-rose-600 text-slate-400 p-0.5 rounded transition-colors ml-1"
                    title="Remove attachment"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Count Bar */}
        <div className="flex justify-end pt-3 text-[11px] font-medium text-[#94A3B8]">
          <span className={charCount > maxChars ? 'text-rose-500 font-bold' : ''}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Modal 1: Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#13182E] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#635BFF]" />
                <span>Insert Hyperlink</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Project Proposal or Click here"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Target URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5346E0] rounded-xl shadow-soft transition-all"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#13182E] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#635BFF]" />
                <span>Insert Image</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  imageTab === 'upload' ? 'bg-white text-[#635BFF] shadow-2xs' : 'text-slate-600'
                }`}
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  imageTab === 'url' ? 'bg-white text-[#635BFF] shadow-2xs' : 'text-slate-600'
                }`}
              >
                Image URL
              </button>
            </div>

            {imageTab === 'upload' ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8EBF8] hover:border-[#635BFF] rounded-2xl p-6 text-center transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#635BFF] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#13182E] mb-1">
                  Click to select an image file
                </p>
                <p className="text-[11px] text-slate-400 mb-4">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#635BFF] text-xs font-bold rounded-xl transition-colors"
                >
                  Choose Image
                </button>
              </div>
            ) : (
              <form onSubmit={handleInsertImageUrl} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Image Web Address (URL)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8EBF8] focus:border-[#635BFF] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5346E0] rounded-xl shadow-soft"
                  >
                    Insert Image
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

