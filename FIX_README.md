# TMA-Global — "Mahsulot bazaga yozilmayapti" muammosi: tuzatish

Kod aslida Firebase'ga ulangan edi (admin `addDoc` qiladi, do'kon `getDocs`
bilan o'qiydi). Lekin **3 ta muammo** mahsulot bazaga yetib borishiga
to'sqinlik qilardi. Quyida sabablar, kod o'zgarishlari va **Firebase
Console'da albatta bajarish kerak bo'lgan qadamlar**.

---

## 1. ASOSIY SABAB — rasm base64 holida Firestore'ga yozilardi

`useImageUpload.ts` rasmni Firebase Storage'ga yuklay olmasa (yoki admin
auth qilinmagan bo'lsa), uni **base64 (data URL)** ga aylantirib qaytarardi.
Bu base64 satr mahsulot hujjati ichiga kirib, Firestore'ga yozilardi.

**Muammo:** Firestore hujjati **1 MB** bilan cheklangan. Telefon rasmi
base64'da 1–5 MB bo'ladi → `addDoc(...)` xato beradi → **mahsulot umuman
saqlanmaydi**. Rasm faqat modal oynada (klient) ko'rinardi — aynan shuning
uchun "ma'lumot klient tomonda qolib ketyapti" edi.

**Tuzatildi (`app/composables/useImageUpload.ts`):**
- Rasm klientda canvas orqali kichraytiriladi va siqiladi (max 1280px, JPEG).
- So'ng **Firebase Storage**'ga yuklanadi, faqat qisqa **download URL** qaytadi.
- Storage ishlamasa va siqilgan rasm xavfsiz hajmda bo'lsagina base64 zaxiraga
  tushadi; aks holda **tushunarli xato** beradi (cryptic Firestore xatosi emas).

`app/composables/useAdminProducts.ts` ham himoyalandi: agar payload 900 KB dan
oshsa, "Storage yoqilmagan bo'lishi mumkin" degan aniq xabar beradi.

---

## 2. SABAB — ilova boshqa loyihaga (king-avto-system) ulangan

`useFirebase.ts` ichidagi default config va `.env` **king-avto-system** degan
**boshqa** Firebase loyihasiga ishora qilardi. Ya'ni siz o'z konsolingizga
qarasangiz — bo'sh, chunki ilova boshqa joyga yozardi (yoki ruxsat berilmasdi).

**Tuzatildi (`app/composables/useFirebase.ts`):**
- Config endi avval `.env`'dan o'qiydi. `.env` to'ldirilmagan bo'lsa, konsolda
  **ogohlantirish** chiqadi: "DEMO loyiha ishlatilyapti".

**Siz bajarishingiz kerak:** `.env`'ga **o'z** loyihangiz qiymatlarini yozing
(pastdagi 6-qadamga qarang).

---

## 3. SABAB — Firebase plugin Nuxt 4'da ro'yxatdan o'tmagan

Plugin `plugins/firebase.client.ts` (ildizda) edi. Nuxt 4'da `srcDir = app/`,
shuning uchun ildizdagi `plugins/` **o'qilmaydi** — u to'g'ri `app/plugins/`da
bo'lishi kerak. (Composable'lar Firebase'ni o'zi init qilgani uchun bu
hal qiluvchi muammo emas, lekin to'g'rilab qo'ydik.)

**Tuzatildi:** plugin `app/plugins/firebase.client.ts`ga ko'chirildi.
**Eski faylni o'chiring:** `plugins/firebase.client.ts`.

---

## O'zgartirilgan fayllar (loyihangizdagi ustiga yozing)

```
app/composables/useImageUpload.ts     ← qayta yozildi (eng muhim)
app/composables/useFirebase.ts        ← env-first + ogohlantirish
app/composables/useAdminProducts.ts   ← himoya + raqamga aylantirish
app/plugins/firebase.client.ts        ← YANGI joy (ildizdagisini o'chiring)
.env.example                          ← aniqroq izoh
```

---

## ✅ Firebase Console'da ALBATTA bajarish kerak

Kodning o'zi yetarli emas — loyihangiz to'g'ri sozlanishi shart:

**1) Firebase loyiha yarating** (yoki mavjudini oching): https://console.firebase.google.com

**2) Web app qo'shing** va config qiymatlarini oling
(Project settings ⚙️ → Your apps → Web → SDK setup and configuration).

**3) Authentication'ni yoqing:**
- Authentication → Get started
- Sign-in method → **Email/Password** → Enable
- Users → **Add user** (admin email + parol). Admin panelga shu bilan kirasiz.

**4) Firestore Database yarating:**
- Firestore Database → Create database → (Production mode bo'lsa ham bo'ladi)
- **Rules** bo'limiga loyihangizdagi `firestore.rules` mazmunini joylang →
  **Publish**. (products: hamma o'qiydi, auth bilan yoziladi.)

**5) Storage'ni yoqing:** ← buni ko'pincha tushirib qoldiriladi
- Build → **Storage** → Get started (Spark/bepul reja yetadi)
- **Rules** bo'limiga `storage.rules` mazmunini joylang → **Publish**.
- Storage yoqilmasa, rasm yuklash ishlamaydi (yangi kod bu haqda xato beradi).

**6) `.env` to'ldiring:**
```bash
cp .env.example .env
```
So'ng quyidagilarni o'z loyihangizdan yozing:
```
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=<project>
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project>.firebasestorage.app  # yoki <project>.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NUXT_PUBLIC_FIREBASE_APP_ID=...
```
> `STORAGE_BUCKET` qiymatini Storage sahifasi tepasidagi `gs://...` dan oling
> (oxirgi qismi `.firebasestorage.app` yoki `.appspot.com` bo'lishi mumkin —
> qaysi biri ko'rinsa, o'shani yozing).

---

## Tekshirish

```bash
yarn install
yarn dev
```
1. `/admin` sahifasiga kiring → 3-qadamda yaratgan admin email/parol bilan login.
2. "＋ Yangi mahsulot" → nomi, narxi va rasm qo'shing → Saqlash.
3. **Firebase Console → Firestore → `products`** kolleksiyasida yangi hujjat
   paydo bo'lishi kerak (rasm `images` ichida `https://...` URL sifatida).
4. Bosh sahifa (`/`) yangilangach mahsulot do'konda ko'rinadi.

Agar baribir saqlanmasa — brauzer DevTools → Console'dagi xatoni o'qing:
- `permission-denied` → Firestore Rules publish qilinmagan yoki auth yo'q.
- `storage/unauthorized` yoki `storage/...` → Storage yoqilmagan / Rules yo'q.
- "DEMO loyiha ishlatilyapti" ogohlantirishi → `.env` hali to'ldirilmagan.

---

## Yangi: Mijoz reytingi (bosiladigan yulduzcha)

Mahsulot sahifasida mijozlar yulduzcha bosib baho beradi; baho Firebase'ga
saqlanadi va o'rtacha reyting (do'kon kartasi + sahifa) avtomatik yangilanadi.

**Yangi/o'zgargan fayllar:**
- `app/composables/useRating.ts` — yangi (anonim auth + transaction bilan o'rtacha)
- `app/pages/product/[id].vue` — bosiladigan yulduzchalar bloki qo'shildi
- `firestore.rules` — reyting uchun yangilandi

**Ishlashi uchun ALBATTA (Firebase Console):**
1. Authentication → Sign-in method → **Anonymous** → Enable.
2. Firestore → **Rules** → yangi `firestore.rules` mazmunini joylang → **Publish**.

Ya'ni: mijoz baho qo'yganda ilova uni Firebase'ga anonim foydalanuvchi sifatida
kiritadi (parol so'ralmaydi), baho `products/{id}/ratings/{uid}` ga yoziladi va
mahsulotning `ratingSum`, `reviewCount`, `rating` (o'rtacha) maydonlari yangilanadi.
Har bir foydalanuvchi bittagina baho qo'yadi va keyin uni o'zgartira oladi.

Agar baho qo'yilmasa va konsolda `auth/operation-not-allowed` chiqsa — Anonymous
auth yoqilmagan; `permission-denied` chiqsa — yangi rules publish qilinmagan.

---

## Yangi: Checkout (rasmiylashtirish) oynasi

Savatdagi "Buyurtma berish" endi to'g'ridan-to'g'ri yubormaydi — avval `/checkout`
sahifasiga o'tadi. U yerda mijoz quyidagilarni kiritadi:
- **Telefon raqam** (majburiy)
- **Viloyat/shahar** (majburiy)
- **Manzil** (kuryer tanlansa majburiy; "Olib ketish"da shart emas)
- **Yetkazib berish usuli** (Kuryer / Olib ketish)
- **To'lov** (yetkazishda: Naqd / Karta)
- **Izoh** (ixtiyoriy)

"Buyurtmani tasdiqlash" bosilganda bularning hammasi admin'ga yuboriladi (telefon,
manzil, usul, to'lov, izoh bilan birga), Firestore'ga ham yoziladi (service account
sozlangan bo'lsa). To'lov ONLAYN emas — yetkazib berishda olinadi.

**Yangi/o'zgargan fayllar:**
- `app/pages/checkout/index.vue` — yangi sahifa
- `app/composables/useOrder.ts` — mijoz ma'lumotini yuboradi
- `server/api/orders.post.ts` — telefon/manzil/usul/izohni admin xabariga qo'shadi
- `app/pages/cart/index.vue` — tugma endi /checkout ga olib boradi

---

## Yangi: Input maskalar (Price Mask + Phone Formatter)

- `app/composables/useInputMask.ts` — yangi (maska funksiyalari).
- **Price Mask** — admin ProductModal'da "Narxi" va "Eski narxi" maydonlari kiritilganda
  avtomatik 3 xonadan bo'sh joy bilan ajraladi (masalan, `1 250 000`). Saqlashda toza son
  (1250000) Firestore'ga yoziladi.
- **Phone Formatter** — checkout sahifasidagi telefon maydoni `+998 XX XXX XX XX` ko'rinishiga
  keltiriladi va to'liq (9 ta raqam) bo'lishi tekshiriladi.

Qo'shimcha Firebase yoki env sozlamasi shart emas — faqat fayllarni deploy qiling.

---

## Yangi: Uzun fayllar komponentlarga bo'lindi (faqat tozalik)

Ishlash mantig'i o'zgarmadi — kod o'qishga osonroq bo'lishi uchun bo'lindi:

- `product/[id].vue` (272 → ~55 qator): bo'laklarga ajraldi —
  `components/Product/Gallery.vue` (rasm galereyasi),
  `components/Product/Info.vue` (nomi/narx/tavsif/brend),
  `components/Product/Rating.vue` (baholash),
  `components/Product/BottomBar.vue` (savatga qo'shish paneli).
- `Admin/ProductModal.vue` (296 → ~145 qator): rasm qismi
  `components/Admin/ProductImages.vue` ga chiqarildi (v-model orqali).
- `Hero/index.vue` (221 → ~165 qator): slaydlar ma'lumoti
  `components/Hero/slides.ts` ga ko'chirildi.

Eslatma (yana bir bor): bu bo'lish ilovani **tezlashtirmaydi** — faqat kodni
toza qiladi. Tezlik uchun rasm hajmini (Logo2.png 516KB) optimallashtirish kerak.
