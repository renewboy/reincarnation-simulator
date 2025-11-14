import type { CharacterAttributes, MBTIPersonality, LifeEvent, Message } from '../types/game';

// Fake模型快速版本 - 用于调试
export class FakeLLMService {
  private modelId: string;

  constructor(modelId: string) {
    this.modelId = modelId;
  }

  // 生成人生事件 - Fake版本
  async generateLifeEvent(
    age: number,
    country: string,
    attributes: CharacterAttributes,
    personality: MBTIPersonality,
    messages: Message[] = [],
  ): Promise<LifeEvent> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, this.modelId === 'fake-rapid' ? 100 : 500));

    // 根据年龄生成不同类型的事件
    const eventTemplates = this.getAgeEventTemplates(age, country);
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];

    return {
      age,
      description: template.description,
      options: template.options,
      messages: [],
    };
  }

  // 生成专业选项 - Fake版本
  async generateMajorOptions(
    age: number,
    country: string,
    attributes: CharacterAttributes,
    personality: MBTIPersonality
  ): Promise<string[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, this.modelId === 'fake-rapid' ? 50 : 200));

    const majorPool = [
      '计算机科学与技术',
      '软件工程',
      '人工智能',
      '数据科学与大数据技术',
      '工商管理',
      '金融学',
      '经济学',
      '市场营销',
      '心理学',
      '教育学',
      '法学',
      '汉语言文学',
      '英语',
      '新闻学',
      '艺术设计',
      '音乐学',
      '生物科学',
      '临床医学',
      '护理学',
      '环境工程',
      '机械工程',
      '电气工程',
      '建筑学',
      '土木工程',
      '化学工程与工艺'
    ];

    // 根据属性筛选适合的专业
    const suitableMajors: string[] = [];

    if (attributes.intelligence > 70) {
      suitableMajors.push('计算机科学与技术', '软件工程', '人工智能', '数据科学与大数据技术', '生物科学');
    }
    if (attributes.creativity > 70) {
      suitableMajors.push('艺术设计', '音乐学', '心理学', '新闻学');
    }
    if (attributes.charisma > 70) {
      suitableMajors.push('工商管理', '市场营销', '法学', '教育学');
    }
    if (attributes.wealth > 70) {
      suitableMajors.push('金融学', '经济学', '工商管理');
    }

    // 如果没有特别突出的属性，返回通用专业
    if (suitableMajors.length === 0) {
      suitableMajors.push('工商管理', '计算机科学与技术', '心理学', '汉语言文学');
    }

    // 去重并随机选择4个
    const uniqueMajors = Array.from(new Set(suitableMajors));
    const selectedMajors = uniqueMajors.sort(() => 0.5 - Math.random()).slice(0, 4);

    // 如果不够4个，从池中补充
    while (selectedMajors.length < 4) {
      const randomMajor = majorPool[Math.floor(Math.random() * majorPool.length)];
      if (!selectedMajors.includes(randomMajor)) {
        selectedMajors.push(randomMajor);
      }
    }

    return selectedMajors;
  }

  // 生成职业选项 - Fake版本
  async generateCareerOptions(
    country: string,
    major: string,
    educationLevel: string,
    attributes: CharacterAttributes,
    personality: MBTIPersonality
  ): Promise<string[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, this.modelId === 'fake-rapid' ? 50 : 200));

    const careerPool = [
      '软件工程师',
      '产品经理',
      '数据科学家',
      '人工智能工程师',
      '企业管理者',
      '投资顾问',
      '市场营销总监',
      '金融分析师',
      '企业CEO',
      '咨询师',
      '教师',
      '研究员',
      '律师',
      '医生',
      '艺术家',
      '设计师',
      '工程师',
      '技术总监',
      '项目经理',
      '创业家'
    ];

    // 根据教育和属性筛选适合的职业
    const suitableCareers: string[] = [];

    if (major.includes('计算机') || major.includes('软件')) {
      suitableCareers.push('软件工程师', '产品经理', '数据科学家', '人工智能工程师');
    } else if (major.includes('医学')) {
      suitableCareers.push('医生', '医学研究员', '公共卫生专家');
    } else if (major.includes('商科') || major.includes('管理')) {
      suitableCareers.push('企业管理者', '投资顾问', '市场营销总监', '金融分析师');
    }

    if (attributes.intelligence > 80) {
      suitableCareers.push('高级研究员', '首席技术官', 'AI专家');
    }
    if (attributes.charisma > 80) {
      suitableCareers.push('企业CEO', '事业部总经理', '创业家');
    }
    if (attributes.creativity > 80) {
      suitableCareers.push('创意总监', '设计师', '艺术总监');
    }

    // 如果没有特别适合的，返回通用职业
    if (suitableCareers.length === 0) {
      suitableCareers.push('企业管理者', '项目经理', '咨询师', '技术专家');
    }

    // 去重并随机选择4个
    const uniqueCareers = Array.from(new Set(suitableCareers));
    const selectedCareers = uniqueCareers.sort(() => 0.5 - Math.random()).slice(0, 4);

    // 如果不够4个，从池中补充
    while (selectedCareers.length < 4) {
      const randomCareer = careerPool[Math.floor(Math.random() * careerPool.length)];
      if (!selectedCareers.includes(randomCareer)) {
        selectedCareers.push(randomCareer);
      }
    }

    return selectedCareers;
  }

  // 根据年龄获取事件模板
  private getAgeEventTemplates(age: number, country: string) {
    const templates = {
      0: [
        {
          description: `${age}岁时，你在${country}出生了。你的父母为你取了一个很有意义的名字。`,
          options: [
            { text: '健康成长', effects: { attributes: { health: 5, emotion: 5 }, gold: 0, personality: { ie: 0, sn: 0, tf: 0, jp: 0 } } },
            { text: '努力学习', effects: { attributes: { intelligence: 5 }, gold: 0, personality: { ie: 0, sn: 0, tf: 0, jp: 0 } } },
            { text: '培养兴趣', effects: { attributes: { creativity: 5 }, gold: 0, personality: { ie: 0, sn: 0, tf: 0, jp: 0 } } },
            { text: '结交朋友', effects: { attributes: { charisma: 5, emotion: 5 }, gold: 0, personality: { ie: 0, sn: 0, tf: 0, jp: 0 } } },
          ],
        },
      ],
      3: [
        {
          description: `${age}岁时，你在${country}开始上幼儿园了。遇到了很多新朋友和有趣的活动。`,
          options: [
            { text: '积极参与活动', effects: { attributes: { health: 3, charisma: 3, emotion: 3 }, gold: 0, personality: { ie: 0.03, sn: 0, tf: 0.02, jp: 0 } } },
            { text: '专心学习', effects: { attributes: { intelligence: 4 }, gold: 0, personality: { ie: 0, sn: 0.02, tf: 0, jp: 0.02 } } },
            { text: '培养创造力', effects: { attributes: { creativity: 4 }, gold: 0, personality: { ie: 0, sn: 0.03, tf: 0, jp: 0 } } },
            { text: '保守内向', effects: { attributes: { intelligence: 2 }, gold: 0, personality: { ie: -0.03, sn: 0, tf: 0, jp: 0.02 } } },
          ],
        },
      ],
      6: [
        {
          description: `${age}岁时，你在${country}开始上小学了。学习变得更加系统和有趣。`,
          options: [
            { text: '专注学习', effects: { attributes: { intelligence: 5 }, gold: 0, personality: { ie: 0, sn: 0.02, tf: 0, jp: 0.03 } } },
            { text: '全面发展', effects: { attributes: { health: 3, intelligence: 3, charisma: 3 }, gold: 0, personality: { ie: 0.02, sn: 0, tf: 0.02, jp: 0 } } },
            { text: '培养体育爱好', effects: { attributes: { health: 4 }, gold: 0, personality: { ie: 0.03, sn: 0, tf: 0, jp: 0.02 } } },
            { text: '发展艺术天赋', effects: { attributes: { creativity: 5, charisma: 2 }, gold: 0, personality: { ie: 0, sn: 0.03, tf: 0.02, jp: 0 } } },
          ],
        },
      ],
      12: [
        {
          description: `${age}岁时，你在${country}升入中学了。进入了青春期，身体和心理都在快速发展。`,
          options: [
            { text: '努力学习考好高中', effects: { attributes: { intelligence: 6 }, gold: 0, personality: { ie: 0, sn: 0.02, tf: 0, jp: 0.04 } } },
            { text: '发展社交关系', effects: { attributes: { charisma: 5, emotion: 3 }, gold: 0, personality: { ie: 0.04, sn: 0, tf: 0.03, jp: 0 } } },
            { text: '培养领导才能', effects: { attributes: { charisma: 4, intelligence: 3 }, gold: 0, personality: { ie: 0.03, sn: 0.02, tf: 0.01, jp: 0.02 } } },
            { text: '专注特长发展', effects: { attributes: { creativity: 5, intelligence: 3 }, gold: 0, personality: { ie: 0, sn: 0.04, tf: 0, jp: 0.02 } } },
          ],
        },
      ],
      18: [
        {
          description: `${age}岁时，你在${country}面临人生重要选择：高考结束了，是时候选择大学专业了。`,
          options: [
            { text: '选择技术类专业', effects: { attributes: { intelligence: 5 }, gold: 10, personality: { ie: 0, sn: 0.03, tf: 0, jp: 0.02 } } },
            { text: '选择人文类专业', effects: { attributes: { creativity: 5, charisma: 3 }, gold: 5, personality: { ie: 0.02, sn: 0.04, tf: 0.02, jp: 0 } } },
            { text: '选择商科专业', effects: { attributes: { charisma: 4, intelligence: 3 }, gold: 8, personality: { ie: 0.03, sn: 0.02, tf: 0.01, jp: 0.02 } } },
            { text: '选择艺术专业', effects: { attributes: { creativity: 6, charisma: 4 }, gold: 3, personality: { ie: 0, sn: 0.05, tf: 0.02, jp: 0 } } },
          ],
        },
      ],
      22: [
        {
          description: `${age}岁时，你在${country}即将大学毕业。是继续深造还是开始工作？`,
          options: [
            { text: '攻读硕士', effects: { attributes: { intelligence: 4 }, gold: -5, personality: { ie: 0, sn: 0.03, tf: 0, jp: 0.03 } } },
            { text: '直接就业', effects: { attributes: { wealth: 5, emotion: 3 }, gold: 15, personality: { ie: 0.03, sn: 0, tf: 0.02, jp: 0.02 } } },
            { text: '创业尝试', effects: { attributes: { creativity: 4, charisma: 3 }, gold: -10, personality: { ie: 0.04, sn: 0.04, tf: 0, jp: -0.02 } } },
            { text: '继续学习准备', effects: { attributes: { intelligence: 3 }, gold: -3, personality: { ie: 0, sn: 0.02, tf: 0, jp: 0.04 } } },
          ],
        },
      ],
    };

    // 通用成年事件
    const adultEvents = [
      {
        description: `${age}岁时，你在${country}面临一个重要的机遇。`,
        options: [
          { text: '积极把握机会', effects: { attributes: { wealth: 5, charisma: 3 }, gold: 10, personality: { ie: 0.02, sn: 0.02, tf: 0, jp: 0.01 } } },
          { text: '谨慎考虑后决定', effects: { attributes: { intelligence: 3, emotion: -2 }, gold: 0, personality: { ie: 0, sn: 0.01, tf: 0, jp: 0.03 } } },
          { text: '放弃这次机会', effects: { attributes: { emotion: -3 }, gold: 0, personality: { ie: -0.02, sn: 0, tf: 0, jp: 0.02 } } },
          { text: '寻求他人建议', effects: { attributes: { charisma: 2, intelligence: 1 }, gold: 0, personality: { ie: 0.01, sn: 0, tf: 0.02, jp: 0 } } },
        ],
      },
      {
        description: `${age}岁时，你在${country}遇到了生活中的挑战。`,
        options: [
          { text: '迎难而上', effects: { attributes: { health: -3, emotion: 2, intelligence: 3 }, gold: 0, personality: { ie: 0.03, sn: 0, tf: 0, jp: -0.02 } } },
          { text: '寻求帮助', effects: { attributes: { charisma: 2 }, gold: -2, personality: { ie: 0.02, sn: 0, tf: 0.03, jp: 0 } } },
          { text: '暂时避开', effects: { attributes: { emotion: -1 }, gold: 0, personality: { ie: -0.02, sn: 0, tf: 0, jp: 0.03 } } },
          { text: '创造解决方案', effects: { attributes: { creativity: 4, intelligence: 2 }, gold: 5, personality: { ie: 0.01, sn: 0.04, tf: 0, jp: -0.01 } } },
        ],
      },
    ];

    return templates[age as keyof typeof templates] || adultEvents;
  }
}

// 导出单例实例
let fakeLLMService: FakeLLMService | null = null;

export function getFakeLLMService(modelId: string = 'fake-rapid'): FakeLLMService {
  if (!fakeLLMService || fakeLLMService['modelId'] !== modelId) {
    fakeLLMService = new FakeLLMService(modelId);
  }
  return fakeLLMService;
}