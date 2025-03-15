export function formatDate(date: Date, lang: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', options);
} 