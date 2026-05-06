type ColorMode = 'light' | 'dark'
type Preference = ColorMode | 'system'

const STORAGE_KEY = 'color-mode'
const preference = ref<Preference>('system')
const value = ref<ColorMode>('light')

function getSystemTheme(): ColorMode {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light'
}

function applyTheme(mode: ColorMode) {
    value.value = mode
    document.documentElement.classList.toggle('dark', mode === 'dark')
}

function setPreference(pref: Preference) {
    preference.value = pref
    localStorage.setItem(STORAGE_KEY, pref)
    applyTheme(pref === 'system' ? getSystemTheme() : pref)
}

export function useColorMode() {
    const isDark = computed(() => value.value === 'dark')

    onMounted(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Preference | null
        preference.value = saved ?? 'system'
        applyTheme(preference.value === 'system' ? getSystemTheme() : preference.value)

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (preference.value === 'system')
                    applyTheme(e.matches ? 'dark' : 'light')
            })
    })

    return { preference, value, isDark, setPreference }
}