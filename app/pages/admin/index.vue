<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const { user, ready, init, login, logout } = useAdminAuth();
const { products, loading, load, create, update, remove } = useAdminProducts();
const { orders, loading: ordersLoading, load: loadOrders, updateStatus, remove: removeOrder } = useAdminOrders();
const {
  registrations,
  loading: regsLoading,
  load: loadRegistrations,
  remove: removeRegistration,
} = useRegistration();

const { confirm } = useConfirm();
const toast = useToast();

const activeTab = ref<"products" | "orders" | "registrations" | "banners">("products");
const tabCls = (t: string) =>
  "px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors " +
  (activeTab.value === t
    ? "bg-[#22c55e] text-[#031b0e]"
    : "bg-white/5 text-[#94a3b8] hover:text-white border border-white/10");
const goOrders = () => { activeTab.value = "orders"; loadOrders(); };
const goRegistrations = () => { activeTab.value = "registrations"; loadRegistrations(); };

// --- BANNERLAR ---
const {
  banners: bannerList,
  loading: bannersLoading,
  load: loadBanners,
  create: createBanner,
  update: updateBanner,
  remove: removeBanner,
} = useBanners();

const goBanners = () => { activeTab.value = "banners"; loadBanners(); };

const bannerModalOpen = ref(false);
const editingBanner = ref<any | null>(null);
const bannerSaving = ref(false);

const openAddBanner = () => { editingBanner.value = null; bannerModalOpen.value = true; };
const openEditBanner = (b: any) => { editingBanner.value = b; bannerModalOpen.value = true; };
const closeBannerModal = () => { bannerModalOpen.value = false; };

const onBannerSave = async (data: any) => {
  bannerSaving.value = true;
  try {
    if (editingBanner.value) {
      await updateBanner(editingBanner.value.id, data);
      toast.success("Banner yangilandi ✓");
    } else {
      await createBanner(data);
      toast.success("Banner qo'shildi ✓");
    }
    closeBannerModal();
  } catch (e: any) {
    toast.error("Xato: " + (e.code || e.message));
  } finally {
    bannerSaving.value = false;
  }
};

const onBannerDelete = async (b: any) => {
  const ok = await confirm({
    title: "Bannerni o'chirish",
    message: `"${b.title}" banner o'chirilsinmi?`,
  });
  if (!ok) return;
  try { await removeBanner(b.id); toast.success("Banner o'chirildi ✓"); }
  catch (e: any) { toast.error("Xato: " + (e.code || e.message)); }
};

// Admin uchun kategoriyalar
const categories = productCategories.map((c) => c.label);

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
    toast.warning("Nomi, narxi va kamida 1 ta rasm shart.");
    return;
  }
  saving.value = true;
  try {
    if (editing.value) {
      await update(editing.value.id, data);
      toast.success("Yangilandi ✓");
    } else {
      await create(data);
      toast.success("Qo'shildi ✓");
    }
    closeModal();
  } catch (e: any) {
    toast.error("Saqlashda xato: " + (e.code || e.message));
  } finally {
    saving.value = false;
  }
};

const onDelete = async (p: any) => {
  const ok = await confirm({
    title: "Mahsulotni o'chirish",
    message: `"${p.title || "mahsulot"}" o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.`,
  });
  if (!ok) return;
  try {
    await remove(p.id);
    toast.success("Mahsulot o'chirildi ✓");
  } catch (e: any) {
    toast.error("O'chirishda xato: " + (e.code || e.message));
  }
};

const onRegDelete = async (reg: any) => {
  const ok = await confirm({
    title: "So'rovni o'chirish",
    message: `"${reg.firstName} ${reg.lastName}" so'rovnomasi o'chirilsinmi?`,
  });
  if (!ok) return;
  try { await removeRegistration(reg.id); toast.success("So'rov o'chirildi ✓"); }
  catch (e: any) { toast.error("Xato: " + (e.code || e.message)); }
};

const onOrderStatus = async ({ id, status }: { id: string; status: string }) => {
  try { await updateStatus(id, status); toast.success("Holat yangilandi ✓"); }
  catch (e: any) { toast.error("Xato: " + (e.code || e.message)); }
};
const onOrderDelete = async (o: any) => {
  const ok = await confirm({
    title: "Buyurtmani o'chirish",
    message: `#${o.orderId || o.id} buyurtma o'chirilsinmi?`,
  });
  if (!ok) return;
  try { await removeOrder(o.id); toast.success("Buyurtma o'chirildi ✓"); }
  catch (e: any) { toast.error("Xato: " + (e.code || e.message)); }
};

onMounted(() => {
  init(() => {
    load()
    loadBanners()
  })
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
        <div class="flex gap-2 mb-6 flex-wrap">
          <button :class="tabCls('products')" @click="activeTab = 'products'">Mahsulotlar</button>
          <button :class="tabCls('orders')" @click="goOrders">Buyurtmalar</button>
          <button :class="tabCls('registrations')" @click="goRegistrations">
            <i class="fas fa-users mr-1.5" />So'rovnomalar
          </button>
          <button :class="tabCls('banners')" @click="goBanners">
            <i class="fas fa-image mr-1.5" />Bannerlar
          </button>
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
          v-else-if="activeTab === 'orders'"
          :orders="orders"
          :loading="ordersLoading"
          @status="onOrderStatus"
          @delete="onOrderDelete"
          @refresh="loadOrders"
        />

        <AdminRegistrations
          v-else-if="activeTab === 'registrations'"
          :registrations="registrations"
          :loading="regsLoading"
          @delete="onRegDelete"
          @refresh="loadRegistrations"
        />

        <AdminBanners
          v-else-if="activeTab === 'banners'"
          :banners="bannerList"
          :loading="bannersLoading"
          @add="openAddBanner"
          @edit="openEditBanner"
          @delete="onBannerDelete"
          @refresh="loadBanners"
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

    <AdminBannerModal
      :open="bannerModalOpen"
      :banner="editingBanner"
      :saving="bannerSaving"
      @close="closeBannerModal"
      @save="onBannerSave"
    />
  </div>
</template>