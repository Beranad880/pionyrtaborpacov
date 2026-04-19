'use client';

import { useState, useEffect } from 'react';
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
    tags: article.tags.join(', '),
    status: article.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(formData.title);
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tagsArray,
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
          tags: tagsArray,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nadpis článku *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          maxLength={150}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Výtah článku *
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          required
          maxLength={300}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Obsah článku *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={12}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorie *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagy
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Zrušit
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Ukládání...' : 'Uložit změny'}
        </button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Správa článků</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Nový článek
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Publikováno</h3>
              <p className="text-2xl font-semibold text-gray-900">{publishedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">📄</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Koncepty</h3>
              <p className="text-2xl font-semibold text-gray-900">{draftCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">👁️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Zobrazení</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">❤️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Líbí se</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Všechny</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Všechny</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Články ({filteredArticles.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredArticles.map((article) => (
            <div key={article._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryInfo(article.category).color}`}>
                      {getCategoryInfo(article.category).label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(article.status).color}`}>
                      {getStatusInfo(article.status).label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-medium">Autor:</span> {article.author}
                      </div>
                      <div>
                        <span className="font-medium">Vytvořeno:</span> {new Date(article.createdAt).toLocaleDateString('cs-CZ')}
                      </div>
                      <div>
                        <span className="font-medium">Zobrazení:</span> {article.views}
                      </div>
                      <div>
                        <span className="font-medium">Líbí se:</span> {article.likes}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{article.excerpt}</p>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-600 rounded hover:bg-gray-50 transition-colors"
                  >
                    Upravit
                  </button>
                  {article.status === 'draft' && (
                    <button
                      onClick={() => updateArticleStatus(article._id, 'published')}
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Publikovat
                    </button>
                  )}
                  {article.status === 'published' && (
                    <button
                      onClick={() => updateArticleStatus(article._id, 'archived')}
                      className="px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                    >
                      Archivovat
                    </button>
                  )}
                  <button
                    onClick={() => deleteArticle(article._id)}
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail/Edit Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Upravit článek' : 'Detail článku'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  {isEditing ? 'Zrušit' : 'Upravit'}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {isEditing ? (
              <EditArticleForm
                article={selectedArticle}
                onSave={(updatedArticle) => {
                  setArticles(prev => prev.map(a => a._id === updatedArticle._id ? updatedArticle : a));
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedArticle.title}</h4>
                  <div className="flex space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryInfo(selectedArticle.category).color}`}>
                      {getCategoryInfo(selectedArticle.category).label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedArticle.status).color}`}>
                      {getStatusInfo(selectedArticle.status).label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Autor:</span> {selectedArticle.author}
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span> {selectedArticle.slug}
                  </div>
                  <div>
                    <span className="font-medium">Vytvořeno:</span> {new Date(selectedArticle.createdAt).toLocaleDateString('cs-CZ')}
                  </div>
                  <div>
                    <span className="font-medium">Upraveno:</span> {new Date(selectedArticle.updatedAt).toLocaleDateString('cs-CZ')}
                  </div>
                  {selectedArticle.publishedAt && (
                    <div>
                      <span className="font-medium">Publikováno:</span> {new Date(selectedArticle.publishedAt).toLocaleDateString('cs-CZ')}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Zobrazení:</span> {selectedArticle.views} • Líbí se: {selectedArticle.likes}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Výtah</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedArticle.excerpt}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Obsah</label>
                  <div
                    className="prose max-w-none bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                </div>

                {selectedArticle.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagy</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  {selectedArticle.status === 'draft' && (
                    <button
                      onClick={() => {
                        updateArticleStatus(selectedArticle._id, 'published');
                        setSelectedArticle(null);
                      }}
                      className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      Publikovat článek
                    </button>
                  )}
                  {selectedArticle.status === 'published' && (
                    <button
                      onClick={() => {
                        updateArticleStatus(selectedArticle._id, 'archived');
                        setSelectedArticle(null);
                      }}
                      className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                    >
                      Archivovat článek
                    </button>
                  )}
                  <button
                    onClick={() => deleteArticle(selectedArticle._id)}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Smazat článek
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Article Form Modal */}
      {showAddForm && <ArticleForm onClose={() => setShowAddForm(false)} onSubmit={fetchArticles} />}
    </div>
  );
}