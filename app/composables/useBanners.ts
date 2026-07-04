// app/composables/useBanners.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { getDb } from './useFirebase'

export interface Banner {
  id: string
  badge: string
  title: string
  subtitle: string
  image: string
  order: number
  active: boolean
  createdAt: any
}

const COLLECTION = 'banners'

// Dastlabki 4 ta banner — Firebase bo'sh bo'lsa avtomatik yoziladi
const DEFAULTS = [
  {
    badge: '🔥 Katta chegirma',
    title: 'Mavsumiy savdo — 50% gacha',
    subtitle: 'Eng sara mahsulotlar eng arzon narxlarda',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: '🚚 Bepul yetkazib berish',
    title: 'Tezkor buyurtma xizmati',
    subtitle: 'Buyurtmangiz bir kun ichida eshigingizda',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: '✨ Yangi kolleksiya',
    title: 'Yangi kelgan mahsulotlar',
    subtitle: "Eng so'nggi modellar va trendlar bir joyda",
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    badge: '🎁 Maxsus takliflar',
    title: 'Har kuni yangi aksiyalar',
    subtitle: 'Kuningizni foydali xaridlar bilan boshlang',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
  },
]

const banners = ref<Banner[]>([])
const loading = ref(false)
const loaded = ref(false)
let unsub: Unsubscribe | null = null
let seeded = false

function sortBanners(items: any[]): Banner[] {
  return [...items].sort((a, b) => {
    const oa = a.order ?? 9999
    const ob = b.order ?? 9999
    if (oa !== ob) return oa - ob
    const ta = a.createdAt?.seconds ?? a.createdAt ?? 0
    const tb = b.createdAt?.seconds ?? b.createdAt ?? 0
    return ta - tb
  })
}

function normalize(d: any): Banner {
  return {
    id: d.id,
    badge: d.badge ?? '',
    title: d.title ?? '',
    subtitle: d.subtitle ?? '',
    image: d.image ?? '',
    order: d.order ?? 9999,
    active: d.active !== false,
    createdAt: d.createdAt ?? null,
  }
}

async function seedIfEmpty() {
  if (seeded) return
  seeded = true
  const db = getDb()
  const snap = await getDocs(collection(db, COLLECTION))
  if (snap.size > 0) return

  for (let i = 0; i < DEFAULTS.length; i++) {
    await addDoc(collection(db, COLLECTION), {
      ...DEFAULTS[i],
      order: i + 1,
      active: true,
      createdAt: serverTimestamp(),
    })
  }
  console.log('[Banners] 4 ta default banner Firebase\'ga yozildi ✓')
}

export const useBanners = () => {
  const listen = () => {
    if (unsub) return
    loading.value = true

    seedIfEmpty().finally(() => {
      const colRef = collection(getDb(), COLLECTION)
      unsub = onSnapshot(colRef, (snap) => {
        banners.value = sortBanners(snap.docs.map((d) => normalize({ id: d.id, ...d.data() })))
        loading.value = false
        loaded.value = true
      }, (err) => {
        console.error('[Banners] xato:', err)
        loading.value = false
      })
    })
  }

  const activeBanners = computed(() => banners.value.filter((b) => b.active))

  const nextOrder = computed(() => {
    if (banners.value.length === 0) return 1
    return Math.max(...banners.value.map((b) => b.order ?? 0)) + 1
  })

  const load = async () => {
    loading.value = true
    try {
      await seedIfEmpty()
      const snap = await getDocs(collection(getDb(), COLLECTION))
      banners.value = sortBanners(snap.docs.map((d) => normalize({ id: d.id, ...d.data() })))
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Record<string, any>) => {
    await addDoc(collection(getDb(), COLLECTION), {
      badge: data.badge || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      image: data.image || '',
      order: data.order ?? nextOrder.value,
      active: data.active !== false,
      createdAt: serverTimestamp(),
    })
    await load()
  }

  const update = async (id: string, data: Record<string, any>) => {
    const { id: _, createdAt, ...rest } = data
    await updateDoc(doc(getDb(), COLLECTION, id), rest)
    await load()
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(getDb(), COLLECTION, id))
    banners.value = banners.value.filter((b) => b.id !== id)
  }

  return { banners, activeBanners, loading, loaded, nextOrder, listen, load, create, update, remove }
}
