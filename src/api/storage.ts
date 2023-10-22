export interface LocalStorageProps {
  cities?: string[];
}

export type LocalStorageKey = keyof LocalStorageProps;


export const setStoredCities = (cities: string[]): Promise<void> => {
  const vals: LocalStorageProps = {
    cities,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve();
    });
  });
}

export function getStoredCities(): Promise<string[]> {
  const keys: LocalStorageKey[] = ['cities'];

  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result: LocalStorageProps) => {
      resolve(result.cities || []);
    });
  });
}