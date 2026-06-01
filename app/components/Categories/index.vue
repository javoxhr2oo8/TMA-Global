<script setup lang="ts">
const { activeCategory, setCategory } = useCategory()
const { hapticImpact } = useTelegram()

const categories = [
    { id: 1, label: 'Barchasi' },
    { id: 2, label: 'Kiyimlar' },
    { id: 3, label: 'Uskunalar' },
    { id: 4, label: 'Oziq ovqatlar' },
    { id: 5, label: 'Xoz tovarlar' },
]

function select(label: string) {
    setCategory(label)
    hapticImpact('light')
}
</script>

<template>
    <div class="categories">
        <div class="container">
            <div class="categories-wrapper">
                <nav>
                    <ul class="flex items-center gap-[8px] overflow-x-auto scrollbar-hide py-1">
                        <li v-for="cat in categories" :key="cat.id" @click="select(cat.label)" :class="[
                            'cursor-pointer px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 select-none',
                            activeCategory === cat.label
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-green-600 hover:text-green-500'
                        ]" :style="activeCategory !== cat.label ? { background: 'rgba(37, 99, 235, 0.1)' } : {}">
                            {{ cat.label }}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
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
</style>
