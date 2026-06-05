<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";

const { user, ready, init, login, logout } = useAdminAuth();
const { products, loading, load, create, update, remove } = useAdminProducts();
const { orders, loading: ordersLoading, load: loadOrders, updateStatus, remove: removeOrder } = useAdminOrders();

const activeTab = ref<"products" | "orders">("products");
const tabCls = (t: string) =>
  "px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors " +
  (activeTab.value === t
    ? "bg-[#22c55e] text-[#031b0e]"
    : "bg-white/5 text-[#94a3b8] hover:text-white border border-white/10");
const goOrders = () => { activeTab.value = "orders"; loadOrders(); };

const categories = ["Kiyimlar", "Uskunalar", "Oziq ovqatlar", "Xoz tovarlar"];

const isAuthed = computed(() => !!user.value);
const list = computed(() => products.value);
const statCats = computed(
  () => new Set(list.value.map((p) => p.category).filter(Boolean)).size,
);
const statSale = computed(() => list.value.filter((p) => p.oldPrice).length);

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
  await logout();
};

const toast = reactive({ msg: "", bad: false, show: false });
let toastTimer: any;
const notify = (msg: string, bad = false) => {
  toast.msg = msg;
  toast.bad = bad;
  toast.show = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.show = false), 2600);
};

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
    if (editing.value) {
      await update(editing.value.id, data);
      notify("Yangilandi ✓");
    } else {
      await create(data);
      notify("Qo'shildi ✓");
    }
    closeModal();
  } catch (e: any) {
    notify("Saqlashda xato: " + (e.code || e.message), true);
  } finally {
    saving.value = false;
  }
};

const onDelete = async (p: any) => {
  if (!confirm(`"${p.title || "mahsulot"}" o'chirilsinmi?`)) return;
  try {
    await remove(p.id);
    notify("O'chirildi ✓");
  } catch (e: any) {
    notify("O'chirishda xato: " + (e.code || e.message), true);
  }
};

const onOrderStatus = async ({ id, status }: { id: string; status: string }) => {
  try { await updateStatus(id, status); notify("Holat yangilandi ✓"); }
  catch (e: any) { notify("Xato: " + (e.code || e.message), true); }
};
const onOrderDelete = async (o: any) => {
  if (!confirm(`#${o.orderId || o.id} buyurtma o'chirilsinmi?`)) return;
  try { await removeOrder(o.id); notify("O'chirildi ✓"); }
  catch (e: any) { notify("Xato: " + (e.code || e.message), true); }
};

onMounted(() => {
  init(() => load())
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
        <!-- TABLAR -->
        <div class="flex gap-2 mb-6">
          <button :class="tabCls('products')" @click="activeTab = 'products'">Mahsulotlar</button>
          <button :class="tabCls('orders')" @click="goOrders">Buyurtmalar</button>
        </div>

        <template v-if="activeTab === 'products'">
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
        </template>

        <AdminOrders
          v-else
          :orders="orders"
          :loading="ordersLoading"
          @status="onOrderStatus"
          @delete="onOrderDelete"
          @refresh="loadOrders"
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