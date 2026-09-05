/**
 * Linguo - Leitner Spaced Repetition System (SRS) & Progress Persistence Engine
 * 
 * Manages vocabulary learning history, Leitner Box progression (1 to 5),
 * Ebbinghaus retention intervals, critical word detection, and backup import/export.
 */

(function(window) {
  'use strict';

  // Box intervals in days
  const LEITNER_INTERVALS = {
    1: 1,   // Box 1: 1 day (Short-term memory / mistakes)
    2: 3,   // Box 2: 3 days (Intermediate fixation)
    3: 7,   // Box 3: 7 days (Long-term retention)
    4: 14,  // Box 4: 14 days (Consolidation)
    5: 30   // Box 5: 30 days (Permanent Mastery 🏆)
  };

  /**
   * Returns standard ISO date string YYYY-MM-DD
   */
  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Adds specified number of days to a YYYY-MM-DD date string
   */
  function addDaysToString(dateStr, days) {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch(e) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    }
  }

  /**
   * Get the primary localStorage key for a given language
   */
  function getSRSKey(lang) {
    const l = (lang || 'en').toLowerCase().trim();
    return 'linguo_srs_data_' + l;
  }

  /**
   * Get legacy localStorage key for backward compatibility
   */
  function getLegacySRSKey(lang) {
    const l = (lang || 'en').toLowerCase().trim();
    return 'linguo-vocab-srs-' + l;
  }

  /**
   * Retrieves the complete SRS store for a language
   * Automatically migrates legacy formats if present
   */
  function getSRSStore(lang) {
    const primaryKey = getSRSKey(lang);
    const legacyKey = getLegacySRSKey(lang);

    try {
      let raw = localStorage.getItem(primaryKey);
      if (!raw) {
        raw = localStorage.getItem(legacyKey);
        if (raw) {
          // Migrate to primary key
          localStorage.setItem(primaryKey, raw);
        }
      }
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (typeof parsed === 'object' && parsed !== null) ? parsed : {};
    } catch (e) {
      console.warn('LinguoSRS: Error reading store for ' + lang, e);
      return {};
    }
  }

  /**
   * Saves the SRS store for a language to localStorage
   */
  function saveSRSStore(lang, store) {
    const primaryKey = getSRSKey(lang);
    try {
      localStorage.setItem(primaryKey, JSON.stringify(store || {}));
      // Keep legacy in sync for any cached references
      localStorage.setItem(getLegacySRSKey(lang), JSON.stringify(store || {}));
      
      // Dispatch custom event so active tabs/dashboards can update reactively
      if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('linguo_srs_updated', {
          detail: { lang: lang || 'en' }
        }));
      }
      return true;
    } catch (e) {
      console.error('LinguoSRS: Failed to save store for ' + lang, e);
      return false;
    }
  }

  /**
   * Retrieves SRS record for a single word
   */
  function getWordSRS(id, lang) {
    const store = getSRSStore(lang);
    return store[id] || null;
  }

  /**
   * Records a review attempt for a word in SRS
   * 
   * @param {string} id - Word unique ID (e.g. 'en_apple')
   * @param {boolean} isCorrect - Whether user succeeded or failed
   * @param {string} mode - Practice mode ('voice_deck' | 'typed_deck' | 'flashcards' | 'match_madness')
   * @param {string} lang - Language code ('en' | 'es')
   * @returns {object} Updated word record
   */
  function recordWordReview(id, isCorrect, mode, lang) {
    if (!id) return null;
    const l = lang || 'en';
    const store = getSRSStore(l);
    const today = getTodayString();

    const existing = store[id] || {
      id: id,
      box: 1,
      interval: 1,
      timesReviewed: 0,
      correctStreak: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: today,
      status: 'learning',
      lastMode: mode || 'practice'
    };

    let box = existing.box || 1;
    let correctStreak = existing.correctStreak || 0;
    let incorrectCount = existing.incorrectCount || 0;
    let timesReviewed = (existing.timesReviewed || 0) + 1;
    let status = existing.status || 'learning';

    if (isCorrect) {
      correctStreak += 1;
      
      // Box progression: 3 consecutive correct reviews advance box
      if (correctStreak >= 3) {
        box = Math.min(box + 1, 5);
        status = 'mastered';
      } else if (box >= 3) {
        status = 'mastered';
      } else {
        status = 'learning';
      }
    } else {
      // Mistake penalty: drop to Box 1 and reset correct streak
      correctStreak = 0;
      incorrectCount += 1;
      box = 1;

      if (incorrectCount >= 2) {
        status = 'critical';
      } else {
        status = 'learning';
      }
    }

    const interval = LEITNER_INTERVALS[box] || 1;
    const nextReview = addDaysToString(today, interval);

    const updatedRecord = {
      id: id,
      box: box,
      interval: interval,
      timesReviewed: timesReviewed,
      correctStreak: correctStreak,
      incorrectCount: incorrectCount,
      lastReviewed: new Date().toISOString(),
      nextReview: nextReview,
      status: status,
      lastMode: mode || existing.lastMode || 'practice'
    };

    store[id] = updatedRecord;
    saveSRSStore(l, store);

    return updatedRecord;
  }

  /**
   * Returns list of terms that are critical (status === 'critical' or incorrectCount >= 2)
   */
  function getCriticalWords(lang, fullVocabList) {
    const l = lang || 'en';
    const store = getSRSStore(l);
    const list = fullVocabList || (window.VOCABULARY_DATA && window.VOCABULARY_DATA[l]) || [];
    
    return list.filter(item => {
      const srs = store[item.id];
      return srs && (srs.status === 'critical' || (srs.incorrectCount && srs.incorrectCount >= 2));
    });
  }

  /**
   * Returns list of terms strictly due for review today (studied and nextReview <= today)
   */
  function getDueWords(lang, fullVocabList) {
    const l = lang || 'en';
    const store = getSRSStore(l);
    const list = fullVocabList || (window.VOCABULARY_DATA && window.VOCABULARY_DATA[l]) || [];
    const today = getTodayString();

    return list.filter(item => {
      const srs = store[item.id];
      if (!srs || !srs.timesReviewed || srs.timesReviewed < 1) return false;
      return srs.nextReview && srs.nextReview <= today;
    });
  }

  /**
   * Calculates comprehensive SRS summary and Leitner distribution
   */
  function getSRSSummary(lang, fullVocabList) {
    const l = lang || 'en';
    const store = getSRSStore(l);
    const list = fullVocabList || (window.VOCABULARY_DATA && window.VOCABULARY_DATA[l]) || [];
    const today = getTodayString();

    let total = list.length;
    let studyingCount = 0;
    let masteredCount = 0;
    let learningCount = 0;
    let criticalCount = 0;
    let dueCount = 0;
    let unreviewedCount = 0;

    const boxes = {
      box1: 0, // 1 day
      box2: 0, // 3 days
      box3: 0, // 7 days
      box4Plus: 0 // 14d - 30d
    };

    list.forEach(item => {
      const srs = store[item.id];
      const isStudied = srs && srs.timesReviewed && srs.timesReviewed >= 1;

      if (!isStudied) {
        unreviewedCount++;
        return;
      }

      studyingCount++;

      // Strict due rule: only studied words with nextReview <= today
      if (srs.nextReview && srs.nextReview <= today) {
        dueCount++;
      }

      if (srs.status === 'critical' || (srs.incorrectCount && srs.incorrectCount >= 2)) {
        criticalCount++;
      } else if (srs.status === 'mastered' || (srs.box && srs.box >= 3)) {
        masteredCount++;
      } else {
        learningCount++;
      }

      const b = srs.box || 1;
      if (b === 1) boxes.box1++;
      else if (b === 2) boxes.box2++;
      else if (b === 3) boxes.box3++;
      else boxes.box4Plus++;
    });

    const retentionPct = studyingCount > 0 ? Math.round((masteredCount / studyingCount) * 100) : 0;

    // CEFR badge calculation
    let cefrLevel = 'NÍVEL A1 INICIANTE';
    if (masteredCount >= 60 || (studyingCount >= 40 && retentionPct >= 85)) {
      cefrLevel = 'NÍVEL B1 CONSOLIDADO 🏆';
    } else if (masteredCount >= 30 || (studyingCount >= 20 && retentionPct >= 60)) {
      cefrLevel = 'NÍVEL A2 INTERMEDIÁRIO ⭐';
    } else if (masteredCount >= 10 || studyingCount >= 10) {
      cefrLevel = 'NÍVEL A1-A2 EM PROGRESSO';
    }

    return {
      total,
      studying: studyingCount,
      mastered: masteredCount,
      learning: learningCount,
      critical: criticalCount,
      due: dueCount,
      unreviewed: unreviewedCount,
      retentionPct,
      cefrLevel,
      boxes
    };
  }

  /**
   * Export backup as downloadable JSON file
   */
  function exportSRSBackup(lang) {
    const l = lang || 'en';
    const store = getSRSStore(l);
    const summary = getSRSSummary(l);
    
    const exportPayload = {
      app: 'Linguo',
      version: '2.0',
      language: l,
      exportedAt: new Date().toISOString(),
      summary: summary,
      data: store
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguo_srs_backup_${l}_${getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }

  /**
   * Imports backup JSON data and saves to store
   */
  function importSRSBackup(lang, jsonData) {
    const l = lang || 'en';
    try {
      let parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!parsed) throw new Error('Dados JSON vazios');

      let records = null;
      if (parsed.data && typeof parsed.data === 'object') {
        records = parsed.data;
      } else if (typeof parsed === 'object') {
        records = parsed;
      }

      if (!records || typeof records !== 'object') {
        throw new Error('Formato de backup inválido');
      }

      saveSRSStore(l, records);
      return { success: true, count: Object.keys(records).length };
    } catch (e) {
      console.error('LinguoSRS: Erro ao importar backup', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Resets SRS progress for a language
   */
  function resetSRSProgress(lang) {
    const l = lang || 'en';
    saveSRSStore(l, {});
    return true;
  }

  // Export to global window object
  window.LinguoSRS = {
    LEITNER_INTERVALS,
    getTodayString,
    addDaysToString,
    getSRSKey,
    getSRSStore,
    saveSRSStore,
    getWordSRS,
    recordWordReview,
    getCriticalWords,
    getDueWords,
    getSRSSummary,
    exportSRSBackup,
    importSRSBackup,
    resetSRSProgress
  };

  // Expose convenient globals
  window.getSRSStore = getSRSStore;
  window.saveSRSStore = saveSRSStore;
  window.recordWordReview = recordWordReview;
  window.getCriticalWords = getCriticalWords;
  window.getSRSSummary = getSRSSummary;

})(typeof window !== 'undefined' ? window : this);
