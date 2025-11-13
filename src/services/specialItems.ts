import type { Item } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';
import { GAME_CONFIG } from '../config/gameConfig';
import { getCurrentModel } from './llm';

const DOUBAO_API_KEY = '45615aa9-d3cb-46d8-8222-42dedf186dca';
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 获取当前模型ID
function getCurrentModelId(): string {
  const modelId = getCurrentModel();
  return modelId.startsWith('fake-') ? GAME_CONFIG.LLM.MODEL : modelId;
}

// 为每个国家生成专属稀有道具
export async function generateCountrySpecialItem(country: string): Promise<Item> {
  const currentModelId = getCurrentModelId();
  
  // 如果是fake模型，直接返回后备道具，避免API调用
  if (currentModelId.startsWith('fake-')) {
    return generateFallbackSpecialItem(country);
  }
  const systemPrompt = `你是一个游戏道具设计师。根据国家的文化特色、历史背景和代表性元素，设计一个独特的稀有道具。

道具设计要求：
1. 道具名称要体现国家特色，富有文化内涵
2. 道具描述要简洁生动，体现其独特性和稀有性
3. 道具图标使用一个合适的emoji（与国家文化相关）
4. 道具效果要平衡且有特色：
   - 属性加成范围：单个属性15-30，或多个属性总和30-50
   - 可以包含寿命加成（5-15年）
   - 效果要符合国家特色
5. 价格范围：150-400金币（稀有道具）
6. 类型：consumable（消耗品）

请严格按照以下JSON格式返回（不要包含任何其他文本）：
{
  "name": "道具名称",
  "description": "道具描述（30-50字）",
  "icon": "emoji图标",
  "price": 250,
  "health": 0,
  "intelligence": 0,
  "emotion": 0,
  "wealth": 0,
  "charisma": 0,
  "creativity": 0,
  "lifespan": 0
}`;

  const userPrompt = `为${getCountryNameCN(country)}设计一个独特的专属稀有道具。

要求：
- 名称和描述要体现${getCountryNameCN(country)}的文化特色
- 图标使用合适的emoji
- 效果要平衡且独特
- 价格150-400金币

请生成这个道具的完整信息。`;

  try {
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: currentModelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        max_tokens: 500,
        temperature: 0.9,
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
    
    // 清理JSON字符串
    let jsonString = jsonMatch[0];
    jsonString = jsonString.replace(/:\s*\+(\d+)/g, ': $1');
    
    const itemData = JSON.parse(jsonString);
    
    // 转换为Item格式
    return {
      id: `special_${country.toLowerCase().replace(/\s+/g, '_')}`,
      name: itemData.name,
      description: itemData.description,
      price: itemData.price || 250,
      icon: itemData.icon || '🌟',
      effects: {
        attributes: {
          health: itemData.health || 0,
          intelligence: itemData.intelligence || 0,
          emotion: itemData.emotion || 0,
          wealth: itemData.wealth || 0,
          charisma: itemData.charisma || 0,
          creativity: itemData.creativity || 0,
        },
        lifespan: itemData.lifespan || 0,
      },
      type: 'consumable',
    };
  } catch (error) {
    console.error('生成专属道具失败:', error);
    
    // 返回一个默认专属道具
    return generateFallbackSpecialItem(getCountryNameCN(country));
  }
}

// 后备专属道具生成器
function generateFallbackSpecialItem(country: string): Item {
  return {
    id: `special_${country.toLowerCase().replace(/\s+/g, '_')}`,
    name: `${country}的祝福`,
    description: `来自${country}的神秘力量，全属性+10`,
    price: 250,
    icon: '🌟',
    effects: {
      attributes: {
        health: 10,
        intelligence: 10,
        emotion: 10,
        wealth: 10,
        charisma: 10,
        creativity: 10,
      },
    },
    type: 'consumable',
  };
}

// 缓存专属道具（避免重复生成）
const specialItemsCache: Record<string, Item> = {};

export async function getCountrySpecialItem(country: string): Promise<Item> {
  if (specialItemsCache[country]) {
    return specialItemsCache[country];
  }
  
  const item = await generateCountrySpecialItem(country);
  specialItemsCache[country] = item;
  return item;
}
