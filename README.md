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
│   ├── manage-admin-users.js # Správa admin účtů CLI
│   ├── import-admin-credentials.js # Import z JSON souboru
│   └── README-admin-import.md # Dokumentace k importu
├── data/                  # Datové soubory
│   └── content.ts         # Obsah stránek
├── middleware.ts          # Next.js middleware pro auth
├── admin_credentials.json.example # Ukázkový formát pro import
├── .gitignore             # Git ignore (obsahuje admin_credentials.json)
└── public/                # Statické soubory

# Soubory necommittované do Gitu (v .gitignore):
├── admin_credentials.json # JSON s admin údaji (vytváří se ručně)
├── .env                   # Environment proměnné
└── .env.local             # Lokální environment proměnné
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

## 👨‍💼 Jak založit admin uživatele

### Nejrychlejší způsob - CLI příkaz
```bash
# Základní syntaxe
npm run admin:add <username> <heslo>

# Příklad
npm run admin:add admin mojeheslo123
```

### Alternativní způsob - JSON import

1. **Vytvořte soubor `admin_credentials.json`**:
```json
{
  "admins": [
    {
      "username": "admin",
      "password": "strongpassword123"
    },
    {
      "username": "manager",
      "password": "anotherstrongpass456"
    }
  ]
}
```

2. **Importujte admin uživatele**:
```bash
npm run admin:import
```

3. **❗ DŮLEŽITÉ**: Smažte `admin_credentials.json` po importu z bezpečnostních důvodů!

### Správa admin účtů

```bash
# Seznam všech admin uživatelů
npm run admin:list

# Odstranění admin uživatele
npm run admin:remove oldadmin

# Synchronizace z JSON souboru
npm run admin:sync
```

### Bezpečnostní doporučení

✅ **Doporučená hesla**:
- Minimálně 8 znaků (doporučeno 12+)
- Kombinace velkých a malých písmen
- Čísla a speciální znaky
- Nepoužívejte běžná hesla jako "admin123"

❌ **Bezpečnostní rizika**:
- Necommittujte `admin_credentials.json` do Gitu
- Smažte JSON soubor po importu
- Nepoužívejte slabá hesla

### Další příkazy

```bash
# Build pro produkci
npm run build

# Spuštění produkční verze
npm start

# Linting
npm run lint

# Správa admin uživatelů
npm run admin:list                         # Vypsat všechny admin účty
npm run admin:add <username> <password>    # Přidat nový admin účet
npm run admin:remove <username>            # Odstranit admin účet
npm run admin:sync                         # Synchronizovat admin_credentials.json → MongoDB
npm run admin:import [cesta_k_souboru]     # Import z JSON souboru
npm run admin:manage                       # Interaktivní správa admin účtů
```

## Admin systém

### Přístup k admin panelu

1. **URL admin panelu**: [http://localhost:3000/admin](http://localhost:3000/admin)
2. **Přihlášení**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### Správa admin účtů

### Základní správa účtů

```bash
# Přidat nový admin účet (ukládá do MongoDB + admin_credentials.json)
npm run admin:add adam heslo123

# Vypsat všechny admin účty z MongoDB
npm run admin:list

# Odstranit admin účet (z MongoDB + admin_credentials.json)
npm run admin:remove stary_admin

# Synchronizovat admin_credentials.json → MongoDB
npm run admin:sync
```

### Práce s admin_credentials.json

Pro hromadný import nebo backup admin účtů můžete použít JSON soubor:

1. **Vytvoření admin_credentials.json souboru**:
   ```json
   {
     "admins": [
       {
         "username": "admin",
         "password": "admin123456"
       },
       {
         "username": "superuser",
         "password": "supersecret789"
       }
     ]
   }
   ```

2. **Import z JSON souboru**:
   ```bash
   # Import z defaultního admin_credentials.json
   npm run admin:import

   # Import z vlastního souboru
   npm run admin:import path/to/your/credentials.json
   ```

3. **Automatická synchronizace**:
   ```bash
   # Synchronizace JSON → MongoDB (pouze nové uživatele)
   npm run admin:sync
   ```

### Workflow správy admin účtů

```bash
# Metoda 1: Individuální přidávání (doporučeno)
npm run admin:add admin password123      # Přidá do MongoDB + JSON
npm run admin:add manager secret456      # Přidá do MongoDB + JSON

# Metoda 2: Hromadný import z JSON
# 1. Vytvořte admin_credentials.json s více uživateli
# 2. Importujte je:
npm run admin:import

# Metoda 3: Synchronizace existujícího JSON
npm run admin:sync                       # Přidá pouze nové z JSON do MongoDB

# Zobrazení všech účtů
npm run admin:list

# Odstranění účtu
npm run admin:remove olduser             # Odstraní z MongoDB + JSON
```

### Bezpečnostní poznámky

⚠️ **Důležité**:
- `admin_credentials.json` je automaticky v `.gitignore` - necommittuje se
- Hesla jsou v JSON souboru v čistém textu - **smažte soubor po importu**
- V MongoDB jsou hesla bezpečně hashována pomocí bcrypt
- Používejte silná hesla (min. 12 znaků)

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

#### Příprava admin uživatelů pro produkci

1. **Vytvořte admin_credentials.json lokálně** (v kořenu projektu):
   ```json
   {
     "admins": [
       {
         "username": "admin",
         "password": "your-strong-password-123"
       },
       {
         "username": "manager",
         "password": "another-strong-password-456"
       }
     ]
   }
   ```

2. **Commitněte soubor do Gitu**:
   ```bash
   # Dočasně odstraníme admin_credentials.json z .gitignore
   git add admin_credentials.json
   git commit -m "Add production admin credentials"
   ```

#### Nasazení na Vercel

1. Nahrajte kód na GitHub
2. Přihlaste se na [vercel.com](https://vercel.com)
3. Importujte projekt z GitHubu
4. V nastavení projektu přidejte environment variable:
   ```
   MONGODB_URI=your-production-mongodb-connection-string
   ```
5. Po nasazení se automaticky:
   - Připojí k produkční MongoDB databázi
   - Načtou admin uživatelé z `admin_credentials.json`
   - Vytvoří se produkční admin účty s hashem hesel

#### Po nasazení

```bash
# Okamžitě odstraňte admin_credentials.json ze systému
git rm admin_credentials.json
git commit -m "Remove admin credentials after deployment"
git push

# Ověřte, že admin panel funguje
# Přejděte na: https://your-app.vercel.app/admin/login
```

⚠️ **Bezpečnost**: `admin_credentials.json` obsahuje hesla v čistém textu - odstraňte ho ihned po nasazení!

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
