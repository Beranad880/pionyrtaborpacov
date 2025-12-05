import { siteData } from '@/data/content';

export default function ContactSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Základní informace o Pionýrské skupině
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2586.8!2d15.0!3d49.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDMwJzAwLjAiTiAxNcKwMDAnMDAuMCJF!5e0!3m2!1scs!2scz!4v1000000000000!5m2!1scs!2scz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa - Pionýrská skupina Pacov"
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Pionýr, z.s. - Pionýrská skupina Pacov</h3>
                  <p className="text-slate-700">{siteData.contact.address}</p>
                </div>
              </div>

              {/* Bank Account */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Číslo účtu</h3>
                  <p className="text-slate-700">{siteData.contact.bankAccount}</p>
                </div>
              </div>

              {/* Company Info */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Identifikační údaje</h3>
                  <p className="text-slate-700">IČ: {siteData.contact.ico}</p>
                  <p className="text-slate-700">DIČ: {siteData.contact.dic}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Information */}
          <div className="mt-16 bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Vedení skupiny</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Vedoucí PS:</h4>
                <p className="text-slate-700 text-sm">{siteData.leadership.leader}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Hospodář PS:</h4>
                <p className="text-slate-700 text-sm">{siteData.leadership.treasurer}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Revizor PS:</h4>
                <p className="text-slate-700 text-sm">{siteData.leadership.auditor}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Delegáti PS – členové KRP:</h4>
                <ul className="text-slate-700 text-sm space-y-1">
                  {siteData.leadership.delegates.map((delegate, index) => (
                    <li key={index}>{delegate}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Delegát PS krajské schůze delegátů:</h4>
                <p className="text-slate-700 text-sm">{siteData.leadership.delegates[0]}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="border-t pt-8">
              <h4 className="text-xl font-bold text-slate-800 mb-6">Věkové složení skupiny (2025)</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {siteData.statistics.ageGroups.map((group, index) => (
                  <div key={index} className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-1">{group.count}</div>
                    <div className="text-xs text-slate-600">{group.range}</div>
                  </div>
                ))}
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full">
                  <span className="text-3xl font-bold text-white">{siteData.statistics.total}</span>
                </div>
                <p className="text-lg font-semibold text-slate-800 mt-2">Celkem členů</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-800 mb-1">{siteData.statistics.councilMembers}</div>
                  <div className="text-sm text-slate-600">Členů rady PS</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-800 mb-1">{siteData.statistics.leadershipMembers}</div>
                  <div className="text-sm text-slate-600">Členů vedení PS</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-800 mb-1">{siteData.statistics.krpDelegates}</div>
                  <div className="text-sm text-slate-600">Delegátů do KRP</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-800 mb-1">{siteData.statistics.foundedGroups}</div>
                  <div className="text-sm text-slate-600">Založených oddílů</div>
                </div>
              </div>
            </div>

            {/* Financial Report */}
            <div className="mt-8 text-center">
              <a
                href="/files/hospodárení-2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                Hospodaření rok 2025
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}