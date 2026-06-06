// app/composables/useCategory.ts
export const useCategory = () => {
  // Categories va Main o'rtasida umumiy tanlangan kategoriya
  const activeCategory = useState<string>('activeCategory', () => 'Barchasi')

  const setCategory = (label: string) => {
    activeCategory.value = label
  }

  return { activeCategory, setCategory }
}