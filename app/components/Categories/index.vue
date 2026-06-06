<script setup lang="ts">
const { activeCategory, setCategory } = useCategory()
const { hapticImpact } = useTelegram()

const categories = [
    { id: 1, label: 'Barchasi', icon: 'fa-solid fa-border-all' },
    { id: 2, label: 'Elektronika', icon: 'fa-solid fa-laptop-code' },
    { id: 3, label: 'Kiyim va poyabzal', icon: 'fa-solid fa-shirt' },
    { id: 4, label: 'Oziq-ovqat', icon: 'fa-solid fa-basket-shopping' },
    { id: 5, label: 'Uy va roʻzgʻor', icon: 'fa-solid fa-couch' },
    { id: 6, label: 'Bolalar dunyosi', icon: 'fa-solid fa-baby-carriage' },
    { id: 7, label: 'Sport va xobbi', icon: 'fa-solid fa-person-running' }
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
                <button
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="onCategoryClick(cat.label)"
                    :class="[
                        'flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 shadow-sm',
                        activeCategory === cat.label
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-emerald-600 text-white shadow-md shadow-green-600/20'
                            : 'bg-gradient-to-b from-white to-gray-50/50 border-gray-100 text-gray-700 hover:border-gray-200 hover:text-green-600 active:bg-gray-100'
                    ]"
                >
                    <i 
                        :class="[
                            cat.icon, 
                            'text-[14px] transition-colors duration-200',
                            activeCategory === cat.label ? 'text-white' : 'text-green-600'
                        ]"
                    ></i>

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