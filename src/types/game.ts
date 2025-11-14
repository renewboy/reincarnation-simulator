// 游戏配置类型
export interface CountryData {
  rank: number;
  births_per_year: number;
  birth_probability: number;
  probability_percentage: number;
  total_population: number;
  birth_rate_per_1000: number;
  life_expectancy: number;
  base_life_range: {
    min: number;
    max: number;
  };
  health_benchmark: number;
  advantage_score: number;
  tags: readonly string[];
  special_conditions: {
    rare_birth_chance: number;
    elite_class_chance: number;
  };
  chineseName: string;
}

export interface GameConfig {
  metadata: {
    name: string;
    version: string;
    description: string;
    data_sources: Record<string, string>;
    update_date: string;
    total_countries: number;
  };
  game_mechanics: {
    probability_calculation: string;
    base_life_range: string;
    health_benchmark: string;
    difficulty_levels: Record<string, {
      probability_multiplier: number;
      life_bonus: number;
    }>;
  };
  countries: Record<string, CountryData>;
}

// 角色属性
export interface CharacterAttributes {
  health: number;      // 健康 0-100
  intelligence: number; // 智力 0-100
  emotion: number;     // 情绪 0-100
  wealth: number;      // 财富 0-100
  charisma: number;    // 魅力 0-100
  creativity: number;  // 创造力 0-100
}

// MBTI性格系统
export interface MBTIPersonality {
  ie: number; // 内向-外向 (0-1, 0=内向, 1=外向)
  sn: number; // 感觉-直觉 (0-1, 0=感觉, 1=直觉)
  tf: number; // 思考-情感 (0-1, 0=思考, 1=情感)
  jp: number; // 判断-感知 (0-1, 0=判断, 1=感知)
}


export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  [key: string]: any;
}

// 人生事件
export interface LifeEvent {
  age: number;
  description: string;
  options: EventOption[];
  messages: Message[];
}

export interface EventOption {
  text: string;
  effects: {
    attributes?: Partial<CharacterAttributes>;
    personality?: Partial<MBTIPersonality>;
    gold?: number;
  };
}

// 道具类型
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  effects: {
    attributes?: Partial<CharacterAttributes>;
    personality?: Partial<MBTIPersonality>;
    lifespan?: number;
  };
  type: 'consumable' | 'permanent';
}

// 教育阶段类型
export type EducationStage = 
  | 'none'           // 未入学
  | 'elementary'     // 小学
  | 'middle'         // 中学
  | 'high'           // 高中
  | 'bachelor'       // 本科
  | 'master'         // 硕士
  | 'phd'            // 博士
  | 'completed';     // 完成所有学业

// 教育信息
export interface Education {
  stage: EducationStage;
  major?: string;         // 本科专业名称
  masterMajor?: string;   // 硕士专业名称
  phdMajor?: string;      // 博士专业名称
  startAge?: number;      // 开始年龄
  endAge?: number;        // 结束年龄
  institution?: string;   // 学校名称
  achievements?: string[]; // 学术成就
}

// 职业类型
export interface Career {
  name: string;           // 职业名称
  type: string;          // 职业类型
  startAge: number;       // 开始年龄
  description: string;    // 职业描述
  experience: string;    // 职业经历
}

// 游戏状态
export interface GameState {
  // 基本信息
  currentCountry: string;
  currentAge: number;
  maxAge: number;
  
  // 角色属性
  attributes: CharacterAttributes;
  personality: MBTIPersonality;
  
  // 资源
  gold: number;
  items: Item[];
  
  // 教育职业系统
  education: Education;
  career?: Career;
  isChoosingEducation: boolean;  // 是否正在选择教育/职业
  pendingEducationChoice?: {
    type: 'major' | 'master' | 'phd' | 'career';
    options: string[];
  };
  
  // 游戏进度
  lifeHistory: LifeEvent[];
  currentEvent: LifeEvent | null;
  
  // 轮回计数
  reincarnationCount: number;
  
  // 游戏阶段
  gamePhase: 'start' | 'country-select' | 'playing' | 'education-choice' | 'ended';
}

// 道具商店项目
export const SHOP_ITEMS: Item[] = [
  {
    id: 'lucky_charm',
    name: '幸运符',
    description: '增加全属性+5',
    price: 100,
    icon: '🍀',
    effects: {
      attributes: {
        health: 5,
        intelligence: 5,
        emotion: 5,
        wealth: 5,
        charisma: 5,
        creativity: 5,
      },
    },
    type: 'consumable',
  },
  {
    id: 'health_juice',
    name: '健康果汁',
    description: '增加健康+20',
    price: 50,
    icon: '🧃',
    effects: {
      attributes: {
        health: 20,
      },
    },
    type: 'consumable',
  },
  {
    id: 'study_booster',
    name: '学习加速器',
    description: '增加智力+20',
    price: 50,
    icon: '📚',
    effects: {
      attributes: {
        intelligence: 20,
      },
    },
    type: 'consumable',
  },
  {
    id: 'social_booster',
    name: '社交助推器',
    description: '增加魅力+20',
    price: 50,
    icon: '💬',
    effects: {
      attributes: {
        charisma: 20,
      },
    },
    type: 'consumable',
  },
  {
    id: 'reincarnation_medal',
    name: '轮回勋章',
    description: '下一世继承75%金币（替代默认50%）',
    price: 200,
    icon: '🏅',
    effects: {},
    type: 'permanent',
  },
  {
    id: 'destiny_editor',
    name: '命运编辑器',
    description: '延长寿命+10年',
    price: 300,
    icon: '⏱️',
    effects: {
      lifespan: 10,
    },
    type: 'consumable',
  },
];
