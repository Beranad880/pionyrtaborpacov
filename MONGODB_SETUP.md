# MongoDB Setup pro Pionýrskou skupinu Pacov

## 📋 Přehled

Tato aplikace používá MongoDB jako databázi s následujícími možnostmi připojení:
- **Mongoose** - pro práci s modely a schématy
- **Native MongoDB Driver** - pro pokročilé databázové operace

## 🚀 Rychlé spuštění

### 1. Nainstalujte MongoDB

#### Windows (doporučeno MongoDB Compass):
```bash
# Stáhněte MongoDB Community Server z:
# https://www.mongodb.com/try/download/community
```

#### Docker (alternativa):
```bash
docker run --name pionyr-mongo -p 27017:27017 -d mongo:latest
```

### 2. Nastavte environment proměnné

Zkopírujte `.env.example` do `.env.local`:
```bash
cp .env.example .env.local
```

Upravte `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/pionyrska-skupina
MONGODB_DB=pionyrska-skupina
```

**Pro MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pionyrska-skupina
```

### 3. Spusťte aplikaci a inicializujte databázi

```bash
# Spusťte dev server
npm run dev

# V novém terminálu inicializujte databázi
npm run db:init
```

### 4. Testujte připojení

```bash
# Test MongoDB připojení
npm run db:test

# Nebo navštivte:
# http://localhost:3000/api/test/mongodb
# http://localhost:3000/api/test/models
```

## 📊 Databázové modely

### User (Uživatelé)
```typescript
{
  name: string;              // Jméno a příjmení
  email: string;             // Email (unikátní)
  phone?: string;            // Telefon
  role: 'member' | 'leader' | 'admin';
  dateOfBirth?: Date;        // Datum narození
  address?: string;          // Adresa
  emergencyContact?: {...};  // Nouzový kontakt
  membershipStatus: 'active' | 'inactive' | 'pending';
  joinDate: Date;            // Datum vstupu
}
```

### Event (Akce)
```typescript
{
  title: string;             // Název akce
  description: string;       // Popis
  startDate: Date;           // Datum začátku
  endDate: Date;             // Datum konce
  location?: string;         // Místo konání
  type: 'meeting' | 'camp' | 'activity' | 'workshop' | 'other';
  maxParticipants?: number;  // Max. počet účastníků
  price?: number;            // Cena
  ageGroup?: {min, max};     // Věková kategorie
  organizer: ObjectId;       // Organizátor
  participants: ObjectId[];  // Účastníci
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}
```

### Article (Články)
```typescript
{
  title: string;             // Nadpis
  slug: string;              // URL slug
  content: string;           // Obsah
  excerpt: string;           // Výtah
  author: ObjectId;          // Autor
  category: 'news' | 'event-report' | 'general' | 'announcement';
  tags: string[];            // Tagy
  featuredImage?: string;    // Hlavní obrázek
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;        // Datum publikace
  views: number;             // Počet zobrazení
  comments: {...}[];         // Komentáře
}
```

## 🔧 Užitečné skripty

```bash
# Inicializace databáze s ukázkovými daty
npm run db:init

# Test MongoDB připojení
npm run db:test

# Spuštění dev serveru
npm run dev
```

## 🌐 API Endpointy pro testování

- `GET /api/test/mongodb` - Test základního připojení
- `GET /api/test/models` - Test modelů a CRUD operací

## 📁 Struktura souborů

```
lib/
├── mongodb.ts          # Základní MongoDB připojení
└── mongoose.ts         # Mongoose připojení s cache

models/
├── User.ts            # Model uživatele
├── Event.ts           # Model akcí/událostí
└── Article.ts         # Model článků

scripts/
└── init-db.ts         # Inicializační script

app/api/test/
├── mongodb/route.ts   # Test základního připojení
└── models/route.ts    # Test modelů
```

## 🔐 Bezpečnost

- Nikdy necommitujte `.env.local` do gitu
- Používejte silná hesla pro produkční databáze
- Pro produkci doporučujeme MongoDB Atlas s IP whitelistingem

## 🎯 Další kroky

1. Vytvořte API routers pro CRUD operace
2. Implementujte autentifikaci pro admin rozhraní
3. Přidejte validace a error handling
4. Nastavte indexy pro lepší výkon

## 📞 Podpora

Pro technické dotazy kontaktujte vývojářský tým nebo vytvořte issue v repository.