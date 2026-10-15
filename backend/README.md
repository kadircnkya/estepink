# EstePink Backend

> Bu klasör ilerde backend API servisleri için kullanılacaktır.

## Planlanan Yapı

```
backend/
├── src/
│   ├── routes/        # API endpoint'leri
│   ├── controllers/   # İş mantığı
│   ├── models/        # Veritabanı modelleri
│   ├── middleware/     # Auth, validation vb.
│   └── utils/         # Yardımcı fonksiyonlar
├── config/
│   └── db.js          # Veritabanı bağlantısı
├── .env.example       # Ortam değişkenleri
├── package.json
└── server.js          # Giriş noktası
```

## Planlanan Özellikler

- [ ] Randevu API (oluşturma, güncelleme, silme)
- [ ] İletişim formu API
- [ ] Admin paneli API
- [ ] Galeri yönetimi API
- [ ] WhatsApp entegrasyonu
- [ ] E-posta bildirimleri

## Teknoloji Seçenekleri

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / PostgreSQL
- **ORM**: Mongoose / Prisma
