
export const useMaskText = (originalText: any) => {
    const maskText = (text: any, maskChar = '*') => {
        const textArray = text.split('');
        for (let i = 1; i < textArray.length - 1; i++) {
            textArray[i] = maskChar;
        }
        return textArray.join('');
    };
    return maskText(originalText)
}