export function deleteStorageData() {
    localStorage.removeItem('is-login');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
}
