export const calculateRelevanceScore = (post: any, userCountry: any) => {
    // Constants for weighting
    const LIKE_WEIGHT = 0.8;
    const LENGTH_WEIGHT = 0.2;

    // Additional priority for posts from the same country
    const countryPriority = post.author.country === userCountry ? 1000 : 0;

    // Calculating the weighted score
    const likeScore = post.likes * LIKE_WEIGHT;
    const lengthScore = post.body.length * LENGTH_WEIGHT; // Assuming 'body' is a string

    return countryPriority + likeScore + lengthScore;
};
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
