export function deleteStorageData() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
}
