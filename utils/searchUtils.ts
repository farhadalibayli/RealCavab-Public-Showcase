// File: utils/searchUtils.ts

import { t } from 'i18next';

// Import all translation files
import azTranslations from '../i18n/locales/az.json';
import enTranslations from '../i18n/locales/en.json';
import ruTranslations from '../i18n/locales/ru.json';

// Create a map of all translations for efficient lookup
const allTranslations: Record<string, any> = {
  az: azTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

/**
 * Enhanced search function that searches across all three languages
 * @param searchTerm - The search term to look for
 * @param category - The category key (e.g., 'entertainment')
 * @param district - The district key (e.g., 'sahil')
 * @returns boolean - True if the search term matches in any language
 */
export function searchAcrossLanguages(searchTerm: string, category?: string, district?: string): boolean {
  const searchLower = searchTerm.toLowerCase().trim();
  
  // Search in category translations
  if (category) {
    const categoryKey = `filters.${category.toLowerCase()}`;
    
    // Check if search term matches any translation of the category
    for (const lang of ['az', 'en', 'ru'] as const) {
      const translation = allTranslations[lang];
      const categoryTranslation = translation.filters?.[category.toLowerCase()];
      
      if (categoryTranslation && categoryTranslation.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    
    // Also check the original category key
    if (category.toLowerCase().includes(searchLower)) {
      return true;
    }
  }
  
  // Search in district translations
  if (district) {
    const districtKey = `filters.${district.toLowerCase()}`;
    
    // Check if search term matches any translation of the district
    for (const lang of ['az', 'en', 'ru'] as const) {
      const translation = allTranslations[lang];
      const districtTranslation = translation.filters?.[district.toLowerCase()];
      
      if (districtTranslation && districtTranslation.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    
    // Also check the original district key
    if (district.toLowerCase().includes(searchLower)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get all matching categories and districts for a search term
 * @param searchTerm - The search term to look for
 * @returns object with matching categories and districts
 */
export function getMatchingFilters(searchTerm: string): { categories: string[], districts: string[] } {
  const searchLower = searchTerm.toLowerCase().trim();
  const matchingCategories: string[] = [];
  const matchingDistricts: string[] = [];
  
  // Get all category and district keys from the translation files
  const allKeys = new Set<string>();
  
  for (const lang of ['az', 'en', 'ru'] as const) {
    const translation = allTranslations[lang];
    if (translation.filters) {
      Object.keys(translation.filters).forEach(key => {
        allKeys.add(key);
      });
    }
  }
  
  // Check each key against the search term
  for (const key of allKeys) {
    // Skip non-category/district keys
    if (['filters', 'districts', 'categories', 'new', 'popular', 'clearAll', 'applyFilters', 'searchPlaceholder'].includes(key)) {
      continue;
    }
    
    // Check if search term matches any translation of this key
    for (const lang of ['az', 'en', 'ru'] as const) {
      const translation = allTranslations[lang];
      const keyTranslation = translation.filters?.[key];
      
      if (keyTranslation && keyTranslation.toLowerCase().includes(searchLower)) {
        // Determine if this is a category or district based on our data structure
        // Omitted: Complex logic for determining category vs district classification
        if (key.includes('district') || key.includes('region')) {
          matchingDistricts.push(key);
        } else {
          matchingCategories.push(key);
        }
        break;
      }
    }
  }
  
  return {
    categories: [...new Set(matchingCategories)],
    districts: [...new Set(matchingDistricts)]
  };
}