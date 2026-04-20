'use client';

import { useState, useEffect, useRef } from 'react';
import ArticleForm from '@/components/ArticleForm';
import { useToast } from '@/components/Toast';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: 'news' | 'event-report' | 'general' | 'announcement';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: 'news', label: 'Novinky', color: 'bg-purple-100 text-purple-800' },
  { value: 'event-report', label: 'Reportáž', color: 'bg-green-100 text-green-800' },
  { value: 'general', label: 'Obecné', color: 'bg-gray-100 text-gray-800' },
  { value: 'announcement', label: 'Oznámení', color: 'bg-blue-100 text-blue-800' }
];

const statuses = [
  { value: 'draft', label: 'Koncept', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'published', label: 'Publikováno', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archivováno', color: 'bg-gray-100 text-gray-800' }
];

// Edit Article Form Component
function EditArticleForm({ article, onSave, onCancel }: {
  article: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    status: 'published' as const // Force published
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
      .trim()
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
        tags: [], // Tags removed
        status: formData.status
      };

      const response = await fetch(`/api/articles/${article._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (result.success) {
        onSave({
          ...article,
          ...articleData,
          slug,
          tags: [],
          updatedAt: new Date().toISOString()
        });
      } else {
        setError(result.message || 'Chyba při aktualizaci článku');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Chyba při aktualizaci článku');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-6 space-y-6 border-r border-slate-100">
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Stručný výtah (pro náhledy)
            </label>
            <textarea
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
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
              <div className="mt-1 w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <span className="block text-xs font-bold text-green-700 uppercase tracking-wider">Status: Publikováno</span>
                <p className="text-[11px] text-green-600 leading-tight mt-1">Změny se po uložení ihned projeví na webu.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.excerpt || !formData.content}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300"
          >
            {isSubmitting ? 'Ukládání...' : '💾 Uložit změny'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white text-slate-500 font-medium py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Zrušit
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ArticlesAdminPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles', {
        credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
        setArticles(result.data.articles);
      } else {
        console.error('Failed to fetch articles:', result.message);
        toast('Nepodařilo se načíst články', 'error');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast('Chyba při načítání článků', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const updateArticleStatus = async (id: string, status: Article['status']) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        setArticles(prev =>
          prev.map(article =>
            article._id === id ? {
              ...article,
              status,
              publishedAt: status === 'published' && !article.publishedAt ? new Date().toISOString() : article.publishedAt,
              updatedAt: new Date().toISOString()
            } : article
          )
        );
        toast('Status byl aktualizován', 'success');
      } else {
        toast(result.message || 'Chyba při aktualizaci článku', 'error');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast('Chyba při aktualizaci článku', 'error');
    }
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Opravdu chcete tento článek smazat?')) {
      try {
        const response = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const result = await response.json();

        if (result.success) {
          setArticles(prev => prev.filter(article => article._id !== id));
          setSelectedArticle(null);
          toast('Článek byl smazán', 'success');
        } else {
          toast(result.message || 'Chyba při mazání článku', 'error');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast('Chyba při mazání článku', 'error');
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filterStatus !== 'all' && article.status !== filterStatus) return false;
    if (filterCategory !== 'all' && article.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa článků</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.likes, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Správa článků</h1>
          <p className="text-slate-500 mt-1 font-medium">Vytvářejte a spravujte obsah svého webu</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 w-fit transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nový článek
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">📝</div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publikováno</h3>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{publishedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Koncepty</h3>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{draftCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">👁️</div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zobrazení</h3>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">❤️</div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Líbí se</h3>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{totalLikes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Vše
              </button>
              {statuses.map(s => (
                <button 
                  key={s.value}
                  onClick={() => setFilterStatus(s.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filterStatus === s.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategorie:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">Všechny kategorie</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredArticles.length > 0 ? filteredArticles.map((article) => (
            <div key={article._id} className="p-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryInfo(article.category).color}`}>
                      {getCategoryInfo(article.category).label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusInfo(article.status).color}`}>
                      {getStatusInfo(article.status).label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                      {new Date(article.createdAt).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 line-clamp-1 italic">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <span className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">👤</span>
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <span className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">👁️</span>
                      {article.views}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <span className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[10px]">❤️</span>
                      {article.likes}
                    </div>
                    {article.tags.length > 0 && (
                      <div className="flex gap-1 ml-2">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-[10px] font-bold text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && <span className="text-[10px] font-bold text-slate-300">+{article.tags.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedArticle(article); setIsEditing(false); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Náhled"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setSelectedArticle(article); setIsEditing(true); }}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                    title="Upravit"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {article.status === 'draft' && (
                    <button
                      onClick={() => updateArticleStatus(article._id, 'published')}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                      title="Publikovat"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteArticle(article._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Smazat"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-slate-900">Nebyly nalezeny žádné články</h3>
              <p className="text-slate-500 mt-2">Zkuste změnit filtry nebo vytvořit nový článek.</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Detail/Edit Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden transition-all ${isEditing ? 'max-w-6xl max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'}`}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {isEditing ? '✏️ Upravit článek' : '📄 Detail článku'}
                </h3>
                {!isEditing && <p className="text-sm text-slate-500 font-medium">Prohlédněte si obsah publikovaného příspěvku</p>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isEditing ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700'}`}
                >
                  {isEditing ? 'Zrušit úpravy' : 'Upravit článek'}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <EditArticleForm
                  article={selectedArticle}
                  onSave={(updatedArticle) => {
                    setArticles(prev => prev.map(a => a._id === updatedArticle._id ? updatedArticle : a));
                    setIsEditing(false);
                    toast('Článek byl úspěšně upraven', 'success');
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="p-8 space-y-8 overflow-y-auto max-h-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryInfo(selectedArticle.category).color}`}>
                        {getCategoryInfo(selectedArticle.category).label}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusInfo(selectedArticle.status).color}`}>
                        {getStatusInfo(selectedArticle.status).label}
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">{selectedArticle.title}</h2>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 border-y border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Autor</span>
                        <span className="text-sm font-bold text-slate-700">{selectedArticle.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Vytvořeno</span>
                        <span className="text-sm font-bold text-slate-700">{new Date(selectedArticle.createdAt).toLocaleDateString('cs-CZ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Statistiky</span>
                        <span className="text-sm font-bold text-slate-700">👁️ {selectedArticle.views} • ❤️ {selectedArticle.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-relaxed relative">
                    <span className="absolute -top-3 left-6 text-4xl text-slate-200 font-serif">"</span>
                    {selectedArticle.excerpt}
                  </div>

                  <div className="prose prose-slate max-w-none prose-h2:font-black prose-h2:text-2xl prose-h3:font-bold prose-p:leading-relaxed prose-p:text-slate-700">
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                  </div>

                  {selectedArticle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100">
                      {selectedArticle.tags.map((tag, index) => (
                        <span key={index} className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-8">
                    {selectedArticle.status === 'draft' && (
                      <button
                        onClick={() => {
                          updateArticleStatus(selectedArticle._id, 'published');
                          setSelectedArticle(null);
                        }}
                        className="px-6 py-2.5 text-white bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                      >
                        🚀 Publikovat nyní
                      </button>
                    )}
                    <button
                      onClick={() => deleteArticle(selectedArticle._id)}
                      className="px-6 py-2.5 text-red-600 border-2 border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
                    >
                      🗑️ Smazat článek
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Article Form Modal */}
      {showAddForm && <ArticleForm onClose={() => setShowAddForm(false)} onSubmit={fetchArticles} />}
    </div>
  );
}