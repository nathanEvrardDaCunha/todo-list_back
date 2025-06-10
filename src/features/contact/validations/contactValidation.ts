export function validateName(name: any): string {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        throw new Error(
            [
                'Name is invalid!',
                '- Must be a string',
                '- At least 2 characters long',
                '- Cannot be empty or only whitespace',
            ].join('\n')
        );
    }
    return name.trim();
}

export function validateMessage(message: any): string {
    if (!message || typeof message !== 'string' || message.trim().length < 1) {
        throw new Error(
            [
                'Message is invalid!',
                '- Must be a string',
                '- At least 1 character long',
                '- Cannot be empty or only whitespace',
            ].join('\n')
        );
    }
    return message.trim();
}
