export const RANDOM_VERSES = [
  {
    id: 1,
    ref: { fr: "Jérémie 29:11", en: "Jeremiah 29:11" },
    text: {
      fr: "« Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »",
      en: "“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”"
    },
    theme: { fr: "Espérance & Avenir", en: "Hope & Future" }
  },
  {
    id: 2,
    ref: { fr: "Romains 8:38-39", en: "Romans 8:38-39" },
    text: {
      fr: "« Car j'ai l'assurance que ni la mort ni la vie, ni rien dans toute la création, ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur. »",
      en: "“For I am convinced that neither death nor life, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.”"
    },
    theme: { fr: "Amour Inconditionnel", en: "Unconditional Love" }
  },
  {
    id: 3,
    ref: { fr: "Philippiens 4:6-7", en: "Philippians 4:6-7" },
    text: {
      fr: "« Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications. Et la paix de Dieu gardera vos cœurs. »",
      en: "“Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God. And the peace of God will guard your hearts.”"
    },
    theme: { fr: "Paix Intérieure", en: "Inner Peace" }
  },
  {
    id: 4,
    ref: { fr: "2 Corinthiens 5:17", en: "2 Corinthians 5:17" },
    text: {
      fr: "« Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées ; voici, toutes choses sont devenues nouvelles. »",
      en: "“Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!”"
    },
    theme: { fr: "Nouvelle Vie", en: "New Life" }
  },
  {
    id: 5,
    ref: { fr: "Jean 8:12", en: "John 8:12" },
    text: {
      fr: "« Je suis la lumière du monde ; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie. »",
      en: "“I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life.”"
    },
    theme: { fr: "Lumière & Direction", en: "Light & Guidance" }
  },
  {
    id: 6,
    ref: { fr: "Ésaïe 41:10", en: "Isaiah 41:10" },
    text: {
      fr: "« Ne crains rien, car je suis avec toi ; ne promène pas des regards inquiets, car je suis ton Dieu ; je te fortifie, je viens à ton secours. »",
      en: "“So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.”"
    },
    theme: { fr: "Force & Courage", en: "Strength & Courage" }
  },
  {
    id: 7,
    ref: { fr: "Psaume 23:1-3", en: "Psalm 23:1-3" },
    text: {
      fr: "« L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles. Il restaure mon âme. »",
      en: "“The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.”"
    },
    theme: { fr: "Repos & Réconfort", en: "Rest & Comfort" }
  },
  {
    id: 8,
    ref: { fr: "Jean 14:27", en: "John 14:27" },
    text: {
      fr: "« Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point. »",
      en: "“Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.”"
    },
    theme: { fr: "Paix du Christ", en: "Christ's Peace" }
  },
  {
    id: 9,
    ref: { fr: "1 Jean 4:19", en: "1 John 4:19" },
    text: {
      fr: "« Pour nous, nous l'aimons, parce qu'il nous a aimés le premier. »",
      en: "“We love because he first loved us.”"
    },
    theme: { fr: "Fondement de l'Amour", en: "Foundation of Love" }
  },
  {
    id: 10,
    ref: { fr: "Proverbes 3:5-6", en: "Proverbs 3:5-6" },
    text: {
      fr: "« Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers. »",
      en: "“Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.”"
    },
    theme: { fr: "Confiance & Foi", en: "Trust & Faith" }
  },
  {
    id: 11,
    ref: { fr: "Matthieu 28:20b", en: "Matthew 28:20b" },
    text: {
      fr: "« Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde. »",
      en: "“And surely I am with you always, to the very end of the age.”"
    },
    theme: { fr: "Présence Constante", en: "Constant Presence" }
  },
  {
    id: 12,
    ref: { fr: "Sophonie 3:17", en: "Zephaniah 3:17" },
    text: {
      fr: "« L'Éternel, ton Dieu, est au milieu de toi, comme un héros qui sauve ; Il fera de toi sa plus grande joie ; Il gardera le silence dans son amour ; Il aura pour toi des transports d'allégresse. »",
      en: "“The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.”"
    },
    theme: { fr: "Joie de Dieu", en: "God's Delight" }
  }
];

export function getRandomVerse() {
  const index = Math.floor(Math.random() * RANDOM_VERSES.length);
  return RANDOM_VERSES[index];
}
