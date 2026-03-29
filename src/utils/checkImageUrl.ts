const cache = new Map<string, string>();

const checkImageUrl = (url: string): Promise<string> => {
  const cached = cache.get(url);

  if (cached !== undefined) return Promise.resolve(cached);

  return fetch(url, { method: "HEAD" })
    .then((response) => {
      const result = response.ok ? url : "/default-image.jpg";

      cache.set(url, result);

      return result;
    })
    .catch(() => {
      cache.set(url, "/default-image.jpg");

      return "/default-image.jpg";
    });
};

export default checkImageUrl;
