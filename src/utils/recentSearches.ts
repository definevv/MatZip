const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 6;

export interface RecentSearch {
  id: string;
  text: string;
  timestamp: number;
}

export const getRecentSearches = (): RecentSearch[] => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent searches:', error);
    return [];
  }
};

export const addRecentSearch = (searchText: string): void => {
  if (!searchText.trim()) return;

  const searches = getRecentSearches();
  const newSearch: RecentSearch = {
    id: Date.now().toString(),
    text: searchText.trim(),
    timestamp: Date.now(),
  };

  const filteredSearches = searches.filter(
    (search) => search.text.toLowerCase() !== searchText.toLowerCase()
  );

  const updatedSearches = [newSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

export const removeRecentSearch = (id: string): void => {
  const searches = getRecentSearches();
  const updatedSearches = searches.filter((search) => search.id !== id);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error removing recent search:', error);
  }
};

export const clearRecentSearches = (): void => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
};
