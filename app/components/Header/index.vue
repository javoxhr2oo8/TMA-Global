<script setup lang="ts">
import Button from '~/components/UI/Button.vue';
const { isDark, setPreference } = useColorMode()

function toggle() {
  setPreference(isDark.value ? 'light' : 'dark')
}
</script>

<template>
    <header>
        <div class="container">
            <div class="header-wrapper flex items-center justify-between">
                <div class="logo">
                    <div class="flex items-center gap-[10px] text-[30px]">
                        <i class="fa-solid fa-globe text-blue-600"></i>
                        <h2 class="dark:text-white font-semibold">Global TMA</h2>
                    </div>
                </div>

                <div class="profile-image w-[45px] h-[45px] flex items-center">
                    <button class="text-[25px]" @click="toggle()"><i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i></button>
                    <img class="rounded-[50%] border-2 border-solid dark:border-white"
                        src="https://yt3.googleusercontent.com/r0N4Sbmx37gzhs8htds1sNzRs6CX-o8gqqe_ZOUI3QxcvZT2akDAbFiz-c1s3UlWmikU2mwNAQ=s900-c-k-c0x00ffffff-no-rj"
                        alt="">

                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.profile-image {
    transition: all .2s ease;
}

.profile-image:active {
    transform: scale(97%);
}

.header-wrapper {
    padding: 10px;
}
</style>