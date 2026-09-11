# Landing Boilerplate

Tailwind tabanlı tek sayfa landing. Şu an **ET İşleri** bilgileriyle doldurulmuş
ve yayına hazır durumda.

| Alan     | Değer                   |
| -------- | ----------------------- |
| Firma    | ET İşleri               |
| Alan adı | etisleri.com.tr         |
| Telefon  | 0533 290 79 79          |
| E-posta  | siparis@etisleri.com.tr |

**Yayına hazır** — hedef alan adı `etisleri.com.tr`. `robots` etiketi yok,
tüm mutlak URL'ler gerçek alan adını gösteriyor.

> `etisleri.com.tr` şu an eski WordPress/Elementor sitesini sunuyor.
> Geçiş öncesi yedeklenmeli.

## Alan adı / ortam değiştirme

Mutlak URL'ler 8 ayrı yerde geçiyor (canonical, og:url, og:image,
twitter:image, JSON-LD url/logo/image ve markup'taki bir bağlantı).
Elle değiştirme — biri unutulursa sosyal önizleme kırılır veya canonical
yanlış sayfayı gösterir. Bunun yerine:

```bash
# canlı: noindex kaldırılır
npm run set-domain https://musteri-adresi.com/

# demo/staging: noindex eklenir
npm run set-domain https://demo.adresim.dev/proje/ -- --noindex
```

Mevcut adresi `<link rel="canonical">` üzerinden bulur; ne olduğunu
hatırlamana gerek yok. İdempotenttir, iki kez çalıştırmak zarar vermez.

## Yeni projeye uyarlama

1. `npm run set-domain https://yeni-adres.com/ -- --noindex`
2. `assets/` altındaki logo, video, görselleri değiştir + `favicon.png`
   (boyutlandırma komutları için **Varlık optimizasyonu** bölümüne bak)
3. `index.html` içinde firma adı, telefon, e-posta, `tel:`/`mailto:` linkleri
4. Yasal metinler: firma adı, e-posta, yürürlük tarihi — ve sayfada form
   yoksa "form aracılığıyla toplanan veriler" ifadelerini düzelt
5. `title`, `description` (110–160 karakter), `h1`, `og:image:alt`
6. `npm run build`

Yayına alırken `npm run set-domain https://yeni-adres.com/` (noindex'siz).

Başka bir proje için şablon olarak kullanacaksan bu dört değeri ve
`assets/` altındaki logo/video/görselleri değiştirmen yeterli.

## Çalıştırma

```bash
npm install     # ilk kurulum
npm run dev     # Tailwind watch + http://localhost:3000
```

`file://` ile **açma** — `index.html` betiği `type="module"` olarak yüklüyor ve tarayıcı bunu `file://` üzerinde CORS nedeniyle bloklar. Sayfa mutlaka bir HTTP sunucusu üzerinden açılmalı.

Tek seferlik derleme:

```bash
npm run build   # src/css/input.css -> assets/css/style.css (minified)
```

## Yapı

```
├── index.html
├── favicon.png
├── tailwind.config.js
├── postcss.config.js
├── src/css/                 <- KAYNAK (burada düzenle)
│   ├── input.css               giriş; import sırası kaskadı belirler
│   ├── vendor/swiper.css       Swiper CSS (script.js'teki sürümle eşleşir)
│   ├── base/variables.css      :root değişkenleri + .range-* akışkan tipografi
│   ├── base/theme-vars.css     renk paleti CSS değişkenleri (@layer base)
│   ├── base/iconfont.css       ikon fontu @font-face
│   ├── base/reset.css          projeye özel reset, .text-editor, [popover]
│   └── utilities/scroll-position.css
└── assets/                  <- YAYIN (build çıktısı + varlıklar)
    ├── css/style.css           ÜRETİLEN DOSYA — elle düzenleme
    ├── js/script.js            hazır bundle (gsap, Swiper, Cookies içinde)
    ├── font/iconfont/          ikon fontu dosyaları buraya
    ├── img/
    └── video/
```

> `assets/css/style.css` her build'de sıfırdan üretilir. Kalıcı CSS değişikliği için `src/css/` altındaki dosyaları düzenle.

## Biçimlendirme

```bash
npm run format         # yaz
npm run format:check   # sadece kontrol et (CI için)
```

Ayarlar `.prettierrc.json` içinde; projenin mevcut stiline uyacak şekilde **3 boşluk**
girinti kullanır. `prettier-plugin-tailwindcss` sınıfları Tailwind'in kendi sırasına göre dizer (kozmetik —
sınıfların HTML'deki sırası CSS'i etkilemez).

> Eklenti **0.6.11'e sabitlenmiştir**. 0.7+ sürümleri Tailwind v4'ü hedefler ve bu projenin
> v3 config'iyle çalıştırıldığında sınıf siliyor (cookie-box'tan `rounded-[8px]` ve
> `sm:rounded-none` kaybolmuştu). Tailwind v4'e geçmeden yükseltme.

`.prettierignore` dışarıda bırakır: build çıktısı (`assets/css/style.css`), hazır bundle
(`assets/js/script.js`), vendor CSS ve üretilmiş `theme-vars.css`.

## Popup sistemi

Popup'lar **native HTML Popover API** kullanır — özel JS yok:

```html
<!-- açma -->
<button type="button" popovertarget="privacy-popup">Gizlilik</button>

<!-- popup -->
<section id="privacy-popup" popover data-popup class="popup-field ...">
  <div class="content-wrapper fx ...">
    <button type="button" popovertarget="privacy-popup" popovertargetaction="hide">…</button>
  </div>
</section>
```

Tarayıcıdan bedava gelenler:

- **Top layer** — popover, `z-index` sıralamasının tamamen dışında en üstte durur.
  Cookie-box `z-[120]` olmasına rağmen popup'ın altında kalır.
- `Esc` ile kapanma
- Aynı anda tek popover açık kalır (`popover="auto"`)
- `<body>` scroll kilidi — `reset.css` içindeki `body:has([popover]:popover-open)`
- Fade + slide geçişleri — `[popover]` ve `.fx:is([popover] .content-wrapper)` kuralları

Sayfadaki tek satır JS, karartılmış zemine tıklayınca kapatmak içindir: popover tüm
ekranı kapladığı için tarayıcının light-dismiss davranışı tetiklenmez.

> `popovertarget` yalnızca `<button>` / `<input type=button>` üzerinde çalışır.
> Mevcut popup'lar:

| id               | İçerik                                         | Tetikleyiciler                                                             |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| `#custom-popup`  | Kişisel Verilerin Korunması / Çerez Politikası | formdaki "Aydınlatma Metni", cookie-box'taki "Kişisel Verilerin Korunması" |
| `#privacy-popup` | Gizlilik Politikası                            | cookie-box'taki "Gizlilik"                                                 |

> `#media` ve `#media-carousel` de aynı API'yi kullanır, ancak içerikleri
> `assets/js/script.js` tarafından doldurulur.

## Varlık optimizasyonu

Marka görselleri/videoları değiştirildiğinde aynı işlemden geçirilmeli.
Hepsi `ffmpeg` ile yapılır, ek bağımlılık yok.

**Arka plan videosu** — sessiz, 30fps, faststart (ilk byte'ta oynamaya başlar):

```bash
ffmpeg -i kaynak.mp4 -an -vf "fps=30" -c:v libx264 -profile:v high \
  -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart \
  assets/video/promotion-2.mp4
```

`-an` ses kanalını atar (arka plan videosu zaten `muted`). CRF 30 arka plan için
doğru nokta: CRF 27'ye göre %39 küçük, SSIM farkı yalnızca 0.008.

**Poster** — video yüklenene kadar görünen ilk kare:

```bash
ffmpeg -ss 1 -i assets/video/promotion-2.mp4 -frames:v 1 \
  -vf "scale=1600:-2" -c:v libwebp -quality 60 -compression_level 6 \
  assets/img/poster.webp
```

**Fotoğraf (og:image)** — JPEG kalsın; WhatsApp/Facebook WebP önizlemede güvenilmez:

```bash
ffmpeg -i kaynak.jpg -pix_fmt yuvj420p -q:v 5 assets/img/background.jpg
```

`-pix_fmt yuvj420p` önemli: kaynak 4:4:4 chroma ile gelirse dosya gereksiz büyür.

**Logo** — kayıpsız WebP, ekrandaki boyutun 2 katı genişlikte:

```bash
ffmpeg -i kaynak.png -vf "scale=840:-1" -c:v libwebp -lossless 1 \
  -quality 100 -compression_level 6 assets/img/logo.webp
```

Logoda kayıpsız kullan: keskin kenarlı metni kayıplı WebP bozuyor, aradaki fark
zaten ~1 KB. `<img>` üzerindeki `width`/`height` nitelikleri de güncellenmeli
(layout kaymasını / CLS önler).

> `assets/img/logo.png` kaynak dosya olarak duruyor; JSON-LD `logo` alanı da onu
> gösteriyor (schema tarayıcıları için PNG daha güvenli).

## Notlar

- `tailwind.config.js` kayıp orijinal config'ten geri çıkarıldı. Ekranlar **desktop-first** (`sm:` = `max-width: 768px`); `min-` önekliler min-width'tir.
- `content` taraması `assets/js/**/*.js`'i de kapsar — `script.js` runtime'da sınıf ekliyor (`max-w-[90dvw]`, `!translate-y-[125%]` gibi).
- `assets/js/script.js` derlenmiş bir bundle; kaynağı elimizde yok.
- **`script.js` elle yamalandı.** Bundle, şablonun bazı elemanlarını koşulsuz kullanıyordu
  (`document.querySelector(...).addEventListener(...)`); eleman silinince sayfa `TypeError`
  ile duruyordu. Koruma eklenen yerler: `.companyBox`/`.userBox`, `.cookie-box`, `header`
  (offsetHeight), `.media-carousel`. Bundle yeniden üretilirse bu yamalar kaybolur.

### Bilinen eksikler

- `assets/font/iconfont/` boş; `[class*=icon-]:before` kuralı var ama hiçbir `.icon-*` glyph kuralı tanımlı değil, o yüzden şu an font isteği atılmıyor.
- `shadow-popup`'ın orijinal değeri kayıp; `tailwind.config.js` içinde makul bir varsayılan tanımlı.
- **Açık adres yok.** İletişim kartındaki adres satırı kaldırıldı, JSON-LD de
  `Organization` olarak yazıldı. Adres eklenirse `@type` `Restaurant` yapılıp
  `address` alanı eklenmeli — yerel arama ve haritalar için gerekli.
- **Yasal metinler bir avukata okutulmalı.** KVKK/Çerez ve Gizlilik metinleri şablon
  kaynaklıdır. Sayfada form olmadığı için "ön kayıt formu" atıfları düzeltildi ve
  yürürlük tarihi 08.09.2026 yazıldı; içeriğin hukuki denetimi yapılmadı.
