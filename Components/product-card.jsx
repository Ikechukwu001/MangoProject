"use client"

export function ProductCard({ name, price, description, discount, badges, image }) {
  return (
    <div className="w-80 bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Image Container with padding */}
      <div className="relative p-4 bg-white">
        <div className="rounded-2xl overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-80 object-cover" />
        </div>
        {/* Discount Badge */}
        <div className="absolute top-8 left-8 bg-amber-700/40 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
          {discount}
        </div>
        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-semibold">₹{price}</div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>

        <div className="flex gap-2 mb-6">
          <div className="px-4 py-2 border bg-white border-gray-300 rounded-full text-sm font-bold text-black">
            {badges.label1}
          </div>
          <div className="px-4 py-2 border bg-white border-gray-300 rounded-full text-sm font-bold text-black">
            {badges.label2}
          </div>
        </div>

        <button className="w-full bg-amber-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-full transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
