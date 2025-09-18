import React from 'react';

const OurStoryPage: React.FC = () => {
  return (
    <div>
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/store-banner/1600/900')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white text-center">Our Story</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">From a Simple Idea to Your Favorite Store</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              BWS Mart started in a small garage with a big idea: to make high-quality products accessible to everyone, everywhere. We were tired of the hassle of traditional shopping and knew there had to be a better way. We envisioned a single online destination where customers could find everything they need, from daily essentials to the latest tech, all delivered with exceptional service.
            </p>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Journey</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                <TimelineItem year="2020" title="The Spark" description="BWS Mart is born! Our founders launch the first version of the website from their garage, shipping the first 100 orders themselves." />
                <TimelineItem year="2021" title="Growing Fast" description="We move into our first official warehouse and expand our catalog to over 10,000 products. Our team grows to 50 dedicated members." />
                <TimelineItem year="2022" title="Innovation" description="Launched our mobile app, making shopping on the go easier than ever. Reached 1 million satisfied customers." />
                <TimelineItem year="2024" title="Looking Ahead" description="We continue to innovate, focusing on sustainable practices and expanding our reach to serve even more communities." />
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission & Values</h3>
              <p className="text-gray-600 mb-4">Our mission is to simplify your life by providing a seamless and enjoyable shopping experience. We are guided by three core principles:</p>
              <ul className="space-y-3">
                <ValueItem title="Customer Obsession" description="We start with the customer and work backwards. We work vigorously to earn and keep customer trust." />
                <ValueItem title="Passion for Innovation" description="We are never satisfied with the status quo. We constantly invent and improve to create a better experience for our customers." />
                <ValueItem title="Commitment to Quality" description="We are committed to offering only the highest quality products and services. We stand behind everything we sell." />
              </ul>
            </div>
            <img src="https://picsum.photos/seed/team-photo/600/400" alt="BWS Mart Team" className="rounded-lg shadow-xl" />
          </section>
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{ year: string; title: string; description: string }> = ({ year, title, description }) => (
    <div className="relative flex items-center">
        <div className="hidden md:block w-1/2 pr-8 text-right">
            <h4 className="font-bold text-lg text-orange-500">{year}</h4>
            <h5 className="font-semibold text-xl mt-1">{title}</h5>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <div className="absolute left-1/2 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 border-4 border-white"></div>
        <div className="md:hidden w-full pl-8">
            <h4 className="font-bold text-lg text-orange-500">{year}</h4>
            <h5 className="font-semibold text-xl mt-1">{title}</h5>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    </div>
);

const ValueItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <div>
            <h6 className="font-semibold">{title}</h6>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </li>
);

export default OurStoryPage;
