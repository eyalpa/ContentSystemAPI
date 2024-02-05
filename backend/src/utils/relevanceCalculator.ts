export const generateSummary = (body: string): string => {
    // Define the maximum number of words
    const maxWords = 100;
    // Split the body text into words
    const words = body.split(/\s+/);

    // If the number of words is less than or equal to the limit, return the original body
    if (words.length <= maxWords) {
        return body;
    }

    // Otherwise, return the first 100 words and add an ellipsis
    return words.slice(0, maxWords).join(' ') + '...';
};
