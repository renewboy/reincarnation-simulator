/**
 * 游戏配置常量
 */
export const GAME_CONFIG = {
  // LLM模型配置
  LLM: {
    // 默认使用fake模型用于调试
    MODEL: 'fake-rapid',
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    // 可用模型列表
    AVAILABLE_MODELS: [
      {
        id: 'doubao-seed-1-6-flash-250828',
        name: '豆包-seed-1.6-flash (新版)',
        type: 'production'
      },
      {
        id: 'fake-rapid',
        name: 'Fake模型-快速版 (调试用)',
        type: 'debug'
      },
      {
        id: 'fake-basic',
        name: 'Fake模型-基础版 (调试用)',
        type: 'debug'
      }
    ]
  },
  
  // 游戏设置
  GAME: {
    DEFAULT_GOLD: 100,
    MIN_ATTRIBUTE: 0,
    MAX_ATTRIBUTE: 100,
    DEFAULT_MAX_AGE: 80,
    BASE_INHERITANCE_RATE: 0.5,
    REINCARNATION_MEDAL_RATE: 0.75,
  },
  
} as const;

// 导出具体的常量供直接使用
export const MODEL_NAME = GAME_CONFIG.LLM.MODEL;
export const DEFAULT_GOLD = GAME_CONFIG.GAME.DEFAULT_GOLD;