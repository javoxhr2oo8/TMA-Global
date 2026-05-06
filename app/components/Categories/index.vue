<script setup lang="ts">
import { ref } from 'vue'

const categories = [
    { id: 1, label: 'Barchasi' },
    { id: 2, label: 'Kiyimlar' },
    { id: 3, label: 'Uskunalar' },
    { id: 4, label: 'Oziq ovqatlar' },
    { id: 5, label: 'Xoz tovarlar' },
]

const activeId = ref(1)
</script>

<template>
    <div class="categories">
        <div class="container">
            <div class="categories-wrapper">
                <nav>
                    <ul class="flex items-center gap-[8px] overflow-x-auto scrollbar-hide py-1">
                        <li v-for="cat in categories" :key="cat.id" @click="activeId = cat.id" :class="[
                            'cursor-pointer px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 select-none',
                            activeId === cat.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-blue-400 hover:text-blue-500'
                        ]" :style="activeId !== cat.id ? { background: 'rgba(37, 99, 235, 0.1)' } : {}">
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