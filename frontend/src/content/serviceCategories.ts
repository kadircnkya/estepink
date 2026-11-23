// Hizmet kategorileri (yalnızca başlıklar ve hizmet adları)
export interface ServiceGroup {
  label: string;
  items: readonly string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  // Düz liste veya alt başlıklı gruplar (Kalıcı Makyaj)
  items?: readonly string[];
  groups?: readonly ServiceGroup[];
}

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  {
    id: 'epilasyon',
    title: 'Epilasyon',
    items: ['Kadın Erkek Epilasyon', 'Erkeklerde Kemer Üstü Komple', 'Bacak', 'Kadın Lazer Epilasyon'],
  },
  {
    id: 'cilt-bakimi',
    title: 'Cilt Bakımı',
    items: ['Hydrafacial (Profesyonel Cilt Bakımı)', 'Leke', 'Akne'],
  },
  {
    id: 'vucut-sekillendirme',
    title: 'Vücut Şekillendirme',
    items: [
      'Bölgesel İncelme Sıkılaşma (Kadın & Erkek)',
      "Emslim (30 dk'da 30 bin mekik etkisi)",
      'Selülit Bakımı',
      'Popo Dikleştirme & Kaldırma',
    ],
  },
  {
    id: 'kirpik',
    title: 'Kirpik',
    items: ['İpek Kirpik', 'Kirpik Lifting'],
  },
  {
    id: 'kalici-makyaj',
    title: 'Kalıcı Makyaj',
    groups: [
      { label: 'Kaş', items: ['Microblading', 'Kıl Tekniği Kaş', 'Pudralama Kaş'] },
      { label: 'Göz', items: ['Dipliner', 'Ayliner'] },
      { label: 'Dudak', items: ['Dudak Renklendirme', 'Dudak Çerçeve'] },
    ],
  },
  {
    id: 'el-ayak-bakimi',
    title: 'El & Ayak Bakımı',
    items: ['Manikür', 'Pedikür', 'Kalıcı Oje', 'Protez Tırnak'],
  },
];

