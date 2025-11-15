/**
 * 地区分类系统
 * 将80个国家按照9个地区进行分类
 */

// 导入游戏配置以动态生成国家地区映射
import { GAME_CONFIG } from '../config/gameConfig';
import { readdirSync } from 'fs';
import { resolve } from 'path';

/**
 * 地区配置接口，包含地区的所有信息
 */
export interface RegionConfig {
  /** 地区唯一标识符 */
  id: string;
  /** 地区中文名称 */
  nameCN: string;
  /** 地区音乐文件夹路径 */
  musicFolder: string;
}

/**
 * 所有地区的配置信息
 * 使用统一的配置对象整合地区的所有属性
 */
export const REGION_CONFIGS = {
  EAST_ASIA: {
    id: 'east_asia',
    nameCN: '东亚',
    musicFolder: 'audio/east_asia',
  },
  CENTRAL_ASIA: {
    id: 'central_asia',
    nameCN: '中亚',
    musicFolder: 'audio/central_asia',
  },
  SOUTH_ASIA: {
    id: 'south_asia',
    nameCN: '南亚',
    musicFolder: 'audio/south_asia',
  },
  SOUTH_EAST_ASIA: {
    id: 'south_east_asia',
    nameCN: '东南亚',
    musicFolder: 'audio/south_east_asia',
  },
  MIDDLE_EAST: {
    id: 'middle_east',
    nameCN: '中东',
    musicFolder: 'audio/middle_east',
  },
  EUROPE: {
    id: 'europe',
    nameCN: '欧洲',
    musicFolder: 'audio/europe',
  },
  NORTH_AMERICA: {
    id: 'north_america',
    nameCN: '北美',
    musicFolder: 'audio/north_america',
  },
  SOUTH_AMERICA: {
    id: 'south_america',
    nameCN: '南美',
    musicFolder: 'audio/south_america',
  },
  AFRICA: {
    id: 'africa',
    nameCN: '非洲',
    musicFolder: 'audio/africa',
  },
  OCEANIA: {
    id: 'oceania',
    nameCN: '大洋洲',
    musicFolder: 'audio/oceania',
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

async function getAudioPaths(exts: string[] = ['.mp3', '.wav', '.ogg'], baseDir: string): Promise<string[]> {
  const fetchDir = async (dir = baseDir) => {
    const paths: string[] = [];
    try {
      const res = await fetch(dir);
      if (!res.ok) return paths;

      const html = await res.text();
      const links = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('a[href]');

      for (const link of links) {
        const href = link.getAttribute('href')?.trim();
        if (!href || href.startsWith('../')) continue;

        const fullUrl = new URL(href, window.location.origin + dir).href;
        if (href.endsWith('/')) {
          // 递归遍历子目录
          paths.push(...await fetchDir(fullUrl.replace(window.location.origin, '')));
        } else {
          // 过滤指定扩展名（忽略大小写）
          const fileExt = '.' + href.split('.').pop()?.toLowerCase() || '';
          if (exts.map(e => e.toLowerCase()).includes(fileExt)) {
            paths.push(fullUrl);
          }
        }
      }
    } catch (err) {
      console.error(`遍历目录 ${dir} 失败：`, err);
    }
    return paths;
  };

  return fetchDir();
}

const REGION_MUSIC_FILES: Record<Region, string[]> = (() => {
  // glob 扫描 audio 下所有音频文件（含子目录）
  const modules = import.meta.glob<string>('/src/audio/**/*.{mp3,wav,flac,aac,ape}', { eager: true });
  const paths = Object.keys(modules).map(path => new URL(path, window.location.origin).href);
  // 按 audio 下的一级目录分组（如 /audio/cn/xxx.mp3 → 分组到 cn）
  return paths.reduce((acc, fullUrl) => {
    // 提取区域（一级目录名）：从 URL 中截取 /audio/[region]/... 中的 region
    const regionMatch = fullUrl.match(/\/audio\/([^\/]+)\//);
    if (!regionMatch) return acc;

    const region = regionMatch[1] as Region;
    // 初始化该区域数组（若不存在），并添加当前音频路径
    acc[region] = acc[region] || [];
    acc[region].push(fullUrl);
    return acc;
  }, {} as Record<Region, string[]>);
})();

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
    const path = REGION_MUSIC_FILES[region][Math.floor(Math.random() * REGION_MUSIC_FILES[region].length)];
    console.log(`获取地区 ${region} 的音乐路径: ${path}`);
    return path;
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
