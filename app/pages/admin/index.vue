<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";

const { user, ready, init, login, logout } = useAdminAuth();
const { products, loading, load, create, update, remove } = useAdminProducts();

const categories = ["Kiyimlar", "Uskunalar", "Oziq ovqatlar", "Xoz tovarlar"];

/* ---------- DEMO rejim: demo@tma.uz / demo1234 ---------- */
const DEMO_EMAIL = "demo@tma.uz";
const DEMO_PASSWORD = "demo1234";
const demoMode = ref(false);
const demoProducts = ref<any[]>([
  {
    id: "d1",
    title: "Nike Air Max 270",
    category: "Kiyimlar",
    brand: "Nike",
    price: 1250000,
    oldPrice: 1800000,
    image: "https://picsum.photos/seed/nike/400",
  },
  {
    id: "d2",
    title: "Bosch UniversalImpact drel",
    category: "Uskunalar",
    brand: "Bosch",
    price: 890000,
    image: "https://picsum.photos/seed/bosch/400",
  },
  {
    id: "d3",
    title: "Premium zaytun moyi 1L",
    category: "Oziq ovqatlar",
    brand: "De Cecco",
    price: 75000,
    oldPrice: 95000,
    image: "https://picsum.photos/seed/oil/400",
  },
]);
let demoSeq = 100;

const isAuthed = computed(() => demoMode.value || !!user.value);
const list = computed(() =>
  demoMode.value ? demoProducts.value : products.value,
);
const statCats = computed(
  () => new Set(list.value.map((p) => p.category).filter(Boolean)).size,
);
const statSale = computed(() => list.value.filter((p) => p.oldPrice).length);

/* ---------- auth ---------- */
const loginErr = ref("");
const loggingIn = ref(false);

const onLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  loginErr.value = "";
  if (!email || !password) {
    loginErr.value = "Email va parolni kiriting.";
    return;
  }
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    demoMode.value = true;
    return;
  }
  loggingIn.value = true;
  try {
    await login(email, password);
    await load();
  } catch (e: any) {
    const map: Record<string, string> = {
      "auth/invalid-credential": "Email yoki parol noto'g'ri.",
      "auth/invalid-email": "Email formati noto'g'ri.",
      "auth/too-many-requests":
        "Juda ko'p urinish. Birozdan keyin urinib ko'ring.",
      "auth/operation-not-allowed":
        "Email/Parol kirish yoqilmagan (Firebase Console).",
    };
    loginErr.value = map[e.code] || "Xato: " + e.code;
  } finally {
    loggingIn.value = false;
  }
};

const onLogout = async () => {
  if (demoMode.value) {
    demoMode.value = false;
    return;
  }
  await logout();
};

/* ---------- toast ---------- */
const toast = reactive({ msg: "", bad: false, show: false });
let toastTimer: any;
const notify = (msg: string, bad = false) => {
  toast.msg = msg;
  toast.bad = bad;
  toast.show = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.show = false), 2600);
};

/* ---------- modal ---------- */
const modalOpen = ref(false);
const editing = ref<any | null>(null);
const saving = ref(false);

const openAdd = () => {
  editing.value = null;
  modalOpen.value = true;
};
const openEdit = (p: any) => {
  editing.value = p;
  modalOpen.value = true;
};
const closeModal = () => {
  modalOpen.value = false;
};

const onSave = async (data: Record<string, any>) => {
  if (!data.title || !data.images?.length || !data.price) {
    notify("Nomi, narxi va kamida 1 ta rasm shart.", true);
    return;
  }
  saving.value = true;
  try {
    if (demoMode.value) {
      if (editing.value) {
        const i = demoProducts.value.findIndex(
          (x) => x.id === editing.value.id,
        );
        if (i > -1)
          demoProducts.value[i] = { ...demoProducts.value[i], ...data };
        notify("Yangilandi ✓");
      } else {
        demoProducts.value.unshift({ id: "d" + ++demoSeq, ...data });
        notify("Qo'shildi ✓");
      }
    } else if (editing.value) {
      await update(editing.value.id, data);
      notify("Yangilandi ✓");
    } else {
      await create(data);
      notify("Qo'shildi ✓");
    }
    closeModal();
  } catch (e: any) {
    notify("Saqlashda xato: " + e.code, true);
  } finally {
    saving.value = false;
  }
};

const onDelete = async (p: any) => {
  if (!confirm(`"${p.title || "mahsulot"}" o'chirilsinmi?`)) return;
  try {
    if (demoMode.value) {
      demoProducts.value = demoProducts.value.filter((x) => x.id !== p.id);
    } else {
      await remove(p.id);
    }
    notify("O'chirildi ✓");
  } catch (e: any) {
    notify("O'chirishda xato: " + e.code, true);
  }
};

onMounted(() => {
  init();
  setTimeout(() => {
    if (user.value) load();
  }, 400);
});
</script>

<template>
  <div
    class="min-h-screen text-[#eef2f8]"
    style="
      background:
        radial-gradient(
          1000px 500px at 100% -10%,
          rgba(0, 130, 54, 0.16),
          transparent 60%
        ),
        #0a0f1a;
    "
  >
    <AdminLogin
      v-if="ready && !isAuthed"
      :loading="loggingIn"
      :error="loginErr"
      @submit="onLogin"
    />

    <template v-else-if="isAuthed">
      <AdminTopBar @logout="onLogout" />

      <div class="max-w-[1080px] mx-auto px-5 pt-7 pb-20">
        <div class="flex justify-between items-center flex-wrap gap-3.5 mb-5">
          <div>
            <h1 class="text-2xl font-extrabold">Mahsulotlar</h1>
            <p class="text-[#94a3b8] text-[13px] mt-1">
              Bu yerga qo'shilgan mahsulotlar do'konda darhol ko'rinadi.
            </p>
          </div>
          <button
            class="bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-[#031b0e] font-bold px-[17px] py-2.5 rounded-xl cursor-pointer"
            @click="openAdd"
          >
            ＋ Yangi mahsulot
          </button>
        </div>

        <AdminStats
          :total="list.length"
          :categories="statCats"
          :sale="statSale"
        />

        <AdminProductGrid
          :products="list"
          :loading="loading"
          @edit="openEdit"
          @delete="onDelete"
        />
      </div>
    </template>

    <div v-else class="min-h-screen grid place-items-center text-[#94a3b8]">
      Yuklanmoqda...
    </div>

    <AdminProductModal
      :open="modalOpen"
      :product="editing"
      :categories="categories"
      :saving="saving"
      @close="closeModal"
      @save="onSave"
    />

    <AdminToast :msg="toast.msg" :show="toast.show" :bad="toast.bad" />
  </div>
</template>
