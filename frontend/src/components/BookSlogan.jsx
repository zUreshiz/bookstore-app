import React from "react";
import { FaBook, FaShippingFast, FaUndo, FaHeadset } from "react-icons/fa";

const BookSlogan = () => {
  const features = [
    {
      icon: <FaBook className="w-12 h-12" />,
      title: "Vast Collection",
      description: "Over 10,000 books across all genres",
    },
    {
      icon: <FaShippingFast className="w-12 h-12" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $35",
    },
    {
      icon: <FaUndo className="w-12 h-12" />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <FaHeadset className="w-12 h-12" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-20">
      {/* Main Slogan */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
          Discover Your Next
          <span className="text-blue-600 mx-3 inline-block animate-float">
            Great Read
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your journey through countless worlds begins with turning a single page. Find
          your perfect story today.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                       transform hover:-translate-y-2">
              <div className="text-blue-600 mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Books" },
            { number: "5K+", label: "Active Readers" },
            { number: "1K+", label: "Authors" },
            { number: "100+", label: "Daily Orders" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <a
          href="/books"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold
                   hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300
                   shadow-lg hover:shadow-xl">
          Start Reading Today
        </a>
      </div>
    </div>
  );
};

// Add floating animation
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(styles);

export default BookSlogan;
