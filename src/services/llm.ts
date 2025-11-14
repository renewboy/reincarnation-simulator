import type { CharacterAttributes, MBTIPersonality, LifeEvent } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { getFakeLLMService } from './fakeLLM';

const DOUBAO_API_KEY = '45615aa9-d3cb-46d8-8222-42dedf186dca';
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 当前使用的模型
let currentModel: string = GAME_CONFIG.LLM.MODEL;

// 设置当前模型
export function setCurrentModel(model: string) {
  currentModel = model;
}

// 获取当前模型
export function getCurrentModel(): string {
  return currentModel;
}

// 判断是否为fake模型
function isFakeModel(): boolean {
  return currentModel.startsWith('fake-');
}

// 生成MBTI描述
function getMBTIDescription(personality: MBTIPersonality): string {
  const ie = personality.ie > 0.5 ? '外向' : '内向';
  const sn = personality.sn > 0.5 ? '直觉' : '感觉';
  const tf = personality.tf > 0.5 ? '情感' : '思考';
  const jp = personality.jp > 0.5 ? '感知' : '判断';
  return `${ie}、${sn}、${tf}、${jp}`;
}

// 获取MBTI类型
function getMBTIType(personality: MBTIPersonality): string {
  const ie = personality.ie > 0.5 ? 'E' : 'I';
  const sn = personality.sn > 0.5 ? 'N' : 'S';
  const tf = personality.tf > 0.5 ? 'F' : 'T';
  const jp = personality.jp > 0.5 ? 'P' : 'J';
  return `${ie}${sn}${tf}${jp}`;
}

// 生成属性描述
function getAttributesDescription(attributes: CharacterAttributes): string {
  const descriptions: string[] = [];
  
  if (attributes.health > 70) descriptions.push('身体健康');
  else if (attributes.health < 30) descriptions.push('体弱多病');
  
  if (attributes.intelligence > 70) descriptions.push('智力超群');
  else if (attributes.intelligence < 30) descriptions.push('学习困难');
  
  if (attributes.wealth > 70) descriptions.push('家境富裕');
  else if (attributes.wealth < 30) descriptions.push('家境贫寒');
  
  if (attributes.charisma > 70) descriptions.push('魅力非凡');
  if (attributes.creativity > 70) descriptions.push('极具创造力');
  
  return descriptions.join('、');
}

// 生成人生事件
export async function generateLifeEvent(
  age: number,
  country: string,
  attributes: CharacterAttributes,
  personality: MBTIPersonality,
  previousEvents: string[]
): Promise<LifeEvent> {
  // 如果是fake模型，使用fake服务
  if (isFakeModel()) {
    const fakeService = getFakeLLMService(currentModel);
    return await fakeService.generateLifeEvent(age, country, attributes, personality, previousEvents);
  }

  const systemPrompt = `你是一个人生模拟游戏的事件生成器。根据角色的年龄、国家、属性和性格，生成一个真实且多样化的人生事件。

事件类型要求（随机选择一种）：
1. 正面事件（30%概率）：机遇、成功、健康改善、财富增长、爱情、友谊、荣誉等
2. 挑战事件（25%概率）：困难、竞争、压力、考验、艰难抉择等
3. 意外事件（20%概率）：偶然相遇、巧合、突发事件、意外收获或损失等
4. 困难事件（15%概率）：挫折、失败、疾病、经济困难、人际冲突等
5. 特殊事件（10%概率）：天灾、疫情、战争、社会变迁、历史性事件等

事件设计原则：
1. 符合该年龄段的真实经历（婴儿期、幼儿期、少年、青年、中年、老年各有特点）
2. 深度结合国家的文化背景、经济状况、社会特点和历史背景
3. 事件类型多样化：
   - 正面事件（机遇、成功、改善）：30%概率
   - 挑战事件（困难、竞争、压力）：25%概率
   - 意外事件（偶然、巧合、突发）：20%概率
   - 困难事件（挫折、失败、冲突）：15%概率
   - 特殊事件（天灾、疫情、社会变迁）：10%概率
4. 角色属性和性格特点可以为事件提供背景，但不应成为事件的强制约束条件
5. 所有事件类型对所有角色类型都可能发生，只是发生的概率和细节描述会有所不同

选项设计要求：
1. 提供4个不同的选择，具有2-3种不同的影响方向
2. 正负平衡：
   - 2个正面倾向选项（总体收益为正，但可能有小代价）
   - 1-2个负面倾向选项（有明显代价或风险）
   - 可以有1个中性/保守选项（影响较小）
3. 每个选项的影响范围控制：
   - 属性影响：可以影响1-3个属性（但要合理控制总数）
   - 属性变化范围：单个属性-25到+25
   - 金币变化范围：-50到+50（严格限制在此范围内）
   - 性格影响：每次可以影响0-2个MBTI维度，范围-0.15到+0.15
   - 避免同一个选项同时影响过多维度
4. 选择要有策略性：不同选择适合不同性格和目标的玩家
5. 避免过于极端的全能选项：不要出现"全属性+20，金币+50"这种选项

真实性要求：
1. 事件描述要生动、具体、有代入感（50-100字）
2. 选项文本要简洁明确，清晰表达行动内容
3. 数值变化要符合现实逻辑
4. 考虑年龄、国家、时代背景的合理性

JSON格式要求：
- 所有数值必须是纯数字（如10或-5），不要使用+10格式
- 只填写有变化的数值，为0的可以省略或填0

请严格按照以下JSON格式返回（不要包含任何其他文本）：
{
  "description": "事件描述（50-100字）",
  "options": [
    {
      "text": "选项1文本",
      "health": 0,
      "intelligence": 0,
      "emotion": 0,
      "wealth": 0,
      "charisma": 0,
      "creativity": 0,
      "gold": 0,
      "ie": 0,
      "sn": 0,
      "tf": 0,
      "jp": 0
    },
    {
      "text": "选项2文本",
      "health": 0,
      "intelligence": 0,
      "emotion": 0,
      "wealth": 0,
      "charisma": 0,
      "creativity": 0,
      "gold": 0,
      "ie": 0,
      "sn": 0,
      "tf": 0,
      "jp": 0
    },
    {
      "text": "选项3文本",
      "health": 0,
      "intelligence": 0,
      "emotion": 0,
      "wealth": 0,
      "charisma": 0,
      "creativity": 0,
      "gold": 0,
      "ie": 0,
      "sn": 0,
      "tf": 0,
      "jp": 0
    },
    {
      "text": "选项4文本",
      "health": 0,
      "intelligence": 0,
      "emotion": 0,
      "wealth": 0,
      "charisma": 0,
      "creativity": 0,
      "gold": 0,
      "ie": 0,
      "sn": 0,
      "tf": 0,
      "jp": 0
    }
  ]
}`;

  const userPrompt = `生成一个${age}岁角色在${country}的真实人生事件。

角色完整信息：
- 年龄：${age}岁
- 国家：${country}
- 当前属性状况：
  * 健康：${attributes.health}/100 ${attributes.health > 70 ? '(优秀)' : attributes.health < 30 ? '(较差，容易生病)' : '(一般)'}
  * 智力：${attributes.intelligence}/100 ${attributes.intelligence > 70 ? '(聪慧，学习能力强)' : attributes.intelligence < 30 ? '(欠佳，学习困难)' : '(普通)'}
  * 情绪：${attributes.emotion}/100 ${attributes.emotion > 70 ? '(愉悦，心态积极)' : attributes.emotion < 30 ? '(低落，压力大)' : '(平稳)'}
  * 财富：${attributes.wealth}/100 ${attributes.wealth > 70 ? '(富裕，经济宽裕)' : attributes.wealth < 30 ? '(贫困，经济紧张)' : '(中等)'}
  * 魅力：${attributes.charisma}/100 ${attributes.charisma > 70 ? '(出众，受欢迎)' : attributes.charisma < 30 ? '(欠缺，社交困难)' : '(平常)'}
  * 创造力：${attributes.creativity}/100 ${attributes.creativity > 70 ? '(杰出，富有想象力)' : attributes.creativity < 30 ? '(有限，缺乏创新)' : '(普通)'}
- MBTI性格：${getMBTIDescription(personality)}

${previousEvents.length > 0 ? `最近经历：\n${previousEvents.slice(-3).join('\n')}` : '这是人生的开始，还没有经历其他事件'}

请基于以上信息生成一个真实的人生事件：
1. 事件类型从以下随机选择：正面事件（机遇/成功）、挑战事件（竞争/压力）、意外事件（突发）、困难事件（挫折）、特殊事件（天灾/社会变迁）
2. 事件要符合${age}岁年龄段和${country}国家特点
3. 考虑角色当前的优势和劣势属性
4. 4个选项要有不同的策略价值，至少包含2种影响方向（正/负/中性）
5. 每个选项只影响1-2个核心属性，避免全属性变化
6. 金币变化范围-50到+50，性格变化0-2个维度
7. 事件不得与先前事件雷同
生成一个生动具体的事件，让玩家有真实的代入感。`;

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        max_tokens: 800,
        temperature: 0.9,
        presence_penalty: 0.8,
        frequency_penalty: 0.8,
        thinking:{
          type:'disabled'
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // 尝试解析JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析LLM返回的JSON');
    }
    
    // 清理JSON字符串：移除数字前的+号（例如 "+10" -> "10"）
    let jsonString = jsonMatch[0];
    jsonString = jsonString.replace(/:\s*\+(\d+)/g, ': $1');
    
    const eventData = JSON.parse(jsonString);
    
    // 转换为LifeEvent格式
    return {
      age,
      description: eventData.description,
      options: eventData.options.map((opt: any) => ({
        text: opt.text,
        effects: {
          attributes: {
            health: opt.health || 0,
            intelligence: opt.intelligence || 0,
            emotion: opt.emotion || 0,
            wealth: opt.wealth || 0,
            charisma: opt.charisma || 0,
            creativity: opt.creativity || 0,
          },
          gold: opt.gold || 0,
          personality: {
            ie: opt.ie || 0,
            sn: opt.sn || 0,
            tf: opt.tf || 0,
            jp: opt.jp || 0,
          },
        },
      })),
    };
  } catch (error) {
    console.error('生成事件失败:', error);
    
    // 返回一个默认事件作为后备
    return generateFallbackEvent(age, country);
  }
}

// 后备事件生成器（当LLM调用失败时使用）
function generateFallbackEvent(age: number, country: string): LifeEvent {
  const events = [
    {
      description: `${age}岁时，你在${country}遇到了一个重要的人生选择。`,
      options: [
        { 
          text: '努力学习', 
          effects: { 
            attributes: { intelligence: 10, emotion: -5 },
            gold: 0,
            personality: { ie: -0.02, sn: 0.02, tf: -0.02, jp: 0.02 }
          } 
        },
        { 
          text: '锻炼身体', 
          effects: { 
            attributes: { health: 10, emotion: 5 },
            gold: 0,
            personality: { ie: 0, sn: 0, tf: 0, jp: 0.02 }
          } 
        },
        { 
          text: '结交朋友', 
          effects: { 
            attributes: { charisma: 10, emotion: 5 },
            gold: 0,
            personality: { ie: 0.05, sn: 0, tf: 0.03, jp: 0 }
          } 
        },
        { 
          text: '发展爱好', 
          effects: { 
            attributes: { creativity: 10, emotion: 5 },
            gold: 0,
            personality: { ie: 0, sn: 0.03, tf: 0, jp: -0.02 }
          } 
        },
      ],
    },
  ];
  
  return { age, ...events[0] };
}

// 生成专业选项
export async function generateMajorOptions(
  age: number,
  country: string,
  attributes: CharacterAttributes,
  personality: MBTIPersonality,
  education?: any
): Promise<string[]> {
  // 如果是fake模型，使用fake服务
  if (isFakeModel()) {
    const fakeService = getFakeLLMService(currentModel);
    return await fakeService.generateMajorOptions(age, country, attributes, personality);
  }

  const systemPrompt = `你是一个模拟人生游戏的专业选择顾问。根据角色的年龄、国家、属性和性格特点，为即将进入学业的角色推荐4个适合的专业。

选择原则：
1. 充分考虑角色的属性优势和性格特点
2. 结合国家的发展情况和教育体系
3. 确保专业的多样性和代表性
4. 专业名称要具体、明确

输出要求：
- 返回4个不同的专业名称，必须用中文
- 专业名称要符合大学的常见专业设置
- 考虑角色特点进行个性化推荐
- 仅输出JSON格式，不得包含其他文本
JSON格式：
{
  "majors": ["专业1", "专业2", "专业3", "专业4"]
}`;

  const userPrompt = `为${age}岁角色在${country}推荐4个适合的专业。

角色信息：
- 年龄：${age}岁
- 国家：${country}
- 教育阶段：${education.stage}
- 属性：健康${attributes.health}，智力${attributes.intelligence}，情绪${attributes.emotion}，财富${attributes.wealth}，魅力${attributes.charisma}，创造力${attributes.creativity}
- MBTI性格：${getMBTIType(personality)}

请基于以上信息推荐4个适合的专业，确保专业多样性与角色特点匹配。`;

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // 尝试解析JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析LLM返回的JSON');
    }
    
    const optionsData = JSON.parse(jsonMatch[0]);
    return optionsData.majors || generateDefaultMajors(attributes, personality);
  } catch (error) {
    // LLM调试日志：显示原始返回结果
    console.group('🔍 LLM调试信息 - 专业选择生成');
    console.log('❌ LLM请求失败:', error);
    console.log('📝 请求参数:', {
      age,
      country,
      attributes,
      personality: getMBTIType(personality),
      education: education.stage
    });
    if (error instanceof Error && error.message) {
      console.log('💬 错误信息:', error.message);
    }
    console.groupEnd();
    
    console.error('生成专业选项失败:', error);
    return generateDefaultMajors(attributes, personality);
  }
}

// 生成职业选项
export async function generateCareerOptions(
  country: string,
  major: string,  // 专业名称
  educationLevel: string,  // 教育阶段：bachelor, master, phd, completed
  attributes: CharacterAttributes,
  personality: MBTIPersonality
): Promise<string[]> {
  // 如果是fake模型，使用fake服务
  if (isFakeModel()) {
    const fakeService = getFakeLLMService(currentModel);
    return await fakeService.generateCareerOptions(country, major, educationLevel, attributes, personality);
  }

  const systemPrompt = `你是一个模拟人生游戏的职业规划顾问。根据角色的教育背景、国家、属性和性格特点，为即将就业的求职者推荐4个适合的职业。

选择原则：
1. 充分考虑角色的教育背景（专业）和就业匹配度
2. 考虑国家的经济发展和就业环境
3. 考虑角色的属性优势和性格特点
4. 职业选择要符合实际，具备现实性

输出要求：
- 返回4个不同的职业名称，必须用中文
- 职业名称要具体、明确，包含职位或岗位名称
- 考虑角色背景进行个性化推荐
- 仅输出JSON格式，不得包含其他文本

JSON格式：
{
  "careers": ["职业1", "职业2", "职业3", "职业4"]
}`;

  const userPrompt = `为${educationLevel}阶段的求职者在${country}推荐4个适合的职业。

角色信息：
- 教育阶段：${educationLevel}
- 专业：${major}
- 国家：${country}
- 属性：健康${attributes.health}，智力${attributes.intelligence}，情绪${attributes.emotion}，财富${attributes.wealth}，魅力${attributes.charisma}，创造力${attributes.creativity}
- MBTI性格：${getMBTIType(personality)}

请基于以上信息推荐4个适合的职业，确保职业多样性与角色背景匹配。`;

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        max_tokens: 500,
        temperature: 0.8,
        thinking: {
          type: 'disabled'
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // 尝试解析JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析LLM返回的JSON');
    }
    
    const optionsData = JSON.parse(jsonMatch[0]);
    return optionsData.careers || generateDefaultCareers(major, educationLevel, attributes, personality);
  } catch (error) {
    // LLM调试日志：显示原始返回结果
    console.group('🔍 LLM调试信息 - 职业选择生成');
    console.log('❌ LLM请求失败:', error);
    console.log('📝 请求参数:', {
      country,
      major,
      educationLevel,
      attributes,
      personality: getMBTIType(personality)
    });
    if (error instanceof Error && error.message) {
      console.log('💬 错误信息:', error.message);
    }
    console.groupEnd();
    
    console.error('生成职业选项失败:', error);
    return generateDefaultCareers(major, educationLevel, attributes, personality);
  }
}

// 默认专业选项生成器
function generateDefaultMajors(attributes: CharacterAttributes, personality: MBTIPersonality): string[] {
  const majors = [
    '计算机科学与技术',
    '软件工程', 
    '人工智能',
    '数据科学与大数据技术',
    '临床医学',
    '生物医学工程',
    '药学',
    '护理学',
    '金融学',
    '经济学',
    '工商管理',
    '市场营销',
    '国际经济与贸易',
    '会计学',
    '法学',
    '汉语言文学',
    '英语',
    '新闻学',
    '教育学',
    '心理学',
    '社会学',
    '机械工程',
    '电气工程',
    '建筑学',
    '土木工程',
    '化学工程与工艺',
    '材料科学与工程',
    '环境工程',
    '交通运输',
    '航空航天工程',
    '数学与应用数学',
    '物理学',
    '化学',
    '生物科学',
    '地质学',
    '考古学',
    '历史学',
    '哲学',
    '艺术设计',
    '音乐学',
    '美术学',
    '动画',
    '广播电视编导',
    '戏剧影视文学'
  ];
  
  // 根据角色特点筛选适合的专业
  const suitableMajors: string[] = [];
  
  // 智力高的角色倾向于STEM专业
  if (attributes.intelligence > 70) {
    suitableMajors.push('计算机科学与技术', '软件工程', '人工智能', '数据科学与大数据技术', '数学与应用数学', '物理学', '化学');
  }
  
  // 创造力高的角色倾向于艺术和创意专业
  if (attributes.creativity > 70) {
    suitableMajors.push('艺术设计', '音乐学', '美术学', '动画', '戏剧影视文学', '建筑学');
  }
  
  // 魅力高的角色倾向于商科和文科专业
  if (attributes.charisma > 70) {
    suitableMajors.push('市场营销', '新闻学', '教育学', '法学', '国际经济与贸易');
  }
  
  // 如果没有特别突出的属性，返回通用专业
  if (suitableMajors.length === 0) {
    suitableMajors.push('工商管理', '金融学', '会计学', '心理学', '汉语言文学');
  }
  
  // 从合适的专业中随机选择4个
  const shuffled = suitableMajors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

// 默认职业选项生成器
function generateDefaultCareers(major: string, educationLevel: string, attributes: CharacterAttributes, personality: MBTIPersonality): string[] {
  const careersByMajor: Record<string, string[]> = {
    '计算机': ['软件工程师', '数据科学家', '人工智能工程师', '产品经理'],
    '医学': ['医院主治医生', '医学研究员', '公共卫生专家', '医疗设备研发工程师'],
    '商科': ['企业管理者', '投资顾问', '市场营销总监', '金融分析师'],
    '工程': ['高级工程师', '项目经理', '技术总监', '研发工程师'],
    '理科': ['科研工作者', '大学教授', '技术顾问', '实验室主任'],
    '文科': ['企业管理者', '媒体编辑', '心理咨询师', '教育培训师'],
    '艺术': ['创意总监', '艺术设计师', '文化产品经理', '自由艺术家']
  };
  
  // 根据专业选择相应的职业选项
  const lowerMajor = major.toLowerCase();
  let category = '商科'; // 默认类别
  
  if (lowerMajor.includes('计算机') || lowerMajor.includes('软件') || lowerMajor.includes('信息') || lowerMajor.includes('数据') || lowerMajor.includes('ai') || lowerMajor.includes('人工智能')) {
    category = '计算机';
  } else if (lowerMajor.includes('医学') || lowerMajor.includes('健康') || lowerMajor.includes('护理') || lowerMajor.includes('药学')) {
    category = '医学';
  } else if (lowerMajor.includes('艺术') || lowerMajor.includes('设计') || lowerMajor.includes('音乐') || lowerMajor.includes('美术') || lowerMajor.includes('创意')) {
    category = '艺术';
  } else if (lowerMajor.includes('工程') || lowerMajor.includes('机械') || lowerMajor.includes('电气') || lowerMajor.includes('建筑') || lowerMajor.includes('土木')) {
    category = '工程';
  } else if (lowerMajor.includes('数学') || lowerMajor.includes('物理') || lowerMajor.includes('化学') || lowerMajor.includes('生物') || lowerMajor.includes('科学')) {
    category = '理科';
  } else if (lowerMajor.includes('教育') || lowerMajor.includes('社会') || lowerMajor.includes('心理') || lowerMajor.includes('人文') || lowerMajor.includes('语言') || lowerMajor.includes('文学') || lowerMajor.includes('历史') || lowerMajor.includes('哲学')) {
    category = '文科';
  }
  
  const baseCareers = careersByMajor[category] || careersByMajor['商科'];
  
  // 根据角色特点调整职业选项
  const adjustedCareers = [...baseCareers];
  
  // 如果智力很高，倾向于高技术含量的职业
  if (attributes.intelligence > 80) {
    adjustedCareers.push('首席技术官', '高级研究员');
  }
  
  // 如果魅力很高，倾向于管理和领导职位
  if (attributes.charisma > 80) {
    adjustedCareers.push('企业CEO', '事业部总经理');
  }
  
  // 如果创造力很高，倾向于创意和设计类职业
  if (attributes.creativity > 80) {
    adjustedCareers.push('创意总监', '设计总监');
  }
  
  // 随机选择4个职业
  const shuffled = adjustedCareers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}
