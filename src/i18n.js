import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": {
        "title": "JOHN316",
        "begin": "BEGIN"
      },
      "character": {
        "title": "Who is participating?",
        "guide_placeholder": "Your name (Guide)",
        "friend_placeholder": "Your friend's name",
        "next": "NEXT",
        "back": "Back"
      },
      "options": {
        "title": "OPTIONS",
        "language": "Language",
        "tutorial": "Companion Manual (Tutorial)",
        "install": "Install App (Mobile / Desktop)",
        "sound": "Sound Effects",
        "about": "ABOUT US",
        "close": "Close",
        "resources": "Resources",
        "bible_app": "Download YouVersion Bible",
        "gospel_summary": "Gospel Message Summary",
        "back_to_resources": "Back to Resources",
        "random_verse": "Reveal a Promise",
        "church_boom": "Discover Église Boom",
        "read_luke": "Start Gospel of Luke (Luke 1)",
        "share_summary": "Share with my friend",
        "prayer_step_by_step": "Pray phrase by phrase",
        "prayer_full": "Full prayer",
        "next_phrase": "Next phrase",
        "finish_prayer": "Say Amen & Continue",
        "sound_hint": "Tip: If you hear no sound on iPhone, ensure the physical ring/silent switch on the side is ON."
      },
      "summary": {
        "title": "Evangelism Plan",
        "point_1": "1) God loves every person... and wants a personal relationship with each individual.",
        "verse_1_ref": "2 Peter 3:9",
        "verse_1": "« The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you, not wanting anyone to perish, but everyone to come to repentance. »",
        "point_2": "2) But the whole world is separated from God because of sin...",
        "verse_2_ref": "Romans 3:23",
        "verse_2": "« For all have sinned and fall short of the glory of God. »",
        "point_3": "3) God is holy and just. The sinner / sin cannot be with Him. Although God loves man, He condemned the sinner to eternal death, separation from God in hell.",
        "verse_3_ref": "Revelation 20:12-15",
        "verse_3": "« [...] And anyone whose name was not found written in the book of life was thrown into the lake of fire; this is the second death. »",
        "but": "BUT",
        "point_4": "4) Jesus Christ came to die in our place. This is the good news of the Gospel!",
        "verse_4_ref": "John 3:16",
        "verse_4": "« For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. »",
        "point_4_desc": "Sin is something so serious that God — the Father — came into the world in human form, lived without sin, and gave his life on the cross, so that we may be reconciled with God. It is only by the grace of God that we are saved, through faith. It is a gift from God.",
        "verse_4_ref2": "Ephesians 2:8",
        "point_5": "5) Whoever puts their faith in Christ and believes in this reconciliation offered by God, by His grace, in this forgiveness of our sins at the cross, then they are saved — and that He is risen to give us life.",
        "verse_5_ref": "Romans 10:9",
        "point_6": "6) To follow Christ is to accept Him as Lord and Savior:\n1 – I am a sinner\n2 – Sin separates me from God\n3 – Confess and ask God for forgiveness\n4 – Abandon sin: To fear God = To hate sin.",
        "verse_6_ref": "Galatians 2:20",
        "verse_6": "« I have been crucified with Christ and I no longer live, but Christ lives in me... »",
        "point_7": "7) The Spirit of God lives in the believer, to live in Christ (for the flesh is weak). The necessary strength comes from God. This is the principle of a new life.",
        "verse_7_ref": "2 Corinthians 5:17",
        "verse_7": "« Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here! »"
      },
      "story": {
        "journey_title": "Path to Hope",
        "book_of_life_title": "Your name is written in the Book of Life!",
        "swipe": "SWIPE",
        "btn_back": "Back",
        "btn_back_bubbles": "Back to Choices",
        "btn_continue": "Continue",
        "continue_journey": "Continue the Journey",
        "skip_bubbles": "Skip to next step",
        "btn_yes": "YES, I want to!",
        "btn_no": "NO, not right now",
        "bubble_success": "Success",
        "bubble_good": "Good Deeds",
        "bubble_religion": "Religion & Phil.",
        "step_1": "In the beginning, God created the heavens and the earth.",
        "step_2": "He also created me, {{guideName}}, and you, {{friendName}}.",
        "step_3": "God loves us and wants a relationship with us.",
        "step_4": "John 17:3 - And this is the way to have eternal life - to know you, the only true God, and Jesus Christ, the one you sent to earth.",
        "step_5": "Christianity is not a religion but a relationship with God. This relationship brings us true love, joy and peace.",
        "step_6": "Our relationship with God is broken because of sin.",
        "step_7": "Sin is as simple as selfishness, lying or lust to as serious as stealing, murder or rebellion towards God.\nRomans 3:23 - For everyone has sinned; we all fall short of God's glorious standard.",
        "step_8": "Because of sin and our broken relationship with God the Father, we will not know our true purpose in life. We are also uncertain of our eternal future.",
        "step_9": "Romans 6:23 - For the penalty of sin is death, but the free gift of God is eternal life through Christ Jesus our Lord.",
        "step_10": "We try to reconcile our relationship with God through many ways.",
        "step_11": "Some of us try to find happiness by pursuing success, but it doesn't mend our broken relationship with God.",
        "step_12": "Some of us try to do good and be good, but relationship with God cannot be earned or bought. It is a gift of God.",
        "step_13": "Some of us try religions or philosophies but God is looking for a loving personal relationship.",
        "step_14": "All our efforts are not enough to mend this broken relationship. The good news is that God loves us so much that He made the first move.",
        "step_15": "John 3:16 - For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
        "step_16": "Jesus came on our behalf, and paid the penalty of our sins, by dying on the cross. Our sins can now be erased.",
        "step_17": "I made a wonderful and life-changing decision to have a relationship with God.",
        "step_18": "So now, would you like to join me and have your own relationship with God?",
        "step_19": "Prayer: Dear Father God, I admit that I am a sinner, and I ask for your forgiveness. I believe that Jesus Christ died for me on the cross and rose again. I confess that Jesus is my Lord and Savior. Holy Spirit, help me to obey and follow God. Change me from the inside out. In the name of Jesus, amen.",
        "step_success": "Congratulations!!! You've made the best decision in your life!",
        "step_20": "Can I pray a prayer of blessing for you?",
        "step_21": "WHAT YOU NEED TO DO NOW...\n\n1. JOIN A CHURCH\n\n2. READ THE BIBLE (Start with the Gospel of Luke)"
      },
      "tutorial": {
        "title": "COMPANION MANUAL",
        "back": "Back",
        "back_to_menu": "Back to Menu",
        "tab_guide": "Coaching & Posture",
        "tab_steps": "Steps & What to Say",
        "what_to_say": "What you can say:",
        "to_reflect": "To reflect on / Open question:",
        "guide_advice": "Advice for the Guide"
      }
    }
  },
  fr: {
    translation: {
      "home": {
        "title": "JEAN316",
        "begin": "COMMENCER"
      },
      "character": {
        "title": "Qui participe ?",
        "guide_placeholder": "Ton nom (Guide)",
        "friend_placeholder": "Le nom de ton ami(e)",
        "next": "SUIVANT",
        "back": "Retour"
      },
      "options": {
        "title": "OPTIONS",
        "language": "Langue",
        "tutorial": "Guide de l'Accompagnateur",
        "install": "Installer l'application",
        "sound": "Effets sonores",
        "about": "À PROPOS",
        "close": "Fermer",
        "resources": "Ressources",
        "bible_app": "Télécharger La Bible YouVersion",
        "gospel_summary": "Résumé du message de l'Évangile",
        "back_to_resources": "Retour aux ressources",
        "random_verse": "Révéler ma promesse",
        "church_boom": "Découvrir l'Église Boom",
        "read_luke": "Commencer l'Évangile de Luc (Luc 1)",
        "share_summary": "Partager avec mon ami(e)",
        "prayer_step_by_step": "Prier ensemble phrase par phrase",
        "prayer_full": "Voir la prière complète",
        "next_phrase": "Phrase suivante",
        "finish_prayer": "Dire Amen & Continuer",
        "sound_hint": "Astuce : Si tu n'entends rien sur iPhone, vérifie le bouton vibreur/silence sur le côté du téléphone !"
      },
      "summary": {
        "title": "Plan d'évangélisation",
        "point_1": "1) Dieu aime chaque personne… et veut avoir une relation personnelle avec chaque individu.",
        "verse_1_ref": "2 Pierre 3:9",
        "verse_1": "« Le Seigneur ne tarde pas dans l'accomplissement de sa promesse, comme quelques-uns le croient, mais il use de patience envers vous, ne voulant pas qu'aucun périsse, mais voulant que tous arrivent à la repentance. »",
        "point_2": "2) Mais le monde entier est séparé de Dieu à cause du péché…",
        "verse_2_ref": "Romains 3:23",
        "verse_2": "« Tous ont péché, en effet, et sont privés de la gloire de Dieu. »",
        "point_3": "3) Dieu est saint et juste. Chaque pécheur / le péché ne peut être avec Lui. Bien que Dieu aime l'homme, Il a condamné le pécheur à la mort éternelle, séparation d'avec Dieu en enfer.",
        "verse_3_ref": "Apocalypse 20:12-15",
        "verse_3": "« […] Si quelqu'un ne se trouve pas écrit dans le livre de vie, il est jeté dans l'étang de feu ; c'est la seconde mort. »",
        "but": "MAIS",
        "point_4": "4) Jésus-Christ est venu pour mourir à notre place. C'est cela la bonne nouvelle de l'Évangile !",
        "verse_4_ref": "Jean 3:16",
        "verse_4": "« Dieu a tant aimé le monde qu'il a donné son Fils unique, pour que tous ceux qui placent leur confiance en Lui échappent à la perdition et qu'ils aient la vie éternelle. »",
        "point_4_desc": "Le péché est quelque chose de si grave que Dieu — le Père — est venu dans le monde sous forme d'homme, a vécu sans péché et a donné sa vie sur la croix, pour que nous soyons réconciliés avec Dieu. C'est uniquement par la grâce de Dieu que nous sommes sauvés, par le moyen de la foi. C'est un don de Dieu.",
        "verse_4_ref2": "Éphésiens 2:8",
        "point_5": "5) Celui qui met sa foi en Christ et croit à cette réconciliation offerte par Dieu, par sa grâce, à ce pardon de nos péchés à la croix, alors il est sauvé — et qu'Il est ressuscité pour nous donner la vie.",
        "verse_5_ref": "Romains 10:9",
        "point_6": "6) Suivre Christ, c'est l'accepter comme Seigneur et Sauveur :\n1 – Je suis pécheur\n2 – Le péché me sépare de Dieu\n3 – Confesser et demander pardon à Dieu\n4 – Abandonner le péché : Craindre Dieu = Haïr le péché.",
        "verse_6_ref": "Galates 2:20",
        "verse_6": "« Ce n'est plus moi qui vis, c'est Christ qui vit en moi… »",
        "point_7": "7) L'Esprit de Dieu vit dans le croyant, pour vivre en Christ (car la chair est faible). La force nécessaire vient de Dieu. C'est le principe d'une vie nouvelle.",
        "verse_7_ref": "2 Corinthiens 5:17",
        "verse_7": "« Ainsi, si quelqu'un est en Christ, il appartient à une nouvelle création : les choses anciennes sont passées… »"
      },
      "story": {
        "journey_title": "Chemin vers l'espérance",
        "book_of_life_title": "Ton nom est désormais inscrit dans le Livre de vie !",
        "swipe": "GLISSER",
        "btn_back": "Retour",
        "btn_back_bubbles": "Retour aux choix",
        "btn_continue": "Continuer",
        "continue_journey": "Continuer le parcours",
        "skip_bubbles": "Passer à l'étape suivante",
        "btn_yes": "OUI, je le veux !",
        "btn_no": "NON, pas pour le moment",
        "bubble_success": "Le Succès",
        "bubble_good": "Être Bon",
        "bubble_religion": "Religion & Phil.",
        "step_1": "Au commencement, Dieu créa les cieux et la terre.",
        "step_2": "Il m'a aussi créé moi, {{guideName}}, et toi, {{friendName}}.",
        "step_3": "Dieu nous aime et veut avoir une relation avec nous.",
        "step_4": "Jean 17:3 - Or, la vie éternelle, c'est qu'ils te connaissent, toi, le seul vrai Dieu, et celui que tu as envoyé, Jésus-Christ.",
        "step_5": "Le Christianisme n'est pas une religion mais une relation avec Dieu. Cette relation nous apporte le véritable amour, la joie et la paix.",
        "step_6": "Notre relation avec Dieu est brisée à cause du péché.",
        "step_7": "Le péché peut être aussi simple que l'égoïsme, le mensonge ou la luxure, ou aussi grave que le vol, le meurtre ou la rébellion envers Dieu.\nRomains 3:23 - Car tous ont péché et sont privés de la gloire de Dieu.",
        "step_8": "À cause du péché et de notre relation brisée avec Dieu le Père, nous ne connaîtrons pas notre véritable but dans la vie. Nous sommes aussi incertains de notre avenir éternel.",
        "step_9": "Romains 6:23 - Car le salaire du péché, c'est la mort ; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus-Christ notre Seigneur.",
        "step_10": "Nous essayons de réconcilier notre relation avec Dieu de multiples façons.",
        "step_11": "Certains d'entre nous essaient de trouver le bonheur en poursuivant le succès, mais cela ne répare pas notre relation brisée avec Dieu.",
        "step_12": "Certains essaient de faire le bien et d'être bons, mais la relation avec Dieu ne peut être ni gagnée ni achetée. C'est un don de Dieu.",
        "step_13": "Certains essaient des religions ou des philosophies mais Dieu recherche une relation d'amour personnelle.",
        "step_14": "Tous nos efforts ne suffisent pas à réparer cette relation brisée. La bonne nouvelle est que Dieu nous aime tellement qu'Il a fait le premier pas.",
        "step_15": "Jean 3:16 - Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
        "step_16": "Jésus est venu à notre place et a payé la pénalité de nos péchés en mourant sur la croix. Nos péchés peuvent maintenant être effacés.",
        "step_17": "J'ai pris la merveilleuse décision de changer de vie pour avoir une relation avec Dieu.",
        "step_18": "Alors maintenant, aimerais-tu te joindre à moi et avoir ta propre relation avec Dieu ?",
        "step_19": "Prière : Cher Père, je reconnais que je suis pécheur et je te demande pardon. Je crois que Jésus-Christ est mort pour moi sur la croix et qu'il est ressuscité. Je confesse que Jésus est mon Seigneur et Sauveur. Saint-Esprit, aide-moi à obéir et à suivre Dieu. Transforme-moi de l'intérieur. Au nom de Jésus, amen.",
        "step_success": "Félicitations !!! Tu as pris la meilleure décision de ta vie !",
        "step_20": "Puis-je faire une prière de bénédiction pour toi ?",
        "step_21": "CE QUE TU DOIS FAIRE MAINTENANT...\n\n1. REJOINDRE UNE ÉGLISE\n\n2. LIRE LA BIBLE (Commence par l'évangile de Luc)"
      },
      "tutorial": {
        "title": "GUIDE DE L'ACCOMPAGNATEUR",
        "back": "Retour",
        "back_to_menu": "Retour au menu",
        "tab_guide": "Conseils & Posture",
        "tab_steps": "Parcours & Que dire",
        "what_to_say": "Ce que tu peux dire :",
        "to_reflect": "À réfléchir / Question ouverte :",
        "guide_advice": "Conseils pour le Guide"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
