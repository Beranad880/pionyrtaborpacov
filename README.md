# Pionýrská skupina Pacov - Webové stránky

Moderní webové stránky pro Pionýrskou skupinu Pacov vytvořené v Next.js a Reactu.

## Technologie

- **Next.js 16** - React framework s podporou SSR a optimalizace
- **React 19** - Frontend knihovna
- **TypeScript** - Typová bezpečnost
- **Tailwind CSS** - Utility-first CSS framework pro rychlé stylování
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
- **SEO optimalizace** - Meta tagy, Open Graph
- **Czech localization** - Český obsah a formátování

### 🚧 Připravené pro rozšíření

- Fotogalerie
- Online přihlášky
- Správa obsahu (CMS)
- Uživatelské účty
- Newsletter
- Integrace s kalendářem
- Platební brána

## Struktura projektu

```
my-app/
├── app/                    # Next.js App Router
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
├── data/                  # Datové soubory
│   └── content.ts         # Obsah stránek
└── public/                # Statické soubory
```

## Spuštění projektu

### Předpoklady

- Node.js 18 nebo novější
- npm nebo yarn

### Instalace a spuštění

1. **Instalace závislostí**:
   ```bash
   npm install
   ```

2. **Spuštění vývojového serveru**:
   ```bash
   npm run dev
   ```

3. **Otevření v prohlížeči**:
   Přejděte na [http://localhost:3000](http://localhost:3000)

### Další příkazy

```bash
# Build pro produkci
npm run build

# Spuštění produkční verze
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

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
1. **CMS integrace** - Strapi nebo Sanity pro správu obsahu
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
