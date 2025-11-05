export const formatTitleCase = (str: string | undefined): string => {
    if (!str) return ''; // Retorna vazio se for undefined
    const lower = str.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};