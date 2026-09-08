/**
 * Catálogo Central de Histórias Interativas (Stories Data)
 * Contém o índice de todas as histórias disponíveis para Inglês e Espanhol.
 */
(function(global) {
  'use strict';

  const STORIES_DATA = {
    en: [
      // Histórias em Inglês serão registradas aqui
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
