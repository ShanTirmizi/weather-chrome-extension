import { WeatherResponseProps } from "./fetchCity";

export interface LocalStorageProps {
  cities: WeatherResponseProps[]
}

export type LocalStorageKey = keyof LocalStorageProps;


export const setStoredCities = (cities: WeatherResponseProps[]): Promise<void> => {
  const vals: LocalStorageProps = {
    cities,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve();
    });
  });
}

export function getStoredCities(): Promise<WeatherResponseProps[]> {
  const keys: LocalStorageKey[] = ['cities'];

  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve((result as LocalStorageProps).cities || []);
    });

  });
}