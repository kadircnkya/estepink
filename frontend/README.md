# Estepink Web Uygulaması & "Defter" Galerisi

Estepink güzellik ve epilasyon merkezi için geliştirilmiş modern, lüks ve erişilebilir React + Vite + Tailwind CSS web uygulaması.

---

## 📖 "Defter" (Açık Kitap) Deneyimi

Sitede yapay kaydırma animasyonları (scroll hijacking) kaldırılarak; sayfa akışında merkezde duran, buton ve klavye kontrollü, fiziksel açık defter modeli kurulmuştur.

### Nasıl Çalışır?
- **Çift (Spread) Geometrisi:** $N = 9$ çift için $8$ çevrilen yaprak (Leaf) + $1$ sabit sol taban (Photo 1) + $1$ sabit sağ taban (Text 9 - Randevu) bulunur.
- **Çift Yüzlü Yapraklar (3D Leaf):**
  - **Ön Yüz:** $k$. yazı (sağda durur).
  - **Arka Yüz:** $(k+1)$. fotoğraf (`rotateY(180deg)` ile arkaya bakar).
  - **Çevrilme:** Masaüstünde `transform-origin: left center` ile $0^\circ \to -180^\circ$ `rotateY` açısıyla sırt çizgisi üzerinden sola çevrilir.
  - **Katmanlama (Z-Index):** Çevrilen yaprak sola geçtiğinde sol yığına, sağda dururken sağ yığına uygun derinlikte oturur; geçiş anında en üst katmanda süzülür.
- **Duyarlı Düzen (Masaüstü & Mobil):**
  - `matchMedia('(max-aspect-ratio: 11/10)')` ile algılanır.
  - **Masaüstü:** Yan yana çift sayfa (Sol: Polaroid fotoğraf, pembe washi bant; Sağ: Etiket, başlık, metin).
  - **Mobil Dikey (Steno Not Defteri):** Üst yarı fotoğraf, alt yarı metin. Yapraklar `transform-origin: top center` ile yatay eksende (`rotateX`) yukarı doğru çevrilir.

---

## ⚙️ Yapılandırma & Düzenleme

### 1. Yeni Çift (Spread) Ekleme veya Çıkarma
[content/book.ts](file:///c:/Users/Kadircnkya/Desktop/este/frontend/src/content/book.ts) içerisindeki `BOOK_SPREADS` dizisine yeni öğe ekleyebilir veya çıkarabilirsiniz:
```ts
{
  id: 'yeni-sayfa',
  index: 10,
  image: '/images/gX.webp',
  alt: 'Açıklama',
  focus: { x: 50, y: 50 }, // Mobil dikey görünümde görselin odak noktası (yüzde)
  tag: '10 — Özel Başlık',
  title: 'Başlık *Vurgulu Kelime*',
  body: 'Açıklama metni...',
  pageNumber: '10 / 10',
}
```

### 2. Sayfa Çevirme Süresi (Flip Duration)
[lib/config.ts](file:///c:/Users/Kadircnkya/Desktop/este/frontend/src/lib/config.ts) içerisindeki `BOOK_CONFIG.flipDurationMs` değerini güncelleyebilirsiniz:
```ts
export const BOOK_CONFIG = {
  totalSpreads: 9,
  flippingLeaves: 8,
  flipDurationMs: 650, // Milisaniye cinsinden sayfa çevirme süresi
} as const;
```

---

## 🎮 Kontroller & Erişilebilirlik
- **Butonlar:** Defterin altındaki `‹` (Önceki) ve `›` (Sonraki) butonları (dokunma hedefi $\ge 48\text{px}$).
- **Noktalar / Sayfa Göstergesi:** `03 / 09` sayacı ve tıklanabilir 9 adet sayfa gösterge hapı.
- **Klavye:** `ArrowLeft` / `PageUp` (önceki), `ArrowRight` / `PageDown` (sonraki).
- **Dokunmatik:** Mobilde parmak kaydırma (swipe) desteği.
- **Header Menüsü:** `Salon` (1. çift), `Odalar` (5. çift), `Cihazlar` (7. çift), `Randevu al` (9. çift WhatsApp & Instagram) doğrudan defterdeki ilgili sayfayı açar.
- **Hareket Azaltma (Reduced Motion):** `prefers-reduced-motion` durumunda 3D dönüş yerine anında geçiş yapılır.

---

## 📋 Manuel Test Kontrol Listesi
- [x] **1440px Masaüstü:** Yan yana çift sayfa, polaroid washi bant, 3D çevrilme, `›` ve `‹` butonları.
- [x] **1024px Tablet:** Orantılı ölçeklenme, sayfa kalınlık gölgeleri (stacked shadow).
- [x] **768px Küçük Tablet:** Buton ve klavye kontrolleri.
- [x] **390px Mobil Dikey:** Üstten ciltli görünüm (üst yarı fotoğraf, alt yarı yazı), dikey çevrilme (`rotateX`).
- [x] **Yatay Telefon ($\le 520\text{px}$):** Metinlerin taşmaması, net başlıklar.
- [x] **Geriye Çevirme:** `‹` butonuna basıldığında sol yığındaki yaprağın kusursuz şekilde sağa geri kapanması.
- [x] **Hızlı Tıklama:** Sayfa çevrilirken animasyon kilidi sayesinde çakışma olmaması.
- [x] **Koyu Mod:** Kâğıdın fiziksel krem nesne rengini (`#fffaf5`) koruması, koyu temayla uyumu.
- [x] **Randevu Sayfası (09/09):** WhatsApp butonu ve Instagram bağlantısının çalışması.
