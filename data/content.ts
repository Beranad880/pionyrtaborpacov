interface MenuItem {
  title: string;
  href: string;
  submenu?: MenuItem[];
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
    { title: "Kalendář akcí", href: "/pages?page=kalendar-akci" },
    { title: "Hájenka Bělá", href: "/pages?page=hajenka-bela" },
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