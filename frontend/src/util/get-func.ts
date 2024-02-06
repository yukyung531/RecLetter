export const getlastPath = () => {
    const splitUrl = document.location.href.split('/');
    const lastPath = splitUrl.length > 4 ? splitUrl[splitUrl.length - 1] : '';
    return lastPath;
};
