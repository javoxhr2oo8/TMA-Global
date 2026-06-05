<!-- app/components/Admin/Orders.vue -->
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ orders: any[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: "status", v: { id: string; status: string }): void;
  (e: "delete", o: any): void;
  (e: "refresh"): void;
}>();

const STATUSES = [
  { value: "new", label: "Yangi", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { value: "confirmed", label: "Tasdiqlandi", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { value: "delivered", label: "Yetkazildi", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { value: "canceled", label: "Bekor qilindi", cls: "bg-red-500/15 text-red-300 border-red-500/30" },
];
const statusInfo = (s: string) =>
  STATUSES.find((x) => x.value === s) ?? { value: s, label: s || "—", cls: "bg-white/10 text-gray-300 border-white/20" };

const fmtDate = (ts: any) => {
  const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : null;
  return d
    ? d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";
};
const fmtSum = (n: any) => Number(n || 0).toLocaleString("ru-RU");

const customerName = (o: any) => {
  const u = o.user;
  if (!u) return "Mehmon";
  const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
  return name || "Mehmon";
};

const onStatusChange = (order: any, e: Event) =>
  emit("status", { id: order.id, status: (e.target as HTMLSelectElement).value });

const newCount = computed(() => props.orders.filter((o) => (o.status || "new") === "new").length);
</script>

<template>
  <div>
    <!-- Sarlavha + yangilash -->
    <div class="mb-5 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-2xl font-extrabold">Buyurtmalar</h1>
        <p class="mt-1 text-[13px] text-[#94a3b8]">
          Mijozlar bergan buyurtmalar shu yerda ko'rinadi.
          <span v-if="newCount" class="text-[#22c55e] font-semibold">{{ newCount }} ta yangi</span>
        </p>
      </div>
      <button
        class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#eef2f8] hover:border-white/20"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        <i class="fa-solid fa-rotate-right mr-1.5" :class="{ 'animate-spin': loading }"></i>
        Yangilash
      </button>
    </div>

    <!-- Yuklanmoqda -->
    <div v-if="loading && !orders.length" class="py-16 text-center text-[#94a3b8]">
      Yuklanmoqda…
    </div>

    <!-- Bo'sh -->
    <div v-else-if="!orders.length" class="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
      <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <i class="fa-solid fa-receipt text-2xl text-[#94a3b8]"></i>
      </div>
      <p class="font-semibold">Hozircha buyurtma yo'q</p>
      <p class="mt-1 text-sm text-[#64748b]">Mijoz buyurtma bergach, shu yerda paydo bo'ladi.</p>
    </div>

    <!-- Ro'yxat -->
    <div v-else class="space-y-3.5">
      <div
        v-for="o in orders"
        :key="o.id"
        class="rounded-2xl border border-white/10 bg-[#101828] p-4"
      >
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div class="font-bold text-[15px]">#{{ o.orderId || o.id }}</div>
            <div class="text-[12px] text-[#64748b]">{{ fmtDate(o.createdAt) }}</div>
          </div>
          <span class="rounded-full border px-3 py-1 text-[12px] font-semibold" :class="statusInfo(o.status).cls">
            {{ statusInfo(o.status).label }}
          </span>
        </div>

        <!-- Mijoz -->
        <div class="mt-3 grid gap-1 text-[13px] text-[#cbd5e1]">
          <div><i class="fa-solid fa-user w-4 text-[#64748b]"></i> {{ customerName(o) }}
            <span v-if="o.user?.username" class="text-[#64748b]">(@{{ o.user.username }})</span>
          </div>
          <div><i class="fa-solid fa-phone w-4 text-[#64748b]"></i>
            <a :href="`tel:${o.customer?.phone}`" class="text-[#22c55e]">{{ o.customer?.phone || "—" }}</a>
          </div>
          <div v-if="o.customer?.region || o.customer?.address">
            <i class="fa-solid fa-location-dot w-4 text-[#64748b]"></i>
            {{ [o.customer?.region, o.customer?.address].filter(Boolean).join(", ") }}
          </div>
          <div v-if="o.customer?.delivery"><i class="fa-solid fa-truck w-4 text-[#64748b]"></i> {{ o.customer.delivery }}</div>
          <div><i class="fa-solid fa-money-bill w-4 text-[#64748b]"></i> {{ o.customer?.payment || "—" }} (yetkazishda)</div>
          <div v-if="o.customer?.comment" class="text-[#94a3b8]"><i class="fa-solid fa-comment w-4 text-[#64748b]"></i> {{ o.customer.comment }}</div>
        </div>

        <!-- Mahsulotlar -->
        <div class="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div v-for="(it, idx) in o.items" :key="idx" class="flex justify-between gap-3 text-[13px] py-0.5">
            <span class="text-[#cbd5e1]">{{ it.title }} <span class="text-[#64748b]">× {{ it.quantity }}</span></span>
            <span class="font-medium whitespace-nowrap">{{ fmtSum(it.price * it.quantity) }} so'm</span>
          </div>
          <div class="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold">
            <span>Jami</span>
            <span class="text-[#22c55e]">{{ fmtSum(o.total) }} so'm</span>
          </div>
        </div>

        <!-- Amallar -->
        <div class="mt-3 flex items-center gap-2">
          <select
            :value="o.status || 'new'"
            class="flex-1 bg-[#161f33] text-[#eef2f8] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#22c55e]"
            @change="onStatusChange(o, $event)"
          >
            <option v-for="s in STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <button
            class="rounded-xl bg-[#ef4444]/10 px-3.5 py-2 text-sm font-semibold text-[#fca5a5] hover:bg-[#ef4444]/20"
            title="O'chirish"
            @click="$emit('delete', o)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
