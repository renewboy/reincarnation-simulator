/**
 * 地区分类系统
 * 将80个国家按照9个地区进行分类
 */

export const REGIONS = {
  EAST_ASIA: 'east_asia',
  CENTRAL_ASIA: 'central_asia', 
  SOUTH_ASIA: 'south_asia',
  MIDDLE_EAST: 'middle_east',
  EUROPE: 'europe',
  NORTH_AMERICA: 'north_america',
  SOUTH_AMERICA: 'south_america',
  AFRICA: 'africa',
  OCEANIA: 'oceania',
} as const;

export type Region = typeof REGIONS[keyof typeof REGIONS];

export const REGION_NAMES_CN: Record<Region, string> = {
  [REGIONS.EAST_ASIA]: '东亚',
  [REGIONS.CENTRAL_ASIA]: '中亚',
  [REGIONS.SOUTH_ASIA]: '南亚',
  [REGIONS.MIDDLE_EAST]: '中东',
  [REGIONS.EUROPE]: '欧洲',
  [REGIONS.NORTH_AMERICA]: '北美',
  [REGIONS.SOUTH_AMERICA]: '南美',
  [REGIONS.AFRICA]: '非洲',
  [REGIONS.OCEANIA]: '大洋洲',
};

export const REGION_MUSIC_FILES: Record<Region, string> = {
  [REGIONS.EAST_ASIA]: 'audio/east_asia_bgm.mp3',
  [REGIONS.CENTRAL_ASIA]: 'audio/central_asia_bgm.mp3',
  [REGIONS.SOUTH_ASIA]: 'audio/south_asia_bgm.mp3',
  [REGIONS.MIDDLE_EAST]: 'audio/middle_east_bgm.mp3',
  [REGIONS.EUROPE]: 'audio/europe_bgm.mp3',
  [REGIONS.NORTH_AMERICA]: 'audio/north_america_bgm.mp3',
  [REGIONS.SOUTH_AMERICA]: 'audio/south_america_bgm.mp3',
  [REGIONS.AFRICA]: 'audio/africa_bgm.mp3',
  [REGIONS.OCEANIA]: 'audio/oceania_bgm.mp3',
};

/**
 * 国家到地区的映射
 * 基于地理位置和文化的合理分类
 */
export const COUNTRY_REGION_MAP: Record<string, Region> = {
  // 东亚
  'China': REGIONS.EAST_ASIA,
  'Japan': REGIONS.EAST_ASIA,
  'North Korea': REGIONS.EAST_ASIA,
  'South Korea': REGIONS.EAST_ASIA,
  
  // 中亚
  'Kazakhstan': REGIONS.CENTRAL_ASIA,
  'Uzbekistan': REGIONS.CENTRAL_ASIA,
  
  // 南亚
  'Afghanistan': REGIONS.SOUTH_ASIA,
  'Bangladesh': REGIONS.SOUTH_ASIA,
  'India': REGIONS.SOUTH_ASIA,
  'Nepal': REGIONS.SOUTH_ASIA,
  'Pakistan': REGIONS.SOUTH_ASIA,
  'Sri Lanka': REGIONS.SOUTH_ASIA,
  
  // 中东
  'Iran': REGIONS.MIDDLE_EAST,
  'Iraq': REGIONS.MIDDLE_EAST,
  'Jordan': REGIONS.MIDDLE_EAST,
  'Saudi Arabia': REGIONS.MIDDLE_EAST,
  'Syria': REGIONS.MIDDLE_EAST,
  'Turkey': REGIONS.MIDDLE_EAST,
  'Yemen': REGIONS.MIDDLE_EAST,
  
  // 欧洲
  'France': REGIONS.EUROPE,
  'Germany': REGIONS.EUROPE,
  'Italy': REGIONS.EUROPE,
  'Poland': REGIONS.EUROPE,
  'Russia': REGIONS.EUROPE,
  'Spain': REGIONS.EUROPE,
  'Ukraine': REGIONS.EUROPE,
  'United Kingdom': REGIONS.EUROPE,
  
  // 北美
  'Canada': REGIONS.NORTH_AMERICA,
  'United States': REGIONS.NORTH_AMERICA,
  'Mexico': REGIONS.NORTH_AMERICA,
  
  // 南美
  'Venezuela': REGIONS.SOUTH_AMERICA,
  'Brazil': REGIONS.SOUTH_AMERICA,
  'Argentina': REGIONS.SOUTH_AMERICA,
  'Chile': REGIONS.SOUTH_AMERICA,
  'Colombia': REGIONS.SOUTH_AMERICA,
  'Ecuador': REGIONS.SOUTH_AMERICA,
  'Peru': REGIONS.SOUTH_AMERICA,
  'Bolivia': REGIONS.SOUTH_AMERICA,
  'Guatemala': REGIONS.SOUTH_AMERICA,
  
  // 非洲
  'Tanzania': REGIONS.AFRICA,
  'Ethiopia': REGIONS.AFRICA,
  'Kenya': REGIONS.AFRICA,
  'Mozambique': REGIONS.AFRICA,
  'Madagascar': REGIONS.AFRICA,
  'Rwanda': REGIONS.AFRICA,
  'Burundi': REGIONS.AFRICA,
  'Chad': REGIONS.AFRICA,
  'Mali': REGIONS.AFRICA,
  'Burkina Faso': REGIONS.AFRICA,
  'Niger': REGIONS.AFRICA,
  'Benin': REGIONS.AFRICA,
  'Togo': REGIONS.AFRICA,
  'Sierra Leone': REGIONS.AFRICA,
  'Ghana': REGIONS.AFRICA,
  'Guinea': REGIONS.AFRICA,
  'Nigeria': REGIONS.AFRICA,
  'Côte d\'Ivoire': REGIONS.AFRICA,
  'Senegal': REGIONS.AFRICA,
  'Somalia': REGIONS.AFRICA,
  'South Sudan': REGIONS.AFRICA,
  'Zambia': REGIONS.AFRICA,
  'Malawi': REGIONS.AFRICA,
  'Zimbabwe': REGIONS.AFRICA,
  'Angola': REGIONS.AFRICA,
  'Algeria': REGIONS.AFRICA,
  'Morocco': REGIONS.AFRICA,
  'Egypt': REGIONS.AFRICA,
  'Sudan': REGIONS.AFRICA,
  'South Africa': REGIONS.AFRICA,
  
  // 大洋洲
  'Australia': REGIONS.OCEANIA,
  'Papua New Guinea': REGIONS.OCEANIA,
  'Malaysia': REGIONS.OCEANIA,
};

/**
 * 获取国家所属地区
 */
export function getCountryRegion(countryName: string): Region | null {
  return COUNTRY_REGION_MAP[countryName] || null;
}

/**
 * 获取地区名称
 */
export function getRegionName(region: Region): string {
  return REGION_NAMES_CN[region];
}

/**
 * 获取地区音乐文件路径
 */
export function getRegionMusicPath(region: Region): string {
  return REGION_MUSIC_FILES[region];
}

/**
 * 获取地区描述（用于音频生成）
 */
export function getRegionDescription(region: Region): string {
  switch (region) {
    case REGIONS.EAST_ASIA:
      return '东亚地区，包括中国、日本、韩国等具有深厚历史文化底蕴的国家，音乐风格体现古代宫廷音乐和现代都市元素的融合';
    case REGIONS.CENTRAL_ASIA:
      return '中亚地区，包括哈萨克斯坦、乌兹别克斯坦等国家，音乐风格融合丝绸之路的古代商队文化和游牧民族的传统音乐';
    case REGIONS.SOUTH_ASIA:
      return '南亚地区，包括印度、巴基斯坦、孟加拉国等香料之国，音乐风格丰富多样，融合古典印度音乐和宗教音乐元素';
    case REGIONS.MIDDLE_EAST:
      return '中东地区，包括伊朗、土耳其、沙特阿拉伯等古代文明发源地，音乐风格展现沙漠风光、古代文明和宗教文化的宏伟';
    case REGIONS.EUROPE:
      return '欧洲地区，包括法国、德国、英国等古典音乐发源地，音乐风格融合古典音乐传统和现代音乐的精致优雅';
    case REGIONS.NORTH_AMERICA:
      return '北美地区，包括美国、加拿大、墨西哥等国，音乐风格融合爵士乐、蓝调音乐和现代流行音乐的多元创新';
    case REGIONS.SOUTH_AMERICA:
      return '南美地区，包括巴西、阿根廷、秘鲁等热情大陆，音乐风格融合桑巴、探戈等拉丁音乐和土著音乐的活力';
    case REGIONS.AFRICA:
      return '非洲地区，包括尼日利亚、埃塞俄比亚、南非等充满活力的土地，音乐风格融合传统部落音乐和现代非洲音乐的力量感';
    case REGIONS.OCEANIA:
      return '大洋洲地区，包括澳大利亚、巴布亚新几内亚等国，音乐风格展现广袤海岸、草原风光和土著文化的神秘感';
    default:
      return '未知地区';
  }
}
