import { pageContent } from '@/data/content';

export default function AboutSection() {
  return (
    <section id="about-section" className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              {pageContent.about.title}
            </h2>
            <blockquote className="text-xl md:text-2xl text-slate-600 italic leading-relaxed max-w-4xl mx-auto border-l-4 border-red-600 pl-6 bg-red-50 p-6 rounded-r-lg shadow-sm">
              {pageContent.about.subtitle}
            </blockquote>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {pageContent.about.content.map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="relative w-80 h-80 rounded-xl overflow-hidden shadow-lg">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-red-600 bg-opacity-80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-red-600 text-2xl font-bold">P</span>
                    </div>
                    <div className="font-bold text-xl">Pionýr</div>
                    <div className="text-sm opacity-90">od roku 1990</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pioneer Organization Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                Pionýr
              </h3>
              <p className="text-slate-700 leading-relaxed mb-8">
                {pageContent.pioneer.description}
              </p>

              <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
                {pageContent.pioneer.ideals.title}
              </h4>
              <p className="text-slate-700 leading-relaxed mb-6">
                {pageContent.pioneer.ideals.description}
              </p>

              <div className="space-y-4">
                {pageContent.pioneer.ideals.content.map((paragraph, index) => (
                  <p key={index} className="text-slate-700 leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-lg transform rotate-6 opacity-20"></div>
                <div
                  className="absolute inset-0 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-red-600 bg-opacity-85 rounded-lg flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">600+</div>
                    <div className="text-sm">míst po celé republice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
              {pageContent.history.title}
            </h3>
            <p className="text-slate-700 leading-relaxed text-justify">
              {pageContent.history.content}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-2">2014</div>
                <div className="text-sm text-gray-600">Oficiální vznik skupiny</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-2">1990</div>
                <div className="text-sm text-gray-600">Obnovená činnost</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-2">1961</div>
                <div className="text-sm text-gray-600">Původní založení</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}