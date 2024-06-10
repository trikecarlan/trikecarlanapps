import { useCallback } from 'react';

const useFormatDate = () => {
    const formatDate = useCallback((date: Date): string => {
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const dayOfWeek = date.getUTCDay();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const hours = date.getHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getSeconds()

        return `${dayOfWeek}${month}${year}${hours}${minutes}${seconds}`;
    }, []);

    return { formatDate };
};

export default useFormatDate;
