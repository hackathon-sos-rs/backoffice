export function findItemById(field: string, key: string, id: number, array: any[]): string {
    const item = array.find((element) => element[key] === id)
    return item ? item[field] : ' - '
}
