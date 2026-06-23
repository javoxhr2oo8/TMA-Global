export const productCategories = [
  { id: 1, label: "Elektronika", icon: "fa-solid fa-laptop-code" },
  { id: 2, label: "Maishiy texnika", icon: "fa-solid fa-blender" },
  { id: 3, label: "Uy-roʻzgʻor buyumlari", icon: "fa-solid fa-couch" },
  { id: 4, label: "Smartfonlar", icon: "fa-solid fa-mobile-screen" },
  { id: 5, label: "Goʻzallik va salomatlik", icon: "fa-solid fa-spa" },
  { id: 6, label: "Sport va hordiq", icon: "fa-solid fa-dumbbell" },
  { id: 7, label: "Bolalar mahsulotlari", icon: "fa-solid fa-baby-carriage" },
  { id: 8, label: "Avto mahsulotlar", icon: "fa-solid fa-car" },
  {
    id: 9,
    label: "Qurilish va asbob-uskunalar",
    icon: "fa-solid fa-screwdriver-wrench",
  },
  { id: 10, label: "Kitob va kanselyariya", icon: "fa-solid fa-book" },
  { id: 11, label: "Oʻyinlar va hobbi", icon: "fa-solid fa-gamepad" },
  { id: 12, label: "Sovgʻalar", icon: "fa-solid fa-gift" },
  {
    id: 13,
    label: "Raqamli mahsulotlar",
    icon: "fa-solid fa-cloud-arrow-down",
  },
  { id: 14, label: "Boshqa mahsulotlar", icon: "fa-solid fa-ellipsis" },
];

export const useCategory = () => {
  const activeCategory = useState<string>("activeCategory", () => "Barchasi");

  const setCategory = (label: string) => {
    activeCategory.value = label;
  };

  return { activeCategory, setCategory };
};
