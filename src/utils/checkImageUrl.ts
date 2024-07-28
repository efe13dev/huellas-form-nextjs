const checkImageUrl = (url: string): Promise<string> => {
  return fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return url;
      } else {
        return '/default-image.jpg';
      }
    })
    .catch(() => '/default-image.jpg');
};
export default checkImageUrl;
