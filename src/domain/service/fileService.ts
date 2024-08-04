export const createFileName = (filename: string): string => {
    const date = new Date(
        new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" }),
    );
    return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${filename}`;
};