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
  let digits = raw.replace(/\D/g, '')

  if (digits.startsWith('998')) {
    // ok
  } else if (digits.startsWith('8') && digits.length > 1) {
    digits = '998' + digits.slice(1)
  } else if (digits.startsWith('9') && !digits.startsWith('998')) {
    digits = '998' + digits
  } else if (!digits.startsWith('998')) {
    digits = '998' + digits
  }

  // MAKSIMUM 12 raqam: 998 + 9 ta
  digits = digits.slice(0, 12)

  let formatted = '+998'
  const local = digits.slice(3)

  if (local.length > 0) formatted += ' (' + local.slice(0, 2)
  if (local.length >= 2) formatted += ') '
  if (local.length > 2) formatted += local.slice(2, 5)
  if (local.length > 5) formatted += '-' + local.slice(5, 7)
  if (local.length > 7) formatted += '-' + local.slice(7, 9)

  return formatted
}

const onPhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  phone.value = formatPhone(input.value)
  errors.value.phone = ''
}

const onPhoneKeydown = (e: KeyboardEvent) => {
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (allowed.includes(e.key)) return
  if (e.ctrlKey || e.metaKey) return
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
    return
  }
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
        class="reg-backdrop"
      >
        <!-- Scroll container -->
        <div class="reg-scroll">
          <!-- Modal card -->
          <div class="reg-card">
            <!-- Header -->
            <div class="px-5 pt-5 pb-2 text-center">
              <img
                src="/mascots/quulay-mascot.svg"
                alt="Quulay"
                class="reg-mascot"
              />
              <h2 class="text-lg font-bold text-white">Ro'yxatdan o'tish</h2>
              <p class="text-[#94a3b8] text-xs mt-0.5">
                Xarid qilish uchun ma'lumotlaringizni kiriting
              </p>
            </div>

            <!-- Form -->
            <div class="px-5 pb-5 space-y-3">
              <!-- Ism -->
              <div>
                <label class="reg-label">
                  <i class="fas fa-user mr-1.5 text-[#008236]" />Ism
                </label>
                <input
                  v-model="firstName"
                  type="text"
                  placeholder="Ismingiz"
                  class="reg-input"
                  :class="errors.firstName ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                  @input="errors.firstName = ''"
                />
                <p v-if="errors.firstName" class="reg-error">{{ errors.firstName }}</p>
              </div>

              <!-- Familiya -->
              <div>
                <label class="reg-label">
                  <i class="fas fa-user mr-1.5 text-[#008236]" />Familiya
                </label>
                <input
                  v-model="lastName"
                  type="text"
                  placeholder="Familiyangiz"
                  class="reg-input"
                  :class="errors.lastName ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                  @input="errors.lastName = ''"
                />
                <p v-if="errors.lastName" class="reg-error">{{ errors.lastName }}</p>
              </div>

              <!-- Telefon -->
              <div>
                <label class="reg-label">
                  <i class="fas fa-phone mr-1.5 text-[#008236]" />Telefon raqam
                </label>
                <input
                  :value="phone"
                  type="tel"
                  inputmode="numeric"
                  placeholder="+998 (XX) XXX-XX-XX"
                  maxlength="19"
                  class="reg-input"
                  :class="errors.phone ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                  @input="onPhoneInput"
                  @keydown="onPhoneKeydown"
                  @focus="onPhoneFocus"
                />
                <p v-if="errors.phone" class="reg-error">{{ errors.phone }}</p>
              </div>

              <!-- Manzil -->
              <div>
                <label class="reg-label">
                  <i class="fas fa-map-marker-alt mr-1.5 text-[#008236]" />Yashash manzili
                </label>
                <input
                  v-model="address"
                  type="text"
                  placeholder="Shahar, tuman, ko'cha, uy..."
                  class="reg-input"
                  :class="errors.address ? 'border-red-500/60' : 'border-white/10 focus:border-[#008236]/60'"
                  @input="errors.address = ''"
                />
                <p v-if="errors.address" class="reg-error">{{ errors.address }}</p>
              </div>

              <!-- Submit -->
              <button
                :disabled="saving"
                class="reg-btn"
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
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.reg-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.reg-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  padding-bottom: env(safe-area-inset-bottom, 24px);
}

.reg-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(165deg, #0e1621 0%, #0a1220 100%);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  margin: auto 0;
}

.reg-mascot {
  width: 100px;
  height: 100px;
  margin: 0 auto 8px;
  display: block;
}

/* Kichik ekranlarda maskotni kichiklashtirish */
@media (max-height: 640px) {
  .reg-mascot {
    width: 64px;
    height: 64px;
    margin-bottom: 4px;
  }
  .reg-scroll {
    padding-top: 12px;
  }
  .reg-card {
    margin-top: 0;
  }
}

.reg-label {
  display: block;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
  margin-left: 4px;
}

.reg-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.reg-input::placeholder {
  color: #475569;
}

.reg-input:focus {
  ring: 2px;
  ring-color: rgba(0, 130, 54, 0.4);
  box-shadow: 0 0 0 2px rgba(0, 130, 54, 0.3);
}

.reg-error {
  color: #f87171;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

.reg-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #008236;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.reg-btn:active {
  transform: scale(0.98);
}

.reg-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
