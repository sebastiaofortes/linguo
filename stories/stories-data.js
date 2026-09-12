/**
 * Catálogo Central de Histórias Interativas (Stories Data)
 * Contém o índice de todas as histórias disponíveis para Inglês e Espanhol.
 */
(function(global) {
  'use strict';

  const STORIES_DATA = {
    en: [
      {
        id: "can_you_help_me",
        title: "Can You Help Me?",
        translation: "Você Pode Me Ajudar?",
        originalTitle: "Can You Help Me?",
        grammarFocus: "Pronomes Objeto",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🔑",
        icon: "🔑",
        characters: ["Junior", "Eddy", "Lucy"],
        path: "stories/en/can-you-help-me/index.html",
        url: "stories/en/can-you-help-me/index.html",
        xp: 25
      },
      {
        id: "i_can_do_it_myself",
        title: "I Can Do It Myself!",
        translation: "Eu Consigo Fazer Sozinha!",
        originalTitle: "I Can Do It Myself!",
        grammarFocus: "Pronomes Reflexivos",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🪞",
        icon: "🪞",
        characters: ["Lin", "Lucy"],
        path: "stories/en/i-can-do-it-myself/index.html",
        url: "stories/en/i-can-do-it-myself/index.html",
        xp: 25
      },
      {
        id: "the_missing_pizza",
        title: "The Missing Pizza",
        translation: "A Pizza Desaparecida",
        originalTitle: "The Missing Pizza",
        grammarFocus: "Simple Past",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🍕",
        icon: "🍕",
        characters: ["Junior", "Eddy"],
        path: "stories/en/the-missing-pizza/index.html",
        url: "stories/en/the-missing-pizza/index.html",
        xp: 25
      },
      {
        id: "i_will_be_famous",
        title: "I Will Be Famous!",
        translation: "Eu Serei Famoso!",
        originalTitle: "I Will Be Famous!",
        grammarFocus: "Simple Future",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🎨",
        icon: "🎨",
        characters: ["Oscar", "Bea"],
        path: "stories/en/i-will-be-famous/index.html",
        url: "stories/en/i-will-be-famous/index.html",
        xp: 25
      },
      {
        id: "what_are_you_doing",
        title: "What Are You Doing?",
        translation: "O Que Você Está Fazendo?",
        originalTitle: "What Are You Doing?",
        grammarFocus: "Present Continuous",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🍳",
        icon: "🍳",
        characters: ["Vikram", "Eddy"],
        path: "stories/en/what-are-you-doing/index.html",
        url: "stories/en/what-are-you-doing/index.html",
        xp: 25
      },
      {
        id: "eddy_runs_every_day",
        title: "Eddy Runs Every Morning",
        translation: "O Eddy Corre Todas as Manhãs",
        originalTitle: "Eddy Runs Every Morning",
        grammarFocus: "Simple Present",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🏃🏻‍♂️",
        icon: "🏃🏻‍♂️",
        characters: ["Junior", "Eddy"],
        path: "stories/en/eddy-runs-every-day/index.html",
        url: "stories/en/eddy-runs-every-day/index.html",
        xp: 25
      },
      {
        id: "i_was_sleeping",
        title: "I Was Sleeping!",
        translation: "Eu Estava Dormindo!",
        originalTitle: "I Was Sleeping!",
        grammarFocus: "Past Continuous",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🎸",
        icon: "🎸",
        characters: ["Lin", "Lucy"],
        path: "stories/en/i-was-sleeping/index.html",
        url: "stories/en/i-was-sleeping/index.html",
        xp: 25
      },
      {
        id: "this_time_tomorrow",
        title: "This Time Tomorrow",
        translation: "Nesta Hora Amanhã",
        originalTitle: "This Time Tomorrow",
        grammarFocus: "Future Continuous",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🏖️",
        icon: "🏖️",
        characters: ["Bea", "Vikram"],
        path: "stories/en/this-time-tomorrow/index.html",
        url: "stories/en/this-time-tomorrow/index.html",
        xp: 25
      },
      {
        id: "yesterday",
        title: "Yesterday",
        translation: "Ontem (The Beatles)",
        originalTitle: "Yesterday",
        grammarFocus: "Simple Past & Canções",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🎸",
        icon: "🎸",
        characters: ["Oscar", "Vikram"],
        path: "stories/en/yesterday/index.html",
        url: "stories/en/yesterday/index.html",
        xp: 25
      },
      {
        id: "its_my_life",
        title: "It's My Life",
        translation: "É a Minha Vida (Bon Jovi)",
        originalTitle: "It's My Life",
        grammarFocus: "Expressões & Canções",
        lang: "en",
        set: 1,
        level: "A1",
        coverIcon: "🎸",
        icon: "🎸",
        characters: ["Eddy", "Junior"],
        path: "stories/en/its-my-life/index.html",
        url: "stories/en/its-my-life/index.html",
        xp: 25
      }
    ],
    es: [
      {
        id: "un_regalo_especial",
        title: "Un Regalo Especial",
        translation: "Um Presente Especial",
        originalTitle: "Un Regalo Especial",
        grammarFocus: "Duplicação Clítica",
        lang: "es",
        set: 1,
        level: "A1",
        coverIcon: "🎁",
        icon: "🎁",
        characters: ["Junior", "Eddy"],
        path: "stories/es/un-regalo-especial/index.html",
        url: "stories/es/un-regalo-especial/index.html",
        xp: 25
      }
    ]
  };

  // Expor globalmente para browsers e Node.js
  global.STORIES_DATA = STORIES_DATA;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = STORIES_DATA;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : globalThis));
