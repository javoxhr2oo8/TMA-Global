<script setup lang="ts">
import AppSwiper from '~/components/UI/AppSwiper.vue';
</script>

<template>
    <div>
        <Header/>
        <AppSwiper v-if="false"/>
        <Categories/>
        <Main/>
    </div>
</template>