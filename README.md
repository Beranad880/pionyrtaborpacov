# Pionýrská skupina Pacov - Webové stránky

Moderní webové stránky pro Pionýrskou skupinu Pacov vytvořené v Next.js a Reactu.

## Technologie

- **Next.js 16** - React framework s podporou SSR a optimalizace
- **React 19** - Frontend knihovna
- **TypeScript** - Typová bezpečnost
- **Tailwind CSS** - Utility-first CSS framework pro rychlé stylování
- **MongoDB + Mongoose** - Databáze pro správu obsahu a uživatelů
- **bcrypt** - Bezpečné hashování hesel
- **Responsive design** - Optimalizováno pro všechna zařízení

## Funkce

### ✅ Implementované funkce

- **Moderní design** - Čistý a přívětivý vzhled
- **Responsivní layout** - Funguje na mobilech, tabletech i desktopech
- **Navigace** - Sticky header s dropdown menu
- **Hlavní stránka**:
  - Hero sekce s pozadím
  - O nás sekce s informacemi o Pionýru
  - Kontaktní informace a statistiky
- **Kontaktní stránka** - Formulář a kontaktní údaje
- **Blog/Články** - Přehled novinek a aktivit
- **Kalendář akcí** - Nadcházející a proběhlé události
- **LDT Bělá** - Informace o letním táboře
- **Admin systém** - Zabezpečená správa obsahu s autentifikací
- **MongoDB integrace** - Databáze pro správu uživatelů a obsahu
- **SEO optimalizace** - Meta tagy, Open Graph
- **Czech localization** - Český obsah a formátování

### 🚧 Připravené pro rozšíření

- Fotogalerie
- Online přihlášky
- Newsletter
- Integrace s kalendářem
- Platební brána

## Struktura projektu

```
my-app/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel (zabezpečeno)
│   │   ├── login/         # Přihlášení do admin panelu
│   │   ├── layout.tsx     # Admin layout
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API endpointy
│   │   └── auth/          # Autentifikační API
│   ├── blog/              # Stránka s články
│   ├── kalendar-akci/     # Kalendář akcí
│   ├── kontakt/           # Kontaktní stránka
│   ├── ldt-bela/          # Informace o táboře
│   ├── layout.tsx         # Hlavní layout
│   ├── page.tsx           # Domovská stránka
│   └── globals.css        # Globální styly
├── components/            # Komponenty
│   ├── Header.tsx         # Hlavička s navigací
│   ├── Footer.tsx         # Patička
│   ├── Hero.tsx           # Hero sekce
│   ├── AboutSection.tsx   # O nás sekce
│   ├── ContactSection.tsx # Kontaktní sekce
│   └── ContactForm.tsx    # Kontaktní formulář
├── lib/                   # Knihovny a utils
│   ├── auth-admin.ts      # Admin autentifikace
│   └── mongoose.ts        # MongoDB připojení
├── models/                # MongoDB modely
│   └── AdminUser.ts       # Model admin uživatele
├── scripts/               # Utility skripty
│   └── manage-admin-users.js # Správa admin účtů
├── data/                  # Datové soubory
│   └── content.ts         # Obsah stránek
├── middleware.ts          # Next.js middleware pro auth
└── public/                # Statické soubory
```

## Spuštění projektu

### Předpoklady

- Node.js 18 nebo novější
- npm nebo yarn
- MongoDB (lokální nebo cloud - MongoDB Atlas)

### Instalace a spuštění

1. **Konfigurace prostředí**:
   Vytvořte soubor `.env.local` s MongoDB připojením:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/pionyr-pacov
   # Nebo pro MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pionyr-pacov
   ```

2. **Instalace závislostí**:
   ```bash
   npm install
   ```

3. **Vytvoření prvního admin uživatele**:
   ```bash
   npm run admin:add admin vase_heslo123
   ```

4. **Spuštění vývojového serveru**:
   ```bash
   npm run dev
   ```

5. **Otevření v prohlížeči**:
   - Hlavní stránka: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Admin přihlášení: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Další příkazy

```bash
# Build pro produkci
npm run build

# Spuštění produkční verze
npm start

# Linting
npm run lint

# Správa admin uživatelů
npm run admin:list                    # Vypsat všechny admin účty
npm run admin:add <username> <password>  # Přidat nový admin účet
npm run admin:remove <username>       # Odstranit admin účet
```

## Admin systém

### Přístup k admin panelu

1. **URL admin panelu**: [http://localhost:3000/admin](http://localhost:3000/admin)
2. **Přihlášení**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Správa admin účtů

```bash
# Přidat nový admin účet
npm run admin:add administrator silne_heslo123

# Vypsat všechny admin účty
npm run admin:list

# Odstranit admin účet
npm run admin:remove stary_admin
```

### Bezpečnostní funkce

- **Bcrypt hashování** - Hesla jsou bezpečně hashována s bcrypt
- **Cookie-based auth** - Relace jsou spravovány přes HttpOnly cookies
- **Middleware ochrana** - Všechny admin stránky jsou automaticky chráněny
- **Session timeout** - Automatické odhlášení po 7 dnech neaktivity

## Konfigurace obsahu

Veškerý obsah stránek je centralizovaný v souboru `data/content.ts`. Můžete zde upravovat:

- Kontaktní informace
- Menu navigace
- Texty o organizaci
- Statistiky členů
- Sociální média

## Úpravy designu

Design využívá Tailwind CSS. Hlavní barvy:

- **Primární červená**: `red-600` (#dc2626)
- **Šedá**: `gray-900`, `gray-700`, `gray-600`
- **Pozadí**: `gray-50`, `white`

## Nasazení

Projekt je připraven pro nasazení na:

- **Vercel** (doporučeno pro Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server** s Node.js

### Vercel (nejjednodušší)

1. Nahrajte kód na GitHub
2. Přihlaste se na [vercel.com](https://vercel.com)
3. Importujte projekt z GitHubu
4. Automaticky se nasadí

## Budoucí rozšíření

### Prioritní
1. **Admin správa obsahu** - Rozšíření admin panelu o správu článků, událostí
2. **Fotogalerie** - Přidání galerií z akcí
3. **Online přihlášky** - Formuláře pro tábory a akce
4. **Newsletter** - Mailchimp nebo SendGrid integrace

### Volitelné
1. **Uživatelské účty** - Login pro členy
2. **Kalendář** - Google Calendar integrace
3. **Platby** - Stripe pro poplatky
4. **Multi-language** - Přidání angličtiny

## Kontakt

Pro technické dotazy k webovým stránkám kontaktujte vývojářský tým nebo správce webu.

---

**Poznámka**: Tento projekt nahrazuje původní stránky na Webnode a poskytuje moderní, rychlé a snadno spravovatelné řešení pro webovou prezentaci Pionýrské skupiny Pacov.
