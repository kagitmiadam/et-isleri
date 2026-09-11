#!/usr/bin/env node
/**
 * index.html içindeki mutlak URL'leri toplu değiştirir ve
 * robots noindex etiketini açıp kapatır.
 *
 *   node scripts/set-domain.mjs https://etisleri.com.tr/
 *   node scripts/set-domain.mjs https://demo.canturk.dev/et-isleri/ --noindex
 *
 * Mevcut adresi <link rel="canonical"> üzerinden bulur, o yüzden
 * "şu anki adres neydi" diye hatırlamana gerek yok.
 *
 * Etkilenen alanlar: canonical, og:url, og:image, twitter:image,
 * JSON-LD (url / logo / image) ve markup'taki mutlak bağlantılar.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FILE = join(ROOT, 'index.html')

const args = process.argv.slice(2)
const noindex = args.includes('--noindex')
const target = args.find((a) => !a.startsWith('--'))

if (!target) {
   console.error('Kullanım: node scripts/set-domain.mjs <https://adres/> [--noindex]')
   process.exit(1)
}

let url
try {
   url = new URL(target)
} catch {
   console.error(`Geçersiz URL: ${target}`)
   process.exit(1)
}
if (url.protocol !== 'https:') {
   console.error('Adres https:// ile başlamalı (og:image ve canonical için gerekli).')
   process.exit(1)
}

// sondaki / garanti
const yeni = url.href.endsWith('/') ? url.href : `${url.href}/`

let html = readFileSync(FILE, 'utf8')

// --- mevcut adresi canonical'dan oku ---
const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)
if (!canonical) {
   console.error('<link rel="canonical"> bulunamadı; hangi adresin değişeceğini çıkaramıyorum.')
   process.exit(1)
}
const eski = canonical[1].endsWith('/') ? canonical[1] : `${canonical[1]}/`

if (eski === yeni) {
   console.log(`Adres zaten ${yeni}`)
} else {
   const adet = html.split(eski).length - 1
   html = html.split(eski).join(yeni)
   console.log(`  ${eski}  ->  ${yeni}   (${adet} yer)`)
}

// --- robots ---
const ROBOTS = '      <meta name="robots" content="noindex, nofollow" />\n'
const varMi = html.includes('name="robots"')

if (noindex && !varMi) {
   // canonical satırının hemen ardına ekle
   html = html.replace(/(<link\s+rel="canonical"[^>]*>\n)/i, `$1\n${ROBOTS}`)
   console.log('  robots noindex, nofollow EKLENDİ')
} else if (!noindex && varMi) {
   html = html.replace(/[ \t]*<meta\s+name="robots"[^>]*>\n/i, '')
   console.log('  robots noindex KALDIRILDI — sayfa indekslenebilir')
} else {
   console.log(`  robots noindex: ${varMi ? 'zaten var' : 'zaten yok'}`)
}

writeFileSync(FILE, html.replace(/\n{3,}/g, '\n\n'), 'utf8')

console.log('\nUnutma:')
console.log('  - assets/ altındaki logo, favicon, video ve görselleri de değiştir')
console.log('  - yasal metinlerdeki firma adı / e-posta / yürürlük tarihini güncelle')
console.log('  - npm run build')
