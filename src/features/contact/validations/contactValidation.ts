export function validateName(name: any): string {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        throw new Error('Name must be a string of at least 2 characters');
    }
    return name.trim();
}

export function validateMessage(message: any): string {
    if (!message || typeof message !== 'string' || message.trim().length < 1) {
        throw new Error('Message must be a string of at least 10 characters');
    }
    return message.trim();
}
