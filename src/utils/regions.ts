/**
 * 地区分类系统
 * 将80个国家按照9个地区进行分类
 */

// 导入游戏配置以动态生成国家地区映射
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * 地区配置接口，包含地区的所有信息
 */
export interface RegionConfig {
  /** 地区唯一标识符 */
  id: string;
  /** 地区中文名称 */
  nameCN: string;
  /** 地区音乐文件路径 */
  musicFile: string;
}

/**
 * 所有地区的配置信息
 * 使用统一的配置对象整合地区的所有属性
 */
export const REGION_CONFIGS = {
  EAST_ASIA: {
    id: 'east_asia',
    nameCN: '东亚',
    musicFile: 'audio/east_asia_bgm.mp3',
  },
  CENTRAL_ASIA: {
    id: 'central_asia',
    nameCN: '中亚',
    musicFile: 'audio/central_asia_bgm.mp3',
  },
  SOUTH_ASIA: {
    id: 'south_asia',
    nameCN: '南亚',
    musicFile: 'audio/south_asia_bgm.mp3',
  },
  SOUTH_EAST_ASIA: {
    id: 'south_east_asia',
    nameCN: '东南亚',
    musicFile: 'audio/south_east_asia_bgm.mp3',
  },
  MIDDLE_EAST: {
    id: 'middle_east',
    nameCN: '中东',
    musicFile: 'audio/middle_east_bgm.mp3',
  },
  EUROPE: {
    id: 'europe',
    nameCN: '欧洲',
    musicFile: 'audio/europe_bgm.mp3',
  },
  NORTH_AMERICA: {
    id: 'north_america',
    nameCN: '北美',
    musicFile: 'audio/north_america_bgm.mp3',
  },
  SOUTH_AMERICA: {
    id: 'south_america',
    nameCN: '南美',
    musicFile: 'audio/south_america_bgm.mp3',
  },
  AFRICA: {
    id: 'africa',
    nameCN: '非洲',
    musicFile: 'audio/africa_bgm.mp3',
  },
  OCEANIA: {
    id: 'oceania',
    nameCN: '大洋洲',
    musicFile: 'audio/oceania_bgm.mp3',
  },
} as const;

// 定义REGIONS常量（内部使用，不导出）
const REGIONS = Object.freeze(
  Object.fromEntries(
    Object.entries(REGION_CONFIGS).map(([key, config]) => [key, config.id])
  )
) as Record<keyof typeof REGION_CONFIGS, string>;

// 地区类型定义
export type Region = typeof REGIONS[keyof typeof REGIONS];

// 从REGION_CONFIGS派生REGION_NAMES_CN（内部使用，不导出）
const REGION_NAMES_CN: Record<Region, string> = Object.fromEntries(
  Object.entries(REGION_CONFIGS).map(([_, config]) => [config.id, config.nameCN])
) as Record<Region, string>;

// 从REGION_CONFIGS派生REGION_MUSIC_FILES（内部使用，不导出）
const REGION_MUSIC_FILES: Record<Region, string> = Object.fromEntries(
  Object.entries(REGION_CONFIGS).map(([_, config]) => [config.id, config.musicFile])
) as Record<Region, string>;

/**
 * 国家到地区的映射
 * 从gameConfig动态生成，确保数据一致性
 */
export const COUNTRY_REGION_MAP: Record<string, Region> = Object.fromEntries(
  Object.entries(GAME_CONFIG.GAME_DATA.countries)
    .filter(([key, value]) => 
      typeof value === 'object' && 
      value !== null && 
      'region' in value && 
      typeof value.region === 'string'
    )
    .map(([countryName, countryData]) => [countryName, countryData.region as Region])
);

/**
 * 地区管理器类
 * 封装所有地区相关的操作方法
 */
export class RegionManager {
  /**
   * 获取国家所属地区
   */
  getCountryRegion(countryName: string): Region | null {
    return COUNTRY_REGION_MAP[countryName] || null;
  }

  /**
   * 获取地区名称
   */
  getRegionName(region: Region): string {
    return REGION_NAMES_CN[region];
  }

  /**
   * 获取地区音乐文件路径
   */
  getRegionMusicPath(region: Region): string {
    return REGION_MUSIC_FILES[region];
  }

  /**
   * 根据地区ID获取完整的地区配置
   */
  getRegionConfig(regionId: Region): RegionConfig {
    // 查找匹配的配置
    const config = Object.values(REGION_CONFIGS).find(config => config.id === regionId);
    if (!config) {
      throw new Error(`未知地区: ${regionId}`);
    }
    return config;
  }
}

// 创建单例实例
export const regionManager = new RegionManager();
