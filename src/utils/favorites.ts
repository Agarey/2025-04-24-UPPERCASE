const key = (user: string) => `fav_${user}`;

export const getFavIds = (user: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key(user)) || '[]');
  } catch {
    return [];
  }
};

export const toggleFav = (user: string, id: string) => {
  const list = new Set(getFavIds(user));
  list.has(id) ? list.delete(id) : list.add(id);
  localStorage.setItem(key(user), JSON.stringify(Array.from(list)));
};

export const isFav = (user: string, id: string) => getFavIds(user).includes(id);
