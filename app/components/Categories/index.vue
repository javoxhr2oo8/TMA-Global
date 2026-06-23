<script setup lang="ts">
const { activeCategory, setCategory } = useCategory()
const { hapticImpact } = useTelegram()

// 'Barchasi' har doim birinchi va default tanlov; qolganlari yagona manbadan keladi.
const categories = [
    { id: 0, label: 'Barchasi', icon: 'fa-solid fa-border-all' },
    ...productCategories
]

function onCategoryClick(label: string) {
    hapticImpact('light')
    setCategory(label)
}
</script>

<template>
    <div class="container categories-container select-none">
        <div class="w-full">
            <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-1">
                <button v-for="cat in categories" :key="cat.id" @click="onCategoryClick(cat.label)" :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-all duration-200 whitespace-nowrap shadow-sm select-none',
                    activeCategory === cat.label
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-emerald-600 text-white shadow-md shadow-green-600/20'
                        : 'bg-gradient-to-b from-white to-gray-50/50 border-gray-100 text-gray-700'
                ]">
                    <i :class="[
                        cat.icon,
                        'text-[14px] transition-colors duration-200',
                        activeCategory === cat.label ? 'text-white' : 'text-green-600'
                    ]"></i>

                    <span class="tracking-wide">{{ cat.label }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.categories-container {
    padding: 10px 0;
    width: 100%;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>