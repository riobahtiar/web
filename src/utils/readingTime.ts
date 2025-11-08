/**
 * Calculate reading time for blog post content
 * @param content - The markdown/MDX content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time object with minutes and text
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): {
  minutes: number;
  words: number;
  text: string;
} {
  // Remove frontmatter
  const cleanedContent = content.replace(/^---[\s\S]*?---/, "");

  // Remove code blocks (they read faster)
  const withoutCodeBlocks = cleanedContent.replace(/```[\s\S]*?```/g, "");

  // Remove inline code
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, "");

  // Remove MDX/HTML components
  const withoutComponents = withoutInlineCode.replace(/<[^>]*>/g, "");

  // Remove markdown links but keep the text
  const withoutLinks = withoutComponents.replace(
    /\[([^\]]+)\]\([^)]+\)/g,
    "$1",
  );

  // Remove markdown images
  const withoutImages = withoutLinks.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Remove markdown formatting characters
  const plainText = withoutImages
    .replace(/[#*_~`]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  // Count words
  const words = plainText.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate reading time
  const minutes = Math.ceil(words / wordsPerMinute);

  // Format text
  const text = `${minutes} min read`;

  return {
    minutes,
    words,
    text,
  };
}

/**
 * Get reading time text for display
 * @param content - The markdown/MDX content
 * @returns Formatted reading time string
 */
export function getReadingTime(content: string): string {
  return calculateReadingTime(content).text;
}

/**
 * Get bilingual reading time text
 * @param content - The markdown/MDX content
 * @param lang - Language code (en or id)
 * @returns Formatted reading time string in the specified language
 */
export function getReadingTimeI18n(
  content: string,
  lang: "en" | "id" = "en",
): string {
  const { minutes } = calculateReadingTime(content);

  if (lang === "id") {
    return `${minutes} menit baca`;
  }

  return `${minutes} min read`;
}
