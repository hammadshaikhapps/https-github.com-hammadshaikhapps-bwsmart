import React from 'react';

const PressPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Press & Media</h1>
          <p className="text-gray-600 mt-2">Information for journalists, bloggers, and media professionals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">In the News</h2>
              <div className="space-y-6">
                <NewsArticle
                  source="TechCrunch"
                  title="BWS Mart Secures $50M in Series B Funding to Fuel Expansion"
                  date="June 15, 2024"
                  link="#"
                />
                <NewsArticle
                  source="Forbes"
                  title="How BWS Mart is Redefining the Customer Experience in E-commerce"
                  date="May 28, 2024"
                  link="#"
                />
                <NewsArticle
                  source="Bloomberg"
                  title="The Sustainable Supply Chain: A Look Inside BWS Mart's Operations"
                  date="April 10, 2024"
                  link="#"
                />
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Media Contact</h3>
                <p className="font-semibold">Jane Doe</p>
                <p className="text-gray-600">Head of Communications</p>
                <a href="mailto:press@bwsmart.com" className="text-orange-600 hover:underline">press@bwsmart.com</a>
            </div>
             <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Media Kit</h3>
                <p className="text-gray-600 mb-4">Download our brand assets, logos, and executive photos.</p>
                <button className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600">
                    Download Kit (.zip)
                </button>
            </div>
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Press Releases</h2>
          <div className="space-y-4">
            <PressRelease
              date="June 1, 2024"
              title="BWS Mart Launches Same-Day Delivery in Major Metropolitan Areas"
            />
            <PressRelease
              date="May 5, 2024"
              title="BWS Mart Announces Partnership with Eco-Friendly Packaging Solutions"
            />
             <PressRelease
              date="April 2, 2024"
              title="New AI-Powered Recommendation Engine Enhances Shopping on BWS Mart"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

const NewsArticle: React.FC<{ source: string; title: string; date: string; link: string }> = ({ source, title, date, link }) => (
    <div className="border-b pb-4">
        <p className="text-sm font-semibold text-gray-500">{source} • {date}</p>
        <a href={link} className="text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors">{title}</a>
    </div>
);

const PressRelease: React.FC<{ date: string; title: string; }> = ({ date, title }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start">
        <div className="mb-2 sm:mb-0">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{date}</p>
        </div>
        <a href="#" className="text-orange-600 hover:underline font-semibold text-sm flex-shrink-0">Read More →</a>
    </div>
);

export default PressPage;
