<script setup lang="ts">
// app/components/UI/Select.vue
// Ilovaning qorong'u temasiga mos, to'liq custom <select> o'rnini bosuvchi.
// - Native select'dan farqli: ochilgan ro'yxat ham bezatilgan (qorong'u, check belgisi).
// - Teleport (body) + fixed pozitsiya → modal yoki scroll ichida kesilmaydi.
// - Klaviatura (↑/↓/Enter/Esc/Home/End), tashqariga bosib yopish, auto-flip (joy bo'lmasa yuqoriga ochiladi).
// - v-model orqali ishlaydi.
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";

type Opt = string | { label: string; value: any };

const props = withDefaults(
  defineProps<{
    modelValue: any;
    options: Opt[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: "Tanlang…",
    disabled: false,
  }
);

const emit = defineEmits<{ "update:modelValue": [value: any] }>();

// Stringlar ham, {label,value} obyektlari ham qo'llab-quvvatlanadi
const items = computed(() =>
  props.options.map((o) =>
    o !== null && typeof o === "object"
      ? { label: String(o.label), value: o.value }
      : { label: String(o), value: o }
  )
);

const open = ref(false);
const activeIndex = ref(-1);
const rootEl = ref<HTMLElement | null>(null);
const panelEl = ref<HTMLElement | null>(null);
const panelStyle = ref<Record<string, string>>({});

const selectedLabel = computed(() => {
  const f = items.value.find((o) => o.value === props.modelValue);
  return f ? f.label : "";
});
const hasValue = computed(() => selectedLabel.value !== "");

function computePosition(): void {
  if (!import.meta.client || !rootEl.value) return;
  const r = rootEl.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - r.bottom;
  const spaceAbove = r.top;
  const up = spaceBelow < 240 && spaceAbove > spaceBelow;

  const s: Record<string, string> = {
    position: "fixed",
    left: `${Math.round(r.left)}px`,
    width: `${Math.round(r.width)}px`,
    zIndex: "70",
  };
  if (up) {
    s.bottom = `${Math.round(window.innerHeight - r.top + 6)}px`;
    s.maxHeight = `${Math.min(264, spaceAbove - 12)}px`;
  } else {
    s.top = `${Math.round(r.bottom + 6)}px`;
    s.maxHeight = `${Math.min(264, spaceBelow - 12)}px`;
  }
  panelStyle.value = s;
}

function openMenu(): void {
  if (props.disabled) return;
  computePosition();
  open.value = true;
  activeIndex.value = Math.max(
    0,
    items.value.findIndex((o) => o.value === props.modelValue)
  );
  nextTick(() => {
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("scroll", computePosition, true);
    window.addEventListener("resize", computePosition);
    scrollActiveIntoView();
  });
}

function closeMenu(): void {
  if (!open.value) return;
  open.value = false;
  document.removeEventListener("click", onDocClick, true);
  window.removeEventListener("scroll", computePosition, true);
  window.removeEventListener("resize", computePosition);
}

function toggle(): void {
  open.value ? closeMenu() : openMenu();
}

function choose(i: number): void {
  const o = items.value[i];
  if (!o) return;
  emit("update:modelValue", o.value);
  closeMenu();
}

function onDocClick(e: MouseEvent): void {
  const t = e.target as Node;
  if (rootEl.value?.contains(t)) return;
  if (panelEl.value?.contains(t)) return;
  closeMenu();
}

function scrollActiveIntoView(): void {
  nextTick(() => {
    const nodes = panelEl.value?.querySelectorAll<HTMLElement>('[role="option"]');
    nodes?.[activeIndex.value]?.scrollIntoView({ block: "nearest" });
  });
}

function onKeydown(e: KeyboardEvent): void {
  if (props.disabled) return;
  if (!open.value) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openMenu();
    }
    return;
  }
  switch (e.key) {
    case "Escape":
      e.preventDefault();
      closeMenu();
      break;
    case "ArrowDown":
      e.preventDefault();
      activeIndex.value = Math.min(items.value.length - 1, activeIndex.value + 1);
      scrollActiveIntoView();
      break;
    case "ArrowUp":
      e.preventDefault();
      activeIndex.value = Math.max(0, activeIndex.value - 1);
      scrollActiveIntoView();
      break;
    case "Home":
      e.preventDefault();
      activeIndex.value = 0;
      scrollActiveIntoView();
      break;
    case "End":
      e.preventDefault();
      activeIndex.value = items.value.length - 1;
      scrollActiveIntoView();
      break;
    case "Enter":
      e.preventDefault();
      choose(activeIndex.value);
      break;
  }
}

watch(
  () => props.disabled,
  (d) => {
    if (d) closeMenu();
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  window.removeEventListener("scroll", computePosition, true);
  window.removeEventListener("resize", computePosition);
});
</script>

<template>
  <div ref="rootEl" class="relative">
    <!-- TRIGGER (yopiq holat — input maydonlari bilan bir xil ko'rinish) -->
    <button
      type="button"
      :disabled="disabled"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="flex w-full items-center justify-between gap-2 rounded-xl border bg-[#161f33] px-3.5 py-2.5 text-left text-sm text-[#eef2f8] outline-none transition-colors"
      :class="[
        open ? 'border-[#22c55e]' : 'border-white/10',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-white/20',
      ]"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="truncate" :class="hasValue ? 'text-[#eef2f8]' : 'text-[#64748b]'">
        {{ hasValue ? selectedLabel : placeholder }}
      </span>
      <i
        class="fa-solid fa-chevron-down text-[11px] text-[#94a3b8] transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
      ></i>
    </button>

    <!-- DROPDOWN (body'ga teleport — modal/scroll ichida kesilmaydi) -->
    <Teleport to="body">
      <Transition name="sel">
        <ul
          v-if="open"
          ref="panelEl"
          role="listbox"
          :style="panelStyle"
          class="ui-select-panel overflow-y-auto rounded-xl border border-white/10 bg-[#161f33] py-1 shadow-2xl ring-1 ring-black/40"
        >
          <li
            v-for="(o, i) in items"
            :key="i"
            role="option"
            :aria-selected="o.value === modelValue"
            class="flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-sm transition-colors"
            :class="[
              i === activeIndex ? 'bg-white/10' : '',
              o.value === modelValue ? 'font-semibold text-[#22c55e]' : 'text-[#eef2f8] hover:bg-white/5',
            ]"
            @mouseenter="activeIndex = i"
            @click="choose(i)"
          >
            <span class="truncate">{{ o.label }}</span>
            <i v-if="o.value === modelValue" class="fa-solid fa-check text-[11px]"></i>
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Yumshoq ochilish/yopilish animatsiyasi */
.sel-enter-active,
.sel-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.sel-enter-from,
.sel-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Ingichka, temaga mos scrollbar */
.ui-select-panel {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}
.ui-select-panel::-webkit-scrollbar {
  width: 6px;
}
.ui-select-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 9999px;
}
</style>
