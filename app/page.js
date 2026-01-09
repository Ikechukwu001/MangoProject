import { ProductCard } from "@/Components/product-card"
import { ProductCardOverlay } from "@/Components/product-card-overlay"

export default function Home() {
  const productData = {
    name: "Alphonso",
    price: 270,
    description: "Loved worldwide for their sweetness our Alphonso mangoes are a delicious delight wherever you are.",
    discount: "20% off",
    badges: {
      label1: "Best Seller",
      label2: "9 left",
    },
    image: "/MangoImg.jpg",
  }

  return (
<div className="min-h-screen bg-yellow-100 flex items-center justify-center p-6">
  <div
    className="flex flex-col md:flex-row gap-8 items-stretch justify-center max-w-5xlw-full"
  >
    {/* Left Card */}
    <div className="flex-1 min-w-70">
      <ProductCard {...productData} />
    </div>

    {/* Right Card */}
    <div className="flex-1 min-w-70">
      <ProductCardOverlay {...productData} />
    </div>
  </div>
</div>

  )
}
