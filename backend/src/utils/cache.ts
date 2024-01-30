class Cache {
    private cache: Record<string, any>;
    private ttl: number; // Time to live in milliseconds

    constructor(ttl: number = 1000 * 60 * 5) { // Default TTL 5 minutes
        this.cache = {};
        this.ttl = ttl;
    }

    get(key: string) {
        const item = this.cache[key];
        if (!item) return null;

        const now = new Date().getTime();
        if (now > item.expiry) {
            delete this.cache[key];
            return null;
        }

        return item.value;
    }

    set(key: string, value: any) {
        if(!value) {
            delete this.cache[key];
            return;
        }
        const expiry = new Date().getTime() + this.ttl;
        this.cache[key] = { value, expiry };
    }
}

export const cache = new Cache();
