"use client";

import Image from "next/image";

const Landing = () => {
  // لما المستخدم يضغط على الزر
  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight, // ينزل بمقدار ارتفاع الشاشة
      behavior: "smooth", // نزول ناعم
    });
  };

  return (
    <section className="w-full min-h-[80vh] bg-[#b8b8b8dc] flex items-center justify-center">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* النص */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Discover the Latest Fashion
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-md">
            Shop the newest trends in clothing, shoes, and accessories. Style
            yourself with confidence and express your vibe.
          </p>

          <button
            onClick={handleScroll}
            className="px-8 py-3 bg-[#ffc400] text-gray-900 font-semibold rounded-lg shadow hover:bg-[#ccca5f] transition duration-300"
          >
            Shop Now
          </button>
        </div>

        {/* الصورة */}
        <div className="hidden md:flex justify-center items-center">
          <Image
            src="/jacket_landing.png"
            alt="Fashion Model"
            width={500}
            height={500}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;