# Admin Panel - Průvodce

## 🎯 Přehled

Admin panel umožňuje snadnou správu obsahu webových stránek Pionýrské skupiny Pacov bez nutnosti upravovat kód.

## 🔐 Přístup

**URL:** `/admin`
**Uživatelské jméno:** `admin`
**Heslo:** `pionyr2025!`

> ⚠️ **Bezpečnost:** V produkci změňte heslo v souboru `lib/auth-admin.ts`

## 📋 Funkce Admin Panelu

### 🏠 **Úvodní stránka** (`/admin/home`)
Editace hlavní stránky webu:
- **Hero sekce:** Nadpis, podnadpis, background obrázek
- **Sekce "O nás":** Nadpis, citát, odstavce textu
- **Sekce "Pionýr":** Popis, ideály, obsah
- **Historie:** Nadpis a obsah

### 👥 **Pionýrské oddíly** (`/admin/pioneer-groups`)
Správa oddílů a jejich aktivit:
- Základní informace o oddílech
- Jednotlivé oddíly (název, věk, popis, aktivity)
- Informace o zapojení nových členů

### 🏕️ **Hájenka Bělá** (`/admin/hajenka-bela`)
Informace o táborové základně:
- Základní popis
- Seznam vybavení
- Nabízené aktivity
- Poloha a GPS souřadnice

### 📞 **Kontakty a statistiky** (`/admin/contacts`)
Správa kontaktních údajů a členských dat:
- **Základní info:** Název organizace, popis
- **Kontakty:** Email, telefon, adresa, účet, IČ, DIČ
- **Sociální sítě:** Facebook, Instagram
- **Vedení:** Vedoucí, hospodář, revizor, delegáti
- **Statistiky:** Věkové složení, počty členů

## 💾 Ukládání dat

Admin panel podporuje **hybridní přístup**:

1. **MongoDB databáze** - primární úložiště (pokud je dostupná)
2. **Statický soubor** - fallback (`data/content.ts`)

### API Endpoints

```typescript
// Uložení obsahu
POST /api/admin/content
{
  "page": "home",
  "content": { /* obsah stránky */ }
}

// Načtení obsahu (pro frontend)
GET /api/content?page=home

// Načtení všeho obsahu
PUT /api/admin/content
```

## 🛠️ Technické detaily

### Struktura dat

```typescript
// Centrální úložiště v data/content.ts
export const allPagesContent = {
  home: { /* údaje úvodní stránky */ },
  pioneerGroups: { /* oddíly */ },
  hajenkaBela: { /* hájenka */ },
  // ...
}

export const siteData = {
  title: "Pionýrská skupina Pacov",
  contact: { /* kontakty */ },
  leadership: { /* vedení */ },
  statistics: { /* statistiky */ }
}
```

### MongoDB Model

```typescript
interface IContent {
  page: string;           // identifikátor stránky
  content: any;           // obsah stránky
  version: number;        // verze (auto-increment)
  lastModified: Date;     // poslední úprava
  modifiedBy: string;     // kdo upravil
}
```

### Autentifikace

Jednoduchá session-based autentifikace:
- Token uložen v localStorage
- Platnost 8 hodin
- Automatické odhlášení při expiraci

## 🔧 Rozšíření

### Přidání nové stránky

1. **Rozšiřte data strukturu** v `data/content.ts`:
```typescript
export const allPagesContent = {
  // ...existující
  novaStranka: {
    title: "Nová stránka",
    content: "Obsah..."
  }
}
```

2. **Přidejte do navigace** v `app/admin/layout.tsx`:
```typescript
const adminPages = [
  // ...existující
  { name: 'Nová stránka', href: '/admin/nova-stranka', icon: '📄' },
];
```

3. **Vytvořte admin stránku** `app/admin/nova-stranka/page.tsx`:
```typescript
// Kopírujte a upravte existující admin stránku
```

### Přidání nového pole

V admin stránce přidejte:
```typescript
const updateField = (field: string, value: string) => {
  setContent(prev => ({
    ...prev,
    [field]: value
  }));
};

// V JSX:
<input
  value={content.newField}
  onChange={(e) => updateField('newField', e.target.value)}
/>
```

## 📱 Responzivní design

Admin panel je optimalizován pro:
- **Desktop** - plná funkcionalita
- **Tablet** - skládací sidebar
- **Mobile** - optimalizované formuláře

## 🚀 Produkční nasazení

### Bezpečnostní opatření

1. **Změňte hesla:**
```typescript
// lib/auth-admin.ts
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'strong-password-here',
};
```

2. **Nastavte ENV proměnné:**
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=very-strong-password-123
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

3. **HTTPS pouze** - admin panel by měl běžet pouze přes HTTPS

### Monitoring

- Logy uložených změn v MongoDB
- Verzování obsahu
- Backup statických dat

## 🆘 Řešení problémů

### Admin panel nefunguje
1. Zkontrolujte připojení k databázi
2. Ověřte správnost přihlašovacích údajů
3. Zkontrolujte konzoli prohlížeče pro chyby

### Změny se neuložily
1. Zkontrolujte síťová spojení
2. Ověřte MongoDB připojení
3. Zkontrolujte API response v Network tabu

### Zapomenuté heslo
1. Změňte heslo v `lib/auth-admin.ts`
2. Restartujte aplikaci
3. Nebo použijte ENV proměnné

## 📞 Podpora

Pro technické dotazy nebo problémy kontaktujte vývojářský tým.