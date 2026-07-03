<!-- app/components/UI/RegistrationModal.vue -->
<script setup lang="ts">
const props = defineProps<{
  open: boolean
  saving: boolean
}>()

const emit = defineEmits<{
  submit: [data: { firstName: string; lastName: string; phone: string; address: string }]
}>()

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const address = ref('')
const errors = ref<Record<string, string>>({})

const formatPhone = (raw: string) => {
  // Faqat raqamlarni olish
  let digits = raw.replace(/\D/g, '')

  // 998 bilan boshlash
  if (digits.startsWith('998')) {
    // ok
  } else if (digits.startsWith('8') && digits.length > 1) {
    digits = '998' + digits.slice(1)
  } else if (digits.startsWith('9') && !digits.startsWith('998')) {
    digits = '998' + digits
  } else if (!digits.startsWith('998')) {
    digits = '998' + digits
  }

  // MAKSIMUM 12 raqam: 998 + 9 ta raqam
  digits = digits.slice(0, 12)

  // Formatlash: +998 (XX) XXX-XX-XX
  let formatted = '+998'
  const local = digits.slice(3) // 998 dan keyingi raqamlar

  if (local.length > 0) formatted += ' (' + local.slice(0, 2)
  if (local.length >= 2) formatted += ') '
  if (local.length > 2) formatted += local.slice(2, 5)
  if (local.length > 5) formatted += '-' + local.slice(5, 7)
  if (local.length > 7) formatted += '-' + local.slice(7, 9)

  return formatted
}

const onPhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart || 0
  const prevLen = input.value.length

  phone.value = formatPhone(input.value)

  // Kursorni to'g'ri joyga qaytarish
  nextTick(() => {
    const diff = phone.value.length - prevLen
    const newPos = Math.max(5, cursorPos + diff) // +998 dan keyin
    input.setSelectionRange(newPos, newPos)
  })

  errors.value.phone = ''
}

const onPhoneKeydown = (e: KeyboardEvent) => {
  // Ruxsat berilgan tugmalar
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (allowed.includes(e.key)) return

  // Ctrl+A, Ctrl+C, Ctrl+V
  if (e.ctrlKey || e.metaKey) return

  // Faqat raqamlar
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
    return
  }

  // Maksimal uzunlikni tekshirish (12 raqam: 998XXXXXXXXX)
  const digits = phone.value.replace(/\D/g, '')
  if (digits.length >= 12) {
    e.preventDefault()
  }
}

const onPhoneFocus = () => {
  if (!phone.value) {
    phone.value = '+998 ('
  }
  errors.value.phone = ''
}

const validate = (): boolean => {
  const e: Record<string, string> = {}
  if (!firstName.value.trim()) e.firstName = "Ismingizni kiriting"
  if (!lastName.value.trim()) e.lastName = "Familiyangizni kiriting"

  const digits = phone.value.replace(/\D/g, '')
  if (digits.length < 12) e.phone = "Telefon raqamni to'liq kiriting"

  if (!address.value.trim()) e.address = "Manzilingizni kiriting"

  errors.value = e
  return Object.keys(e).length === 0
}

const onSubmit = () => {
  if (!validate()) return
  emit('submit', {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    phone: phone.value.trim(),
    address: address.value.trim(),
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <!-- Modal -->
        <div
          class="relative w-[92%] max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style="background: linear-gradient(165deg, #0e1621 0%, #0a1220 100%)"
        >
          <!-- Header with mascot -->
          <div class="px-6 pt-6 pb-3 text-center">
            <img
              src="/mascots/quulay-mascot.svg"
              alt="Quulay maskot"
              class="w-28 h-28 mx-auto mb-2 drop-shadow-lg"
            />
            <h2 class="text-xl font-bold text-white">Ro'yxatdan o'tish</h2>
            <p class="text-[#94a3b8] text-sm mt-1">
              Xarid qilish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <!-- Form -->
          <div class="px-6 pb-7 space-y-3.5">
            <!-- Ism -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5 ml-1">
                <i class="fas fa-user mr-1.5 text-[#008236]" />Ism
              </label>
              <input
                v-model="firstName"
                type="text"
                placeholder="Ismingiz"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#475569] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#008236]/40"
                :class="errors.firstName ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                @input="errors.firstName = ''"
              />
              <p v-if="errors.firstName" class="text-red-400 text-xs mt-1 ml-1">{{ errors.firstName }}</p>
            </div>

            <!-- Familiya -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5 ml-1">
                <i class="fas fa-user mr-1.5 text-[#008236]" />Familiya
              </label>
              <input
                v-model="lastName"
                type="text"
                placeholder="Familiyangiz"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#475569] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#008236]/40"
                :class="errors.lastName ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                @input="errors.lastName = ''"
              />
              <p v-if="errors.lastName" class="text-red-400 text-xs mt-1 ml-1">{{ errors.lastName }}</p>
            </div>

            <!-- Telefon -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5 ml-1">
                <i class="fas fa-phone mr-1.5 text-[#008236]" />Telefon raqam
              </label>
              <input
                :value="phone"
                type="tel"
                inputmode="numeric"
                placeholder="+998 (XX) XXX-XX-XX"
                maxlength="19"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#475569] text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#008236]/40"
                :class="errors.phone ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                @input="onPhoneInput"
                @keydown="onPhoneKeydown"
                @focus="onPhoneFocus"
              />
              <p v-if="errors.phone" class="text-red-400 text-xs mt-1 ml-1">{{ errors.phone }}</p>
            </div>

            <!-- Manzil -->
            <div>
              <label class="block text-[#94a3b8] text-xs font-medium mb-1.5 ml-1">
                <i class="fas fa-map-marker-alt mr-1.5 text-[#008236]" />Yashash manzili
              </label>
              <textarea
                v-model="address"
                rows="2"
                placeholder="Shahar, tuman, ko'cha, uy..."
                class="w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-[#475569] text-sm outline-none transition-all duration-200 resize-none focus:ring-2 focus:ring-[#008236]/40"
                :class="errors.address ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                @input="errors.address = ''"
              />
              <p v-if="errors.address" class="text-red-400 text-xs mt-1 ml-1">{{ errors.address }}</p>
            </div>

            <!-- Submit button -->
            <button
              :disabled="saving"
              class="w-full py-3.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style="background: #008236"
              @click="onSubmit"
            >
              <template v-if="saving">
                <i class="fas fa-spinner fa-spin mr-2" />Saqlanmoqda...
              </template>
              <template v-else>
                <i class="fas fa-check mr-2" />Davom etish
              </template>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
