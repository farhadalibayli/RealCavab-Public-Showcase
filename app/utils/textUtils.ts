// File: app/utils/textUtils.ts

/**
 * Truncates text to a specified maximum length, preserving word boundaries
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Determines if text should show a "read more" option
 * @param text - The text to check
 * @param maxLength - Maximum length threshold
 * @returns Boolean indicating if read more should be shown
 */
export function shouldShowReadMore(text: string, maxLength: number = 150): boolean {
  return Boolean(text && text.length > maxLength);
}

/**
 * Generates a preview object for question text with metadata
 * @param text - The text to preview
 * @param maxLength - Maximum length for preview
 * @returns Object containing preview text and metadata
 */
export function getQuestionPreview(text: string, maxLength: number = 150): {
  preview: string;
  shouldShowReadMore: boolean;
  isTruncated: boolean;
} {
  if (!text) {
    return {
      preview: '',
      shouldShowReadMore: false,
      isTruncated: false
    };
  }

  const shouldShow = shouldShowReadMore(text, maxLength);
  const preview = shouldShow ? truncateText(text, maxLength) : text;

  return {
    preview,
    shouldShowReadMore: shouldShow,
    isTruncated: shouldShow
  };
}