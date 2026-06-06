<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'

const { activeCategory, setCategory } = useCategory()
const { hapticImpact } = useTelegram()

const categories = [
    { id: 1, label: 'Barchasi' },
    { id: 2, label: 'Kiyimlar' },
    { id: 3, label: 'Uskunalar' },
    { id: 4, label: 'Oziq ovqatlar' },
    { id: 5, label: 'Xoz tovarlar' },
]

// Har bir bo'lim nomiga mos turkumlar — ustiga bosilganda ochiladi
const subOptions: Record<string, string[]> = {
    Kiyimlar: [
        'Erkaklar kiyimi',
        'Ayollar kiyimi',
        'Bolalar kiyimi',
        'Poyabzal',
        'Sport kiyimlari',
        'Aksessuarlar',
    ],
    Uskunalar: [
        'Telefonlar',
        'Noutbuklar',
        'Planshetlar',
        'Quloqchin va audio',
        'Smart soatlar',
        'Televizorlar',
        "O'yin texnikasi",
        'Aksessuarlar',
    ],
    'Oziq ovqatlar': [
        'Ichimliklar',
        'Shirinliklar',
        'Sut mahsulotlari',
        'Non va pishiriqlar',
        'Meva-sabzavotlar',
        'Konservalar',
        'Choy va qahva',
    ],
    'Xoz tovarlar': [
        'Tozalash vositalari',
        'Idish-tovoqlar',
        'Uy tekstili',
        'Maishiy texnika',
        'Yoritish',
        "Bog' va hovli",
    ],
}

function hasSubs(label: string) {
    return (subOptions[label]?.length ?? 0) > 0
}

// --- Dropdown holati ---
const subPick = ref('') // tanlangan turkum (UI uchun)
const openLabel = ref<string | null>(null) // qaysi bo'lim ochiq
const panelStyle = ref<Record<string, string>>({})
const triggerEls = ref<Record<string, HTMLElement | null>>({})
const panelEl = ref<HTMLElement | null>(null)

function setTriggerRef(label: string, el: any) {
    triggerEls.value[label] = (el as HTMLElement) ?? null
}

const openSubs = computed(() =>
    openLabel.value ? subOptions[openLabel.value] ?? [] : []
)

function computePosition() {
    if (!import.meta.client || !openLabel.value) return
    const trig = triggerEls.value[openLabel.value]
    if (!trig) return
    const r = trig.getBoundingClientRect()
    const spaceBelow = window.innerHeight - r.bottom
    const spaceAbove = r.top
    const up = spaceBelow < 240 && spaceAbove > spaceBelow

    const width = Math.max(Math.round(r.width), 190)
    let left = Math.round(r.left)
    const maxLeft = window.innerWidth - width - 8
    if (left > maxLeft) left = Math.max(8, maxLeft)
    if (left < 8) left = 8

    const s: Record<string, string> = {
        position: 'fixed',
        left: `${left}px`,
        width: `${width}px`,
        zIndex: '70',
    }
    if (up) {
        s.bottom = `${Math.round(window.innerHeight - r.top + 8)}px`
        s.maxHeight = `${Math.min(300, spaceAbove - 12)}px`
    } else {
        s.top = `${Math.round(r.bottom + 8)}px`
        s.maxHeight = `${Math.min(300, spaceBelow - 12)}px`
    }
    panelStyle.value = s
}

function openMenu(label: string) {
    openLabel.value = label
    nextTick(() => {
        computePosition()
        document.addEventListener('click', onDocClick, true)
        window.addEventListener('scroll', computePosition, true)
        window.addEventListener('resize', computePosition)
    })
}

function closeMenu() {
    if (!openLabel.value) return
    openLabel.value = null
    document.removeEventListener('click', onDocClick, true)
    window.removeEventListener('scroll', computePosition, true)
    window.removeEventListener('resize', computePosition)
}

function onDocClick(e: MouseEvent) {
    const t = e.target as Node
    if (panelEl.value?.contains(t)) return
    const trig = openLabel.value ? triggerEls.value[openLabel.value] : null
    if (trig?.contains(t)) return
    closeMenu()
}

function onPillClick(label: string) {
    hapticImpact('light')
    if (activeCategory.value !== label) {
        setCategory(label)
        subPick.value = '' // yangi bo'lim → turkum tozalanadi
    }
    if (!hasSubs(label)) {
        closeMenu()
        return
    }
    openLabel.value === label ? closeMenu() : openMenu(label)
}

function chooseSub(sub: string) {
    hapticImpact('light')
    subPick.value = sub
    closeMenu()
}

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocClick, true)
    window.removeEventListener('scroll', computePosition, true)
    window.removeEventListener('resize', computePosition)
})
</script>

<template>
    <div class="categories">
        <div class="container">
            <div class="categories-wrapper">
                <nav>
                    <ul class="flex items-center gap-[8px] overflow-x-auto scrollbar-hide py-1">
                        <li v-for="cat in categories" :key="cat.id"
                            :ref="(el) => setTriggerRef(cat.label, el)"
                            @click="onPillClick(cat.label)" :class="[
                                'flex items-center cursor-pointer px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 select-none',
                                activeCategory === cat.label
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-green-600 hover:text-green-500',
                                openLabel === cat.label ? 'ring-2 ring-green-300/70' : ''
                            ]" :style="activeCategory !== cat.label ? { background: 'rgba(37, 99, 235, 0.1)' } : {}">
                            <span>{{ cat.label }}</span>
                            <i v-if="hasSubs(cat.label)"
                                class="fa-solid fa-chevron-down text-[10px] ml-1.5 transition-transform duration-200"
                                :class="openLabel === cat.label ? 'rotate-180' : 'opacity-80'"></i>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Turkumlar dropdown'i (yashil tema, pill ranglariga mos) -->
        <Teleport to="body">
            <Transition name="cat-menu">
                <ul v-if="openLabel" ref="panelEl" :style="panelStyle"
                    class="cat-menu-panel overflow-y-auto rounded-2xl border border-green-200 bg-white py-1.5 shadow-xl shadow-black/25">
                    <!-- "Hammasi" -->
                    <li @click="chooseSub('')" :class="[
                        'mx-1.5 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium cursor-pointer transition-colors select-none',
                        subPick === '' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'
                    ]">
                        <span class="truncate">Hammasi</span>
                        <i v-if="subPick === ''" class="fa-solid fa-check text-[11px]"></i>
                    </li>
                    <!-- Turkumlar -->
                    <li v-for="(s, i) in openSubs" :key="i" @click="chooseSub(s)" :class="[
                        'mx-1.5 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium cursor-pointer transition-colors select-none',
                        subPick === s ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'
                    ]">
                        <span class="truncate">{{ s }}</span>
                        <i v-if="subPick === s" class="fa-solid fa-check text-[11px]"></i>
                    </li>
                </ul>
            </Transition>
        </Teleport>
    </div>
</template>

<style>
.categories {
    padding: 12px 0;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Dropdown ochilish/yopilish animatsiyasi */
.cat-menu-enter-active,
.cat-menu-leave-active {
    transition: opacity 0.16s ease, transform 0.16s ease;
}

.cat-menu-enter-from,
.cat-menu-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}

/* Ingichka, yashil scrollbar */
.cat-menu-panel {
    scrollbar-width: thin;
    scrollbar-color: rgba(22, 163, 74, 0.35) transparent;
}

.cat-menu-panel::-webkit-scrollbar {
    width: 6px;
}

.cat-menu-panel::-webkit-scrollbar-thumb {
    background: rgba(22, 163, 74, 0.35);
    border-radius: 9999px;
}
</style>
