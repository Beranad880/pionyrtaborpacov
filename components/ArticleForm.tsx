'use client';

import { useState, useRef } from 'react';

interface ArticleFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  category: 'news' | 'event-report' | 'general' | 'announcement';
  status: 'published';
}

const categories = [
  { value: 'news', label: 'Novinky' },
  { value: 'event-report', label: 'Reportáž' },
  { value: 'general', label: 'Obecné' },
  { value: 'announcement', label: 'Oznámení' }
];

export default function ArticleForm({ onClose, onSubmit }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: 'news',
    status: 'published'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const replacement = `${openTag}${selection}${closeTag}`;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    setFormData(prev => ({ ...prev, content: newValue }));

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(formData.title);

      const articleData = {
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: [], // Tags are now empty
        status: formData.status,
        author: 'Admin'
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (result.success) {
        onSubmit();
        onClose();
      } else {
        setError(result.message || 'Chyba při vytváření článku');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      setError('Chyba při vytváření článku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Nový článek</h3>
            <p className="text-sm text-slate-500">Vytvořte a okamžitě publikujte nový příspěvek</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-slate-100">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-800">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                  className="w-full text-3xl font-bold border-none focus:ring-0 p-0 placeholder-slate-300"
                  placeholder="Nadpis článku..."
                />
                <div className="h-px bg-slate-200 w-full mt-2"></div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  URL: /{generateSlug(formData.title) || '...'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 bg-slate-50 p-2 rounded-t-lg">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={() => insertTag('<h2>', '</h2>')} className="px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-100" title="Nadpis 2">H2</button>
                    <button type="button" onClick={() => insertTag('<h3>', '</h3>')} className="px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-100" title="Nadpis 3">H3</button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-100" title="Tučné">B</button>
                    <button type="button" onClick={() => insertTag('<em>', '</em>')} className="px-2 py-1 text-xs italic bg-white border border-slate-300 rounded hover:bg-slate-100" title="Kurzíva">I</button>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button type="button" onClick={() => insertTag('<p>', '</p>')} className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-100" title="Odstavec">P</button>
                    <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-100" title="Seznam">UL</button>
                    <button type="button" onClick={() => insertTag('<a href="#">', '</a>')} className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-100" title="Odkaz">Link</button>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HTML Editor</span>
                </div>
                <textarea
                  ref={contentRef}
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full border-none focus:ring-0 p-0 text-slate-700 leading-relaxed min-h-[400px] resize-none font-serif text-lg"
                  placeholder="Zde napište obsah článku..."
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label htmlFor="excerpt" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Stručný výtah (pro náhledy)
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  maxLength={300}
                  rows={2}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-600 italic resize-none"
                  placeholder="Stručný popis článku, který se zobrazí v seznamu..."
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-mono ${formData.excerpt.length > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                    {formData.excerpt.length}/300
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full md:w-80 bg-slate-50/50 p-6 space-y-8 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Kategorie příspěvku
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <label 
                      key={cat.value} 
                      className={`
                        flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all
                        ${formData.category === cat.value 
                          ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/10' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                      `}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-sm font-medium">{cat.label}</span>
                      {formData.category === cat.value && (
                        <svg className="w-4 h-4 ml-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <span className="block text-xs font-bold text-green-700 uppercase tracking-wider">Status: Publikovat</span>
                    <p className="text-[11px] text-green-600 leading-tight mt-1">Článek bude po uložení ihned viditelný pro všechny návštěvníky webu.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.excerpt || !formData.content}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publikování...
                  </span>
                ) : '🚀 Publikovat nyní'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-white text-slate-500 font-medium py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}