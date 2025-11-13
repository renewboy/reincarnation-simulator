import { useState, useEffect, useCallback } from 'react';
import type {
  GameState,
  GameConfig,
  CountryData,
  CharacterAttributes,
  MBTIPersonality,
  LifeEvent,
  EventOption,
  Item,
  Education,
  Career,
  EducationStage,
} from '../types/game';
import { generateLifeEvent, generateMajorOptions, generateCareerOptions, setCurrentModel as setLLMCurrentModel } from '../services/llm';
import { SHOP_ITEMS } from '../types/game';
import { getCountryNameCN } from '@/utils/countryNames';

// 教育系统年龄配置 - 统一管理
const AGE_CONFIG = {
  ELEMENTARY_START: 6,
  MIDDLE_START: 12,
  HIGH_START: 15,
  BACHELOR_START: 18,
  BACHELOR_END: 22, // 本科毕业年龄
  MASTER_START: 22,
  MASTER_END: 25, // 硕士毕业年龄
  PHD_START: 25,
  PHD_END: 29, // 博士毕业年龄
  CAREER_START: 29, // 开始职业选择
} as const;

// 计算学习时长
const calculateStudyDuration = (major: string): number => {
  const longMajors = ['医学', '建筑学', '法学', '工程'];
  return longMajors.some(m => major.includes(m)) ? 5 : 4;
};

// 初始化角色属性
function initializeAttributes(countryData: CountryData): CharacterAttributes {
  const baseHealth = Math.min(100, countryData.health_benchmark + Math.random() * 20);
  const baseWealth = countryData.advantage_score * 100;
  
  return {
    health: Math.round(baseHealth),
    intelligence: Math.round(50 + Math.random() * 20),
    emotion: Math.round(60 + Math.random() * 20),
    wealth: Math.round(baseWealth),
    charisma: Math.round(50 + Math.random() * 20),
    creativity: Math.round(50 + Math.random() * 20),
  };
}

// 初始化MBTI性格
function initializePersonality(): MBTIPersonality {
  return {
    ie: Math.random(),
    sn: Math.random(),
    tf: Math.random(),
    jp: Math.random(),
  };
}

// 计算加权随机选择国家
function selectRandomCountry(config: GameConfig): string {
  const countries = Object.keys(config.countries);
  const random = Math.random();
  let cumulative = 0;
  
  for (const country of countries) {
    cumulative += config.countries[country].birth_probability;
    if (random <= cumulative) {
      return country;
    }
  }
  
  return countries[0]; // 备用
}

export function useGameState() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentCountry: '',
    currentAge: 0,
    maxAge: 80,
    attributes: {
      health: 50,
      intelligence: 50,
      emotion: 50,
      wealth: 50,
      charisma: 50,
      creativity: 50,
    },
    personality: {
      ie: 0.5,
      sn: 0.5,
      tf: 0.5,
      jp: 0.5,
    },
    gold: 100,
    items: [],
    education: {
      stage: 'none',
    },
    career: undefined,
    isChoosingEducation: false,
    pendingEducationChoice: undefined,
    lifeHistory: [],
    currentEvent: null,
    reincarnationCount: 0,
    gamePhase: 'start',
  });
  
  const [isGeneratingEvent, setIsGeneratingEvent] = useState(false);

  // 加载游戏配置
  useEffect(() => {
    fetch('/game_config.json')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('加载游戏配置失败:', err));
  }, []);

  // 开始投胎
  const startReincarnation = useCallback(() => {
    if (!config) return;
    
    let country = selectRandomCountry(config);
    const countryData = config.countries[country];
    country = getCountryNameCN(country);
    const age = 0;
    const maxAge = Math.round(
      countryData.base_life_range.min +
      Math.random() * (countryData.base_life_range.max - countryData.base_life_range.min)
    );
    
    setGameState((prev) => ({
      ...prev,
      currentCountry: country,
      currentAge: age,
      maxAge,
      attributes: initializeAttributes(countryData),
      personality: initializePersonality(),
      education: {
        stage: 'none', // 初始为未入学状态
      },
      lifeHistory: [],
      currentEvent: null,
      gamePhase: 'playing',
    }));
    
    // 立即生成第一个事件
    setTimeout(() => generateNextEvent(country, age, initializeAttributes(countryData), initializePersonality(), []), 500);
  }, [config]);

  // 生成下一个事件
  const generateNextEvent = useCallback(
    async (
      country: string,
      age: number,
      attributes: CharacterAttributes,
      personality: MBTIPersonality,
      history: LifeEvent[]
    ) => {
      setIsGeneratingEvent(true);
      try {
        const previousEventDescriptions = history.map(e => e.description);
        const event = await generateLifeEvent(age, country, attributes, personality, previousEventDescriptions);
        setGameState((prev) => ({
          ...prev,
          currentEvent: event,
        }));
      } catch (error) {
        console.error('生成事件失败:', error);
      } finally {
        setIsGeneratingEvent(false);
      }
    },
    []
  );

  // 生成教育选项
  const generateEducationOptions = useCallback(async (type: 'major' | 'career', country: string, attributes: CharacterAttributes, personality: MBTIPersonality, education?: Education, currentAge?: number) => {
    try {
      if (type === 'major') {
        // 动态生成基于当前年龄的专业选项
        const majors = await generateMajorOptions(currentAge || 18, country, attributes, personality, education);
        return majors;
      } else if (type === 'career') {
        // 根据实际学历等级动态生成职业选项
        const educationLevel = education?.stage || 'bachelor';
        const major = education?.major || education?.masterMajor || education?.phdMajor || '通用专业';
        const careers = await generateCareerOptions(country, major, educationLevel, attributes, personality);
        return careers;
      }
    } catch (error) {
      console.error('生成教育选项失败:', error);
      // 返回默认选项
      if (type === 'major') {
        return ['计算机科学与技术', '工商管理', '心理学', '生物科学'];
      } else {
        return ['高级工程师', '企业管理者', '研究员', '咨询师'];
      }
    }
    return [];
  }, []);

  // 计算下一个事件触发的年龄
  const getNextEventAge = useCallback((currentAge: number, education?: Education): number => {
    // 重大节点年龄（必出事件）
    const milestones = [0, 3, 6, 12, 18, 22, 25, 29, 40, 60, 80];
    
    // 找到下一个节点
    const nextMilestone = milestones.find(m => m > currentAge);
    
    // 随机间隔（2-5年）
    const randomInterval = Math.floor(Math.random() * 4) + 2; // 2到5年
    const randomNextAge = currentAge + randomInterval;
    
    // 如果有节点且节点比随机时间早，选择节点；否则选择随机时间
    if (nextMilestone !== undefined && nextMilestone < randomNextAge) {
      return nextMilestone;
    }
    
    return randomNextAge;
  }, []);

  // 检查是否需要触发教育选择 - 只检查18岁专业选择
  const checkEducationTriggers = useCallback((age: number, education: Education): 'major' | 'master' | 'phd' | 'career' | null => {
    // 18岁精确触发大学专业选择（避免与事件系统冲突）
    if (age === AGE_CONFIG.BACHELOR_START && education.stage === 'high' && !education.major) {
      return 'major';
    }
    if (age === AGE_CONFIG.MASTER_START && education.stage === 'bachelor' && !education.masterMajor) {
      return 'master';
    }
    if (age === AGE_CONFIG.PHD_START && education.stage === 'master' && !education.phdMajor) {
      return 'phd';
    }
    return null;
  }, []);

  // 选择事件选项 - 重构以解决年龄同步问题
  const chooseOption = useCallback(
    (option: EventOption) => {
      setGameState((prev) => {
        if (!prev.currentEvent) return prev;
        
        // 应用属性变化
        const newAttributes = { ...prev.attributes };
        if (option.effects.attributes) {
          Object.entries(option.effects.attributes).forEach(([key, value]) => {
            if (value !== undefined) {
              newAttributes[key as keyof CharacterAttributes] = Math.max(
                0,
                Math.min(100, newAttributes[key as keyof CharacterAttributes] + value)
              );
            }
          });
        }
        
        // 应用性格变化
        const newPersonality = { ...prev.personality };
        if (option.effects.personality) {
          Object.entries(option.effects.personality).forEach(([key, value]) => {
            if (value !== undefined) {
              newPersonality[key as keyof MBTIPersonality] = Math.max(
                0,
                Math.min(1, newPersonality[key as keyof MBTIPersonality] + value)
              );
            }
          });
        }
        
        // 应用金币变化
        const newGold = prev.gold + (option.effects.gold || 0);
        
        // 记录事件历史
        const newHistory = [...prev.lifeHistory, prev.currentEvent];
        
        // 计算下一个事件年龄
        const nextEventAge = getNextEventAge(prev.currentEvent.age, prev.education);
        const newAge = Math.min(nextEventAge, prev.maxAge);
        
        // 教育阶段自动更新（只处理基础教育阶段）
        const updatedEducation = { ...prev.education };
        if (newAge >= AGE_CONFIG.ELEMENTARY_START && newAge < AGE_CONFIG.MIDDLE_START && updatedEducation.stage === 'none') {
          updatedEducation.stage = 'elementary';
        } else if (newAge >= AGE_CONFIG.MIDDLE_START && newAge < AGE_CONFIG.HIGH_START && updatedEducation.stage === 'elementary') {
          updatedEducation.stage = 'middle';
        } else if (newAge >= AGE_CONFIG.HIGH_START && newAge < AGE_CONFIG.BACHELOR_START && updatedEducation.stage === 'middle') {
          updatedEducation.stage = 'high';
        }
        
        // 检查是否结束
        if (newAge >= prev.maxAge || newAttributes.health <= 0) {
          return {
            ...prev,
            attributes: newAttributes,
            personality: newPersonality,
            gold: Math.max(0, newGold),
            education: updatedEducation,
            lifeHistory: newHistory,
            currentEvent: null,
            currentAge: newAge,
            gamePhase: 'ended' as const,
          };
        }
        
        // 检查是否需要触发教育选择（18岁本科专业选择）
        const educationTrigger = checkEducationTriggers(newAge, updatedEducation);
        if (educationTrigger) {
          setTimeout(() => {
            setGameState((currentState) => ({
              ...currentState,
              isChoosingEducation: true,
              pendingEducationChoice: {
                type: educationTrigger,
                options: [],
              },
              gamePhase: 'education-choice' as const,
            }));
          }, 200);
          
          return {
            ...prev,
            attributes: newAttributes,
            personality: newPersonality,
            gold: Math.max(0, newGold),
            education: updatedEducation,
            lifeHistory: newHistory,
            currentEvent: null,
            currentAge: newAge,
            gamePhase: 'playing' as const, // 保持playing状态
          };
        }
        
        setTimeout(
            () => generateNextEvent(prev.currentCountry, newAge, newAttributes, newPersonality, newHistory),
            500
        );
        
        return {
          ...prev,
          attributes: newAttributes,
          personality: newPersonality,
          gold: Math.max(0, newGold),
          education: updatedEducation,
          lifeHistory: newHistory,
          currentEvent: null,
          currentAge: newAge,
        };
      });
    },
    [generateNextEvent, getNextEventAge, checkEducationTriggers]
  );

  // 购买道具
  const buyItem = useCallback((item: Item) => {
    setGameState((prev) => {
      if (prev.gold < item.price) {
        return prev; // 金币不足
      }
      
      const newAttributes = { ...prev.attributes };
      if (item.effects.attributes) {
        Object.entries(item.effects.attributes).forEach(([key, value]) => {
          if (value !== undefined) {
            newAttributes[key as keyof CharacterAttributes] = Math.max(
              0,
              Math.min(100, newAttributes[key as keyof CharacterAttributes] + value)
            );
          }
        });
      }
      
      const newMaxAge = prev.maxAge + (item.effects.lifespan || 0);
      
      return {
        ...prev,
        gold: prev.gold - item.price,
        attributes: newAttributes,
        maxAge: newMaxAge,
        items: [...prev.items, item],
      };
    });
  }, []);

  // 重新开始（继承机制）
  const restart = useCallback(() => {
    setGameState((prev) => {
      const hasReincarnationMedal = prev.items.some(item => item.id === 'reincarnation_medal');
      const inheritanceRate = hasReincarnationMedal ? 0.75 : 0.5;
      const inheritedGold = Math.floor(prev.gold * inheritanceRate);
      
      // 属性继承：基础值50，加上上一世属性的概率加成
      // 如果上一世某属性>70，有30%概率获得+10加成
      // 如果上一世某属性>85，有50%概率获得+15加成
      const inheritAttribute = (prevValue: number): number => {
        let base = 50;
        if (prevValue > 85 && Math.random() < 0.5) {
          base += 15;
        } else if (prevValue > 70 && Math.random() < 0.3) {
          base += 10;
        }
        return Math.min(100, base);
      };
      
      // 性格继承：基础值0.5，向上一世性格倾向偏移
      // 偏移幅度为上一世偏离0.5的值的30%
      const inheritPersonality = (prevValue: number): number => {
        const deviation = prevValue - 0.5;
        const inheritedDeviation = deviation * 0.3;
        return Math.max(0, Math.min(1, 0.5 + inheritedDeviation));
      };
      
      return {
        currentCountry: '',
        currentAge: 0,
        maxAge: 80,
        attributes: {
          health: inheritAttribute(prev.attributes.health),
          intelligence: inheritAttribute(prev.attributes.intelligence),
          emotion: inheritAttribute(prev.attributes.emotion),
          wealth: inheritAttribute(prev.attributes.wealth),
          charisma: inheritAttribute(prev.attributes.charisma),
          creativity: inheritAttribute(prev.attributes.creativity),
        },
        personality: {
          ie: inheritPersonality(prev.personality.ie),
          sn: inheritPersonality(prev.personality.sn),
          tf: inheritPersonality(prev.personality.tf),
          jp: inheritPersonality(prev.personality.jp),
        },
        gold: inheritedGold + 100, // 继承金币 + 新手金币
        items: [],
        education: {
          stage: 'none',
        },
        career: undefined,
        isChoosingEducation: false,
        pendingEducationChoice: undefined,
        lifeHistory: [],
        currentEvent: null,
        reincarnationCount: prev.reincarnationCount + 1,
        gamePhase: 'start',
      };
    });
  }, []);

  // 专业选择处理 - 18岁选择本科专业
  const handleMajorSelection = useCallback(async (major: string) => {
    setGameState((prev) => {
      // 18岁选择专业后，直接推进到本科毕业年龄（22岁）
      const newAge = getNextEventAge(prev.currentAge, prev.education);
      console.log("currentAge: ", prev.currentAge, "newAge: ", newAge);
      const newState = {
        ...prev,
        currentAge: newAge,
        education: {
          stage: 'bachelor' as const,
          major,
          startAge: AGE_CONFIG.BACHELOR_START,
          endAge: newAge,
        },
        isChoosingEducation: false,
        pendingEducationChoice: undefined,
        gamePhase: 'playing' as const,
      };

      // 立即触发硕士选择（不等待事件系统）
      setTimeout(() => {
        if(newAge == AGE_CONFIG.MASTER_START) { 
          setGameState((currentState) => ({
            ...currentState,
            isChoosingEducation: true,
            pendingEducationChoice: {
              type: 'master' as const,
              options: [],
            },
            gamePhase: 'education-choice' as const,
          }));
        } else {
          generateNextEvent(prev.currentCountry, newAge, prev.attributes, prev.personality, prev.lifeHistory);
        }
       
      }, 100);

      return newState;
    });
  }, []);

  // 检查是否需要触发教育选择 - 只检查18岁专业选择
  // 学术选择处理 - 硕士/博士选择和职业选择
  const handleAcademicChoice = useCallback(async (type: 'master' | 'phd' | 'career', choice: string) => {
    setGameState((prev) => {
      let newState;
      
      if (type === 'master') {
        // 硕士阶段：22岁开始，25岁毕业
        const newAge = getNextEventAge(prev.currentAge, prev.education);
        console.log("currentAge: ", prev.currentAge, "newAge: ", newAge);
        
        newState = {
          ...prev,
          currentAge: newAge,
          education: {
            ...prev.education,
            stage: 'master' as const,
            masterMajor: choice,
            startAge: prev.currentAge,
            endAge: newAge,
          },
          isChoosingEducation: false,
          pendingEducationChoice: undefined,
          gamePhase: 'playing' as const,
        };
        
        // 硕士毕业后立即触发博士选择
        setTimeout(() => {
          if(newAge == AGE_CONFIG.PHD_START) { 
            setGameState((currentState) => ({
              ...currentState,
              isChoosingEducation: true,
              pendingEducationChoice: {
                type: 'phd' as const,
                options: [],
              },
              gamePhase: 'education-choice' as const,
            }));
          } else {
            generateNextEvent(prev.currentCountry, newAge, prev.attributes, prev.personality, prev.lifeHistory);
          }
        
        }, 100);
          
      } else if (type === 'phd') {
        // 博士阶段：25岁开始，29岁毕业
        const newAge = getNextEventAge(prev.currentAge, prev.education);
        console.log("currentAge: ", prev.currentAge, "newAge: ", newAge);
        
        newState = {
          ...prev,
          currentAge: newAge,
          education: {
            ...prev.education,
            stage: 'phd' as const,
            phdMajor: choice,
            startAge: prev.currentAge,
            endAge: newAge,
          },
          isChoosingEducation: false,
          pendingEducationChoice: undefined,
          gamePhase: 'playing' as const,
        };
        
        // 博士毕业后等待用户选择职业或跳过，然后自动生成下一个事件
        setTimeout(() => {
          if(newAge == AGE_CONFIG.PHD_END) { 
            // 博士毕业后，检查是否有新的教育触发（职业选择）
            if (!newState.career) {
              // 如果没有职业，自动触发职业选择
              setGameState((currentState) => ({
                ...currentState,
                isChoosingEducation: true,
                pendingEducationChoice: {
                  type: 'career' as const,
                  options: [],
                },
                gamePhase: 'education-choice' as const,
              }));
            }
          } else {
            generateNextEvent(prev.currentCountry, newAge, prev.attributes, prev.personality, prev.lifeHistory);
          }
        }, 100);  
        
      } else {
        // 职业选择：直接设置，不推进年龄，但需要生成下一个人生事件
        const baseAge = prev.currentAge;
        const careerType = prev.education.stage === 'phd' ? '博士职业' :
                          prev.education.stage === 'master' ? '硕士职业' :
                          '本科职业';
        
        newState = {
          ...prev,
          currentAge: baseAge,
          career: {
            name: choice,
            type: careerType,
            startAge: baseAge,
            description: `基于${careerType}的职业发展`,
            experience: '根据学历背景获得的职业技能',
          },
          education: {
            ...prev.education,
            stage: 'completed' as const,
          },
          isChoosingEducation: false,
          pendingEducationChoice: undefined,
          gamePhase: 'playing' as const,
        };
        
        // 职业选择完成后立即生成下一个人生事件
        setTimeout(() => {
          generateNextEvent(prev.currentCountry, baseAge, prev.attributes, prev.personality, prev.lifeHistory);
        }, 500);
      }

      return newState;
    });
  }, []);

  // 跳过教育直接就业函数
  const onSkipEducation = useCallback(async (type: 'master' | 'phd') => {
    setGameState((prev) => {
      const newState = {
        ...prev,
        education: {
          ...prev.education,
          stage: 'completed' as const,
        },
        isChoosingEducation: false,
        pendingEducationChoice: undefined,
        gamePhase: 'playing' as const,
      };

      // 跳过教育后立即触发职业选择
      setTimeout(() => {
        setGameState((currentState) => ({
          ...currentState,
          isChoosingEducation: true,
          pendingEducationChoice: {
            type: 'career' as const,
            options: [],
          },
          gamePhase: 'education-choice' as const,
        }));
      }, 100);

      return newState;
    });
  }, []);

  // 模型切换功能
  const onModelChange = useCallback((modelId: string) => {
    // 这里可以添加模型切换逻辑，比如更新全局状态或重新初始化服务
    console.log('模型切换到:', modelId);
    // 可以将模型ID存储到localStorage或状态管理中
    localStorage.setItem('currentModel', modelId);
  }, []);

  return {
    config,
    gameState,
    isGeneratingEvent,
    startReincarnation,
    chooseOption,
    buyItem,
    restart,
    handleMajorSelection,
    handleAcademicChoice,
    onSkipEducation,
    checkEducationTriggers,
    generateEducationOptions,
    onModelChange,
    setCurrentModel: setLLMCurrentModel,
  };
}
