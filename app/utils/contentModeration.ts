// File: app/utils/contentModeration.ts

import { 
  englishBlacklist, 
  azerbaijaniBlacklist, 
  russianBlacklist, 
  allBlacklists,
  languageBlacklists,
  BlacklistLanguage,
  BlacklistCollection
} from './censorshipBlacklists';

/**
 * Censors text by replacing unethical words with asterisks
 * @param text - The text to censor
 * @param blacklists - Array of blacklists to check against
 * @returns The censored text
 */
export function censorText(text: string, blacklists: string[]): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let censoredText = text;

  // Create a case-insensitive regex pattern for each word
  blacklists.forEach(word => {
    if (word && typeof word === 'string') {
      // Escape special regex characters
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create case-insensitive regex with word boundaries
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
      
      // Replace with asterisks
      censoredText = censoredText.replace(regex, '****');
    }
  });

  return censoredText;
}

/**
 * Censors text using language-specific blacklists
 * @param text - The text to censor
 * @param languages - Array of language codes to check against
 * @returns The censored text
 */
export function censorTextByLanguage(text: string, languages: BlacklistLanguage[]): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Collect all words from specified language blacklists
  const wordsToCheck: string[] = [];
  
  languages.forEach(lang => {
    if (languageBlacklists[lang]) {
      wordsToCheck.push(...languageBlacklists[lang]);
    }
  });

  return censorText(text, wordsToCheck);
}

/**
 * Censors text using all available blacklists (default behavior)
 * @param text - The text to censor
 * @returns The censored text
 */
export function censorTextAll(text: string): string {
  return censorText(text, allBlacklists);
}

/**
 * Checks if text contains any unethical words
 * @param text - The text to check
 * @param blacklists - Array of blacklists to check against
 * @returns Boolean indicating if unethical words were found
 */
export function containsUnethicalWords(text: string, blacklists: string[]): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return blacklists.some(word => {
    if (word && typeof word === 'string') {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
      return regex.test(text);
    }
    return false;
  });
}

/**
 * Counts the number of unethical words in text
 * @param text - The text to analyze
 * @param blacklists - Array of blacklists to check against
 * @returns Number of unethical words found
 */
export function countUnethicalWords(text: string, blacklists: string[]): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  let count = 0;
  blacklists.forEach(word => {
    if (word && typeof word === 'string') {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
  });

  return count;
}