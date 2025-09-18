import React from 'react';

const jobOpenings = {
  'Engineering': [
    { title: 'Senior Frontend Engineer', location: 'Dubai, AE (Remote)', type: 'Full-time' },
    { title: 'Backend Engineer (Node.js)', location: 'Dubai, AE', type: 'Full-time' },
    { title: 'DevOps Engineer', location: 'Remote', type: 'Full-time' },
  ],
  'Marketing': [
    { title: 'Digital Marketing Manager', location: 'Dubai, AE', type: 'Full-time' },
    { title: 'Content Strategist', location: 'Dubai, AE', type: 'Contract' },
  ],
  'Operations': [
    { title: 'Warehouse Manager', location: 'Dubai, AE', type: 'Full-time' },
    { title: 'Logistics Coordinator', location: 'Dubai, AE', type: 'Full-time' },
  ],
};

const CareersPage: React.FC = () => {
  return (
    <div>
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/office-life/1600/900')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-extrabold text-white">Join Our Team</h1>
          <p className="text-xl text-white mt-4 max-w-2xl">Be part of a company that's revolutionizing e-commerce. We're looking for passionate people to join our mission.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Work at BWS Mart?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We're more than just a workplace; we're a community. We believe in fostering an environment where creativity, innovation, and collaboration thrive. We invest in our employees' growth and well-being, because we know that our success is built on their talent and dedication.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <BenefitCard icon="💡" title="Innovation" description="Work on challenging problems and make a real impact with cutting-edge technology." />
          <BenefitCard icon="📈" title="Growth" description="We provide opportunities for professional development, mentorship, and career advancement." />
          <BenefitCard icon="❤️" title="Well-being" description="Enjoy comprehensive health benefits, flexible work arrangements, and a supportive culture." />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Open Positions</h2>
          <div className="space-y-10">
            {Object.entries(jobOpenings).map(([department, jobs]) => (
              <div key={department}>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">{department}</h3>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <JobListing key={index} {...job} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const JobListing: React.FC<{ title: string; location: string; type: string }> = ({ title, location, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center transition-shadow hover:shadow-xl">
        <div>
            <h4 className="text-xl font-bold text-gray-800">{title}</h4>
            <p className="text-gray-600 mt-1">{location} • {type}</p>
        </div>
        <button className="mt-4 sm:mt-0 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600">
            Apply Now
        </button>
    </div>
);

export default CareersPage;
