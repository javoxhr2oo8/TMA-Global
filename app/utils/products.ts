// app/utils/products.ts

export interface DemoProduct {
  id: number
  title: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  category: string
  image: string
  images?: string[]
  badge?: string
  isDeliveryFree?: boolean
  quantity?: number
  desc?: string
  brand?: string
}

export const demoProducts: DemoProduct[] = [
  {
    id: 1,
    title: 'Nike Air Max 270 React ENG кроссовки',
    price: 1_250_000,
    oldPrice: 1_800_000,
    rating: 4.5,
    reviewCount: 238,
    category: 'Kiyimlar',
    brand: 'Nike',
    image: 'https://avatars.mds.yandex.net/get-mpic/11771522/2a000001957ef635e9998504c280688c16aa/orig',
    badge: 'Хит',
    isDeliveryFree: true,
    quantity: 7,
    desc: 'Кроссовки Nike Air Max 270 React ENG сочетают в себе стиль и комфорт. Верх из легкого материала обеспечивает вентиляцию, а амортизационная система Air Max 270 React гарантирует мягкую посадку и поддержку на протяжении всего дня.',
  },
  {
    id: 2,
    title: 'Samsung Galaxy A55 5G 8/256GB',
    price: 4_990_000,
    oldPrice: 5_500_000,
    rating: 4,
    reviewCount: 95,
    category: 'Uskunalar',
    brand: 'Samsung',
    image: 'https://avatars.mds.yandex.net/i?id=f32cc4878317e7bf2f7619f2b6c59e2f8197efa6-10841731-images-thumbs&n=13',
    isDeliveryFree: false,
    quantity: 3,
  },
  {
    id: 3,
    title: 'Adidas Ultraboost 22 Running Shoes',
    price: 980_000,
    rating: 5,
    reviewCount: 412,
    category: 'Kiyimlar',
    brand: 'Adidas',
    image: 'https://avatars.mds.yandex.net/i?id=0359f7850750ad34045d50aeb9117ba2b397378e-12923554-images-thumbs&n=13',
    badge: 'Новинка',
    isDeliveryFree: true,
    quantity: 8,
  },
  {
    id: 4,
    title: 'Apple AirPods Pro 2nd Generation',
    price: 3_200_000,
    oldPrice: 3_800_000,
    rating: 4.5,
    reviewCount: 178,
    category: 'Uskunalar',
    brand: 'Apple',
    image: 'https://www.obstore.ru/upload/iblock/acc/qano738sjrtwqdge0o5bqfz1bp1ovezr.jpg',
    isDeliveryFree: true,
  },
  {
    id: 5,
    title: 'Apple watch Ultra 49mm',
    price: 1_250_000,
    oldPrice: 1_800_000,
    rating: 4.5,
    reviewCount: 238,
    category: 'Uskunalar',
    brand: 'Apple',
    image: 'https://avatars.mds.yandex.net/i?id=43dadeb84fec312c658e3490629af1991a9c3564-6609300-images-thumbs&n=13',
    badge: 'Хит',
    isDeliveryFree: true,
    quantity: 5,
  },
  {
    id: 6,
    title: 'Ipad 9 gen 128gb',
    price: 4_990_000,
    oldPrice: 5_500_000,
    rating: 4,
    reviewCount: 95,
    category: 'Uskunalar',
    brand: 'Apple',
    image: 'https://i.ebayimg.com/images/g/Q10AAOSwTo1k1SoJ/s-l1600.jpg',
    isDeliveryFree: false,
    quantity: 7,
  },
  {
    id: 7,
    title: 'X box Series X 1TB Black Edition',
    price: 980_000,
    rating: 5,
    reviewCount: 412,
    category: 'Uskunalar',
    brand: 'Microsoft',
    image: 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/ccs/262622/WEJPWFNFUklFU1hfMjBfNzgwODM1Nzg4/b0.jpg',
    badge: 'Новинка',
    isDeliveryFree: true,
    quantity: 2,
  },
  {
    id: 8,
    title: 'PlayStation 5 Slim 825GB',
    price: 3_200_000,
    oldPrice: 3_800_000,
    rating: 4.5,
    reviewCount: 178,
    category: 'Uskunalar',
    brand: 'Sony',
    image: 'https://avatars.mds.yandex.net/get-mpic/5320264/2a00000191c3761f1e8d18bec236f3acb465/450x600',
    isDeliveryFree: true,
    quantity: 7,
  },
  {
    id: 9,
    title: 'Aralash quruq mevalar 1kg',
    price: 89_000,
    rating: 4.7,
    reviewCount: 64,
    category: 'Oziq ovqatlar',
    image: 'https://picsum.photos/seed/driedfruits/600/600',
    isDeliveryFree: false,
    quantity: 20,
  },
  {
    id: 10,
    title: "Tabiiy tog' asali 1kg",
    price: 120_000,
    oldPrice: 150_000,
    rating: 5,
    reviewCount: 132,
    category: 'Oziq ovqatlar',
    image: 'https://picsum.photos/seed/honey/600/600',
    badge: 'Хит',
    isDeliveryFree: true,
    quantity: 15,
  },
  {
    id: 11,
    title: "Universal tozalash vositasi to'plami",
    price: 45_000,
    rating: 4.3,
    reviewCount: 51,
    category: 'Xoz tovarlar',
    image: 'https://picsum.photos/seed/cleaning/600/600',
    isDeliveryFree: false,
    quantity: 30,
  },
  {
    id: 12,
    title: 'Kir yuvish kukuni 9kg',
    price: 175_000,
    oldPrice: 210_000,
    rating: 4.6,
    reviewCount: 88,
    category: 'Xoz tovarlar',
    image: 'https://picsum.photos/seed/laundry/600/600',
    badge: 'Новинка',
    isDeliveryFree: true,
    quantity: 12,
  },
]

export const findDemoProduct = (id: string | number): DemoProduct | null =>
  demoProducts.find((p) => String(p.id) === String(id)) ?? null
