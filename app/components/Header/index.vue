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
                        <img src="../../assets/images/png/Logo2.png" alt="">
                    </div>
                </div>

                <div class="profile-image w-[45px] h-[45px] flex items-center">
                    <!-- <button class="text-[25px]" @click="toggle()"><i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i></button> -->
                    <img class="rounded-[50%] border-2 border-solid dark:border-white"
                        src="https://www.clipartmax.com/png/full/258-2582267_circled-user-male-skin-type-1-2-icon-male-user-icon.png"
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

.logo img {
    width: 200px;
}
</style>