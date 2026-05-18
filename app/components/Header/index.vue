<script setup lang="ts">
import Button from '~/components/UI/Button.vue';
const { isDark, setPreference } = useColorMode()
const { user, hapticImpact } = useTelegram()

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

                <NuxtLink to="/profile" @click="hapticImpact('light')">
                    <div class="profile-image w-[60px] h-[60px] flex items-center">
                        <!-- <button class="text-[25px]" @click="toggle()"><i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i></button> -->
                        <img v-if="user?.photo_url" :src="user.photo_url" alt="User Avatar"
                            class="user-avatar rounded-full border-4 border-[#008236] object-cover"
                            @error="(e: Event) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/40')" />
                        <img v-else
                            src="https://cdn3.iconfinder.com/data/icons/basicolor-essentials/24/051_user_profile_avatar-1024.png"
                            alt="" class=" rounded-full border-4 border-[#008236] object-cover">

                    </div>
                </NuxtLink>
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