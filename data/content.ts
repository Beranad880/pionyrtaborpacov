interface MenuItem {
  title: string;
  href: string;
  submenu?: MenuItem[];
}

interface AgeGroup {
  range: string;
  count: number;
}

interface PioneerGroup {
  name: string;
  ageRange: string;
  description: string;
  activities: string[];
}

interface Equipment {
  name: string;
  description: string;
}

interface Activity {
  name: string;
  description: string;
}

interface PageContent {
  [key: string]: any;
}

export const siteData = {
  title: "Pionýrská skupina Pacov",
  description: "Pionýr je demokratický, dobrovolný, samostatný a nezávislý spolek dětí, mládeže a dospělých. Předmětem hlavní činnosti Pionýra je veřejně prospěšná činnost.",

  contact: {
    email: "mareseznam@seznam.cz",
    phone: "+420 607 244 526",
    address: "Jana Autengrubera 227, 390 01 Pacov",
    bankAccount: "621161309/0800",
    ico: "606 625 81",
    dic: "CZ 606 625 81"
  },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61573658450126",
    instagram: "https://www.instagram.com/ldtbela"
  },

  leadership: {
    leader: "Mgr. Ladislav Mareš, Autengruberova 227, Pacov",
    treasurer: "Mgr. Marcela Kršková, Dlouhá 980, Pacov",
    auditor: "Mgr. Lenka Klátilová, Sídl. Míru 926, Pacov",
    delegates: [
      "Mgr. Ladislav Mareš",
      "Jaroslav Praveček"
    ]
  },

  statistics: {
    ageGroups: [
      { range: "do 9 let", count: 18 },
      { range: "10 – 12 let", count: 9 },
      { range: "13 – 15 let", count: 11 },
      { range: "16 – 18 let", count: 19 },
      { range: "19 – 26 let", count: 5 },
      { range: "27 let a více", count: 13 }
    ],
    total: 75,
    councilMembers: 10,
    leadershipMembers: 3,
    krpDelegates: 2,
    foundedGroups: 3
  },

  menu: [
    { title: "Úvod", href: "/" },
    { title: "Pionýrské oddíly", href: "/pages?page=pionyrske-oddily" },
    { title: "Hájenka Bělá", href: "/pages?page=hajenka-bela" },
    { title: "Kalendář akcí", href: "/pages?page=kalendar-akci" },
    { title: "Pronájem Hájenky Bělá", href: "/pages?page=pronajem-hajenky-bela" },
    { title: "Články", href: "/pages?page=clanky" },
    { title: "Fotky z akcí", href: "/pages?page=fotky-z-akci" }
  ] as MenuItem[]
};

export const pageContent = {
  hero: {
    title: "Pionýrská skupina Pacov",
    backgroundImage: "/images/hero-bg.jpg"
  },

  about: {
    title: "Kdo jsme?",
    subtitle: "Pionýr je demokratický, dobrovolný, samostatný a nezávislý spolek dětí, mládeže a dospělých. Předmětem hlavní činnosti Pionýra je veřejně prospěšná činnost.",
    content: [
      "Být pionýrem může zkusit každý… Znamená to hlavně setkávání s kamarády a společné hledání, poznávání, objevování nových světů i vlastně úplně obyčejných věcí.",
      "Pionýři chodí na výpravy, sportují, hrají deskovky, jezdí na kolech, soutěží, zpívají a hrají na kytaru, malují, natáčejí videa… – poznávají život ze všech možných stránek, spolupracují, nebojí se těžkostí a problémů, snaží se s nimi vyrovnávat čestně, hlásí se ke svým úkolům i průšvihům, nemají své slovo za cár papíru, překonávají bariéry nabídkou příležitostí…",
      "Být pionýrem přináší přátele, zážitky, romantiku a dobrodružství i v tzv. všedním životě. Ideály Pionýra nejsou příkazy, ale mety. K jejich dosahování je potřebná chuť i vůle, rozvoj sebe sama i týmového ducha."
    ]
  },

  pioneer: {
    description: "je spolek, který se věnuje výchovné práci s dětmi a mládeží ve volném čase. Naše oddíly a kluby nabízejí činnost dívkám i chlapcům na více než 600 místech po celé republice. Velká část aktivit Pionýra je otevřená veřejnosti.",

    ideals: {
      title: "Ideály Pionýra",
      description: "Ideály Pionýra jsou otevřenou bránou a výzvou. Jde o základní kameny naší výchovné práce. Vyjadřují možná poněkud abstraktní hodnoty, předávané však dětem srozumitelně – pomocí her, osobním příkladem…",
      content: [
        "Není účelem umět Ideály recitovat jako básničku ani dosáhnout jakési cílové pásky, ale naopak vnímat je jako vodítka v konkrétních situacích, stále je totiž co zlepšovat – na nás samotných i v okolí. Děti je třeba i nevědomě vnímají a prožívají při každé aktivitě. Stezka odvahy či táborová noční hlídka se neobejde bez Překonání, společný úklid klubovny je prvním krůčkem k Pomoci i chápání Ideálu Příroda, výlet do muzea spojuje Poznání i Paměť, umění přiznat vlastní chybu je jednou z mnoha tváří Ideálu Pravda - prožitek toho všeho s kamarády je podstatou Ideálu Přátelství.",
        "Hodnoty vyjádřené Ideály Pionýra jsou trvalé, nepodléhají aktuálním trendům. Společně tvoří nerozlučně propojený celek, který nabízí ohromné množství pohledů a způsobů vnímání. Cíl je však stále stejný – výchova slušného aktivního člověka."
      ]
    }
  },

  history: {
    title: "Vznik Pionýrské skupiny Pacov",
    content: "Pionýrská skupina Pacov vznikla 1. ledna 2014 zápisem do spolkového rejstříku jako pobočný spolek Pionýra – svého zakladatele. Skupina jako taková ale kontinuálně navazuje na činnost Pionýra Za Branou Pacov (25. Výročí obnovené činnosti - 1990) a ještě předtím na činnost sdružení Pionýr, kdy jako datum ustavení pionýrské skupiny u základní školy Za Branou Pacov je uveden školní rok 1961/1962."
  }
};

// Rozšířený obsah pro všechny stránky
export const allPagesContent: PageContent = {
  // Úvodní stránka (již definovaná výše jako pageContent)
  home: {
    hero: {
      title: "Pionýrská skupina Pacov",
      backgroundImage: "/44780.jpg",
      subtitle: "Demokratický, dobrovolný spolek dětí, mládeže a dospělých"
    },
    about: pageContent.about,
    pioneer: pageContent.pioneer,
    history: pageContent.history
  },

  // Pionýrské oddíly
  pioneerGroups: {
    title: "Pionýrské oddíly",
    description: "Naše pionýrské oddíly poskytují zážitkové aktivity pro děti a mládež různých věkových kategorií.",
    groups: [
      {
        name: "Mladší pionýři",
        ageRange: "6-10 let",
        description: "Hry, rukodělné aktivity, poznávání přírody a základy táborových dovedností.",
        activities: [
          "Táborové hry",
          "Rukodělné aktivity",
          "Poznávání přírody",
          "Základy táborových dovedností",
          "Sportovní hry"
        ]
      },
      {
        name: "Starší pionýři",
        ageRange: "11-15 let",
        description: "Dobrodružné výpravy, sportovní aktivity, projekty a komunitní služba.",
        activities: [
          "Dobrodružné výpravy",
          "Sportovní aktivity",
          "Komunitní projekty",
          "Leadership aktivity",
          "Outdoorové dovednosti"
        ]
      },
      {
        name: "Roveři",
        ageRange: "16+ let",
        description: "Vedení mladších skupin, organizace akcí a rozvoj leadership dovedností.",
        activities: [
          "Vedení mladších skupin",
          "Organizace akcí",
          "Leadership dovednosti",
          "Mentoring",
          "Projektové řízení"
        ]
      }
    ],
    joinInfo: {
      title: "Jak se zapojit?",
      description: "Pokud máte zájem o zapojení do našich oddílů, kontaktujte nás pomocí níže uvedených údajů nebo navštivte některou z našich akcí."
    }
  },

  // Hájenka Bělá
  hajenkaBela: {
    title: "Hájenka Bělá",
    description: "Hájenka Bělá je naším táborovým centrem a základnou pro většinu našich aktivit. Nachází se v krásném přírodním prostředí, které nabízí ideální podmínky pro táborování a outdoorové aktivity.",
    details: "Objekt prošel rekonstrukcí a poskytuje moderní zázemí při zachování autentické táborové atmosféry.",
    equipment: [
      "Ubytování pro 30+ osob",
      "Vybavená kuchyně a jídelna",
      "Sociální zařízení",
      "Klubovna pro společné aktivity",
      "Ohniště a grilovací místo",
      "Sportovní areál",
      "Okolní lesy a příroda"
    ],
    activities: [
      "Táborové hry a programy",
      "Turistické výlety",
      "Sportovní aktivity",
      "Rukodělné dílny",
      "Večerní ohně",
      "Pozorování hvězd",
      "Přírodovědné programy"
    ],
    location: {
      title: "Poloha a dostupnost",
      description: "Hájenka Bělá se nachází v klidné přírodní lokalitě s dobrou dostupností jak automobilem, tak veřejnou dopravou. Okolí nabízí mnoho možností pro turistiku a poznávání přírody.",
      gps: "49.4835, 15.2611",
      nearestTown: "Pacov (5 km)"
    },
    images: {
      exterior: "/images/hajenka-exterior.jpg"
    }
  },

  // Pronájem Hájenky Bělá
  rentalHajenkaBela: {
    title: "Pronájem Hájenky Bělá",
    description: "Nabízíme pronájem naší táborové základny Hájenka Bělá pro vaše akce, školení, teambuildingy nebo rodinné oslavy.",
    features: [
      "Kapacita až 30 osob",
      "Plně vybavená kuchyně",
      "Společenské prostory",
      "Venkovní ohniště",
      "Parkování",
      "Krásné přírodní prostředí"
    ],
    pricing: {
      title: "Ceník a podmínky",
      description: "Ceny se liší podle délky pobytu, počtu osob a typu akce. Kontaktujte nás pro konkrétní cenovou nabídku.",
      deposit: "Vyžadujeme rezervační zálohu ve výši 50% celkové ceny.",
      rules: [
        "Maximální kapacita 30 osob",
        "Check-in od 15:00, check-out do 11:00",
        "Zákaz kouření v objektu",
        "Respektování nočního klidu",
        "Úklid před odjezdem"
      ]
    },
    booking: {
      title: "Rezervace a informace",
      description: "Pro rezervaci nebo více informací nás kontaktujte:",
      steps: [
        "Kontaktujte nás s termínem a počtem osob",
        "Domluvíme si podmínky a cenu",
        "Uhradíte rezervační zálohu",
        "Potvrdíme rezervaci"
      ]
    }
  },

  // Kalendář akcí
  calendar: {
    title: "Kalendář akcí",
    description: "Přehled všech nadcházejících akcí, schůzek a táborů naší pionýrské skupiny.",
    upcomingEvents: {
      title: "Nadcházející akce",
      description: "Seznam všech naplánovaných aktivit na následující měsíce."
    },
    eventTypes: [
      {
        type: "Schůzky",
        description: "Pravidelné týdenní schůzky oddílů",
        frequency: "Každý týden"
      },
      {
        type: "Výlety",
        description: "Jednodenní výlety a akce",
        frequency: "1-2x měsíčně"
      },
      {
        type: "Tábory",
        description: "Víkendové a prázdninové tábory",
        frequency: "Podle sezóny"
      },
      {
        type: "Speciální akce",
        description: "Oslavy, soutěže a komunitní akce",
        frequency: "Příležitostně"
      }
    ]
  },

  // Články
  articles: {
    title: "Články a novinky",
    description: "Aktuální zpravodajství, reportáže z akcí a další zajímavé články z našeho pionýrského života.",
    categories: [
      {
        name: "Novinky",
        description: "Aktuální zprávy a oznámení"
      },
      {
        name: "Reportáže",
        description: "Zprávy z našich akcí a táborů"
      },
      {
        name: "Informace",
        description: "Užitečné informace pro rodiče a členy"
      }
    ],
    latestArticles: {
      title: "Nejnovější články",
      description: "Přečtěte si naše nejnovější příspěvky a zůstaňte v obraze."
    }
  },

  // Fotky z akcí
  photos: {
    title: "Fotky z akcí",
    description: "Galerie fotografií z našich akcí, táborů a různých aktivit. Zde najdete vzpomínky na krásné chvíle strávené společně.",
    albums: {
      title: "Fotoalba",
      description: "Procházejte našimi fotoalby seřazenými podle akcí a dat."
    },
    privacy: {
      title: "Ochrana soukromí",
      description: "Všechny fotografie jsou zveřejněny se souhlasem účastníků nebo jejich zákonných zástupců."
    },
    download: {
      title: "Stažení fotografií",
      description: "Pro stažení fotografií ve vyšším rozlišení nás kontaktujte."
    }
  }
};