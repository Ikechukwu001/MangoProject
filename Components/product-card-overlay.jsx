"use client"

export function ProductCardOverlay({ name, price, description, discount, badges, image }) {
  return (
    <div className="w-80 bg-amber-500 rounded-3xl shadow-2xl overflow-hidden">
      {/* Image Container with Overlay */}
      <div className="relative h-96">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-gray-900/60"></div>

        {/* Discount Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
          {discount}
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-4xl font-bold text-white">{name}</h3>
            <div className="bg-gray-900/70 text-white px-3 py-1 rounded-full text-sm font-semibold">₹{price}</div>
          </div>

          <p className="text-white/90 text-sm mb-6 leading-relaxed">{description}</p>

          <div className="flex gap-2 mb-6">
            <div className="text-black px-2 py-2 bg-white text-sm font-bold rounded-full">{badges.label1}</div>
            <div className="text-black px-2 py-2 bg-white text-sm font-bold rounded-full">{badges.label2}</div>
          </div>

          <button className="w-full bg-white hover:bg-gray-50 text-black font-bold py-3 rounded-full transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
