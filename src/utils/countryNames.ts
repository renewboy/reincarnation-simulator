import { GAME_CONFIG } from '../config/gameConfig';

// 从gameConfig动态生成国家中英文名称映射
export const COUNTRY_NAMES_CN: Record<string, string> = Object.fromEntries(
  Object.entries(GAME_CONFIG.GAME_DATA.countries || {}).map(([countryName, countryData]) => [
    countryName,
    countryData.chineseName || countryName
  ])
);

// 从gameConfig动态生成国家中文到英文名称映射
export const COUNTRY_NAMES_EN: Record<string, string> = Object.fromEntries(
  Object.entries(GAME_CONFIG.GAME_DATA.countries || {}).map(([countryName, countryData]) => [
    countryData.chineseName || countryName,
    countryName
  ])
);

// 获取国家中文名称，如果没有映射则返回英文名称
export function getCountryNameCN(englishName: string): string {
  return COUNTRY_NAMES_CN[englishName] || englishName;
}
