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
      }
    ],
    es: [
      // Histórias em Espanhol serão registradas aqui
    ]
  };

  // Expor globalmente para browsers e Node.js
  global.STORIES_DATA = STORIES_DATA;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = STORIES_DATA;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : globalThis));
