// app/components/Hero/slides.ts
export interface HeroSlide {
  image: string
  badge: string
  title: string
  subtitle: string
  cta: string
  to: string
  /* zaxira (rasm yuklanmasa) fon gradienti */
  fallback: string
}

export const heroSlides: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    badge: '🔥 Katta chegirma',
    title: 'Mavsumiy savdo — 50% gacha',
    subtitle: 'Eng sara mahsulotlar eng arzon narxlarda',
    cta: 'Xarid qilish',
    to: '/',
    fallback: 'linear-gradient(120deg, #065f46 0%, #008236 60%, #16a34a 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    badge: '🚚 Bepul yetkazib berish',
    title: 'Tezkor buyurtma xizmati',
    subtitle: 'Buyurtmangiz bir kun ichida eshigingizda',
    cta: 'Buyurtma berish',
    to: '/',
    fallback: 'linear-gradient(120deg, #0f3d2e 0%, #166534 55%, #15803d 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    badge: '✨ Yangi kolleksiya',
    title: 'Yangi kelgan mahsulotlar',
    subtitle: 'Eng so‘nggi modellar va trendlar bir joyda',
    cta: 'Ko‘rish',
    to: '/',
    fallback: 'linear-gradient(120deg, #052e16 0%, #14532d 50%, #008236 100%)',
  },
  {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    badge: '🎁 Maxsus takliflar',
    title: 'Har kuni yangi aksiyalar',
    subtitle: 'Kuningizni foydali xaridlar bilan boshlang',
    cta: 'Aksiyalar',
    to: '/',
    fallback: 'linear-gradient(120deg, #022c22 0%, #065f46 50%, #16a34a 100%)',
  },
]
