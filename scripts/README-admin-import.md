# Import Admin Credentials do MongoDB

Tento skript umožňuje importovat admin uživatele z JSON souboru do MongoDB kolekce `adminusers`.

## Použití

### 1. Vytvoření JSON souboru s přihlašovacími údaji

Vytvořte JSON soubor s admin údaji. Podporované formáty:

**Formát 1: Pole adminů**
```json
[
  {
    "username": "admin",
    "password": "admin123456"
  },
  {
    "username": "superuser",
    "password": "supersecret789"
  }
]
```

**Formát 2: Objekt s polem adminů**
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

**Formát 3: Jeden admin**
```json
{
  "username": "admin",
  "password": "admin123456"
}
```

### 2. Spuštění importu

**Pomocí npm scriptu:**
```bash
# Import z defaultního souboru admin_credentials.json
npm run admin:import

# Import z vlastního souboru
npm run admin:import path/to/your/credentials.json
```

**Přímo pomocí Node.js:**
```bash
# Import z defaultního souboru
node scripts/import-admin-credentials.js

# Import z vlastního souboru
node scripts/import-admin-credentials.js path/to/your/credentials.json
```

## Požadavky

- **Username**: minimálně 3 znaky, maximálně 30 znaků
- **Password**: minimálně 6 znaků
- Uživatelská jména musí být unikátní

## Chování skriptu

- **Hashování hesel**: Hesla jsou automaticky hashována pomocí bcrypt před uložením
- **Kontrola duplicit**: Existující uživatelé jsou přeskočeni
- **Validace**: Neplatné záznamy jsou přeskočeny s chybovou zprávou
- **Reporting**: Na konci se zobrazí shrnutí (importováno/přeskočeno/chyby)

## Příklady

```bash
# Základní import z admin_credentials.json
npm run admin:import

# Import z konkrétního souboru
npm run admin:import ./data/prod-admins.json

# Import z relativní cesty
npm run admin:import ../backup/admins.json

# Import z absolutní cesty
npm run admin:import /path/to/admins.json
```

## Bezpečnost

⚠️ **Důležité bezpečnostní poznámky:**

1. **Necommittujte** JSON soubory s hesly do git repozitáře
2. Použijte `.gitignore` pro vyloučení souborů s přihlašovacími údaji
3. Hesla by měla být **silná** (doporučeno 12+ znaků)
4. Po importu **smažte** JSON soubor s hesly
5. Používejte tento skript pouze v **bezpečném prostředí**

## Doporučený workflow

1. Vytvořte `admin_credentials.json` (lokálně, necommittujte)
2. Spusťte import: `npm run admin:import`
3. Ověřte úspěšný import: `npm run admin:list`
4. **Smažte** `admin_credentials.json` soubor
5. Test přihlášení přes admin panel