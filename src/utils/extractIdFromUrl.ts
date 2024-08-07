function extractIdFromUrl(url: string): string {
  if (url && url.includes('/')) {
    const arrayUrl = url.split('/');
    const lastPart = arrayUrl[arrayUrl.length - 1];
    const dotIndex = lastPart.indexOf('.');
    const id = lastPart.substring(0, dotIndex);
    return id;
  }
  return '';
}

export default extractIdFromUrl;
