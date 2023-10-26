import { OptionsProps, WeatherResponseProps } from "./fetchCity";

export interface LocalStorageProps {
  cities?: WeatherResponseProps[]
  options?: LocalStorageOptions
}

export type LocalStorageKey = keyof LocalStorageProps;

export interface LocalStorageOptions {
  tempScale: OptionsProps;

}

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

export const setStoredOptions = (options: LocalStorageOptions): Promise<void> => {
  const vals: LocalStorageProps = {
    options,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => {
      resolve();
    });
  });
}

export const getStoredOptions = (): Promise<LocalStorageOptions> => {
  const keys: LocalStorageKey[] = ['options'];

  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result: LocalStorageProps) => {
      resolve(result.options || { tempScale: 'metric' });
    });

  });
  
}