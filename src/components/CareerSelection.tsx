import { useState } from 'react';
import { Briefcase, TrendingUp, Users, Heart, Code, Palette, Target, Award } from 'lucide-react';
import type { CharacterAttributes, MBTIPersonality } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';

interface CareerSelectionProps {
  currentCountry: string;
  attributes: CharacterAttributes;
  personality: MBTIPersonality;
  education: string;  // 专业信息
  careerOptions: string[];
  onSelectCareer: (career: string) => void;
  onBack?: () => void; // 可选的后退按钮
}

// 根据职业类型返回相应的图标
function getCareerIcon(career: string) {
  const lowerCareer = career.toLowerCase();
  
  if (lowerCareer.includes('工程师') || lowerCareer.includes('技术') || lowerCareer.includes('程序员') || lowerCareer.includes('开发者')) {
    return <Code className="w-6 h-6" />;
  }
  if (lowerCareer.includes('医生') || lowerCareer.includes('护士') || lowerCareer.includes('医疗') || lowerCareer.includes('健康')) {
    return <Heart className="w-6 h-6" />;
  }
  if (lowerCareer.includes('教师') || lowerCareer.includes('教授') || lowerCareer.includes('研究员') || lowerCareer.includes('学者')) {
    return <Users className="w-6 h-6" />;
  }
  if (lowerCareer.includes('管理') || lowerCareer.includes('经理') || lowerCareer.includes('CEO') || lowerCareer.includes('总监')) {
    return <Target className="w-6 h-6" />;
  }
  if (lowerCareer.includes('艺术') || lowerCareer.includes('设计') || lowerCareer.includes('创意') || lowerCareer.includes('广告')) {
    return <Palette className="w-6 h-6" />;
  }
  if (lowerCareer.includes('销售') || lowerCareer.includes('营销') || lowerCareer.includes('市场') || lowerCareer.includes('商务')) {
    return <TrendingUp className="w-6 h-6" />;
  }
  
  return <Briefcase className="w-6 h-6" />;
}

// 获取职业类型描述
function getCareerType(career: string): string {
  const lowerCareer = career.toLowerCase();
  
  if (lowerCareer.includes('工程师') || lowerCareer.includes('技术')) {
    return '技术类';
  }
  if (lowerCareer.includes('医生') || lowerCareer.includes('护士') || lowerCareer.includes('医疗')) {
    return '医疗健康类';
  }
  if (lowerCareer.includes('教师') || lowerCareer.includes('教授') || lowerCareer.includes('研究员')) {
    return '教育研究类';
  }
  if (lowerCareer.includes('管理') || lowerCareer.includes('经理') || lowerCareer.includes('CEO')) {
    return '管理类';
  }
  if (lowerCareer.includes('艺术') || lowerCareer.includes('设计') || lowerCareer.includes('创意')) {
    return '创意艺术类';
  }
  if (lowerCareer.includes('销售') || lowerCareer.includes('营销') || lowerCareer.includes('市场')) {
    return '商业销售类';
  }
  
  return '其他类';
}

// 获取MBTI类型描述
function getMBTIType(personality: MBTIPersonality): string {
  const ie = personality.ie > 0.5 ? 'E' : 'I';
  const sn = personality.sn > 0.5 ? 'N' : 'S';
  const tf = personality.tf > 0.5 ? 'F' : 'T';
  const jp = personality.jp > 0.5 ? 'P' : 'J';
  return `${ie}${sn}${tf}${jp}`;
}

export default function CareerSelection({
  currentCountry,
  attributes,
  personality,
  education,
  careerOptions,
  onBack,
  onSelectCareer,
}: CareerSelectionProps) {
  const [selectedCareer, setSelectedCareer] = useState<string>('');

  const handleSelectCareer = (career: string) => {
    setSelectedCareer(career);
    setTimeout(() => {
      onSelectCareer(career);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 标题区域 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                ← 返回
              </button>
            )}
            <div className="flex items-center gap-3 mx-auto">
              <Briefcase className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">职业选择</h2>
            </div>
            <div className="w-20"></div> {/* 占位符保持布局平衡 */}
          </div>
          <p className="text-gray-300 text-lg">
            恭喜你完成了所有学业！现在选择一个适合你的职业开始人生新篇章。
          </p>
        </div>

        {/* 角色信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">基本信息</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>国家：{getCountryNameCN(currentCountry)}</div>
              <div>年龄：28-30岁</div>
              <div>MBTI：{getMBTIType(personality)}</div>
            </div>
          </div>
          
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">教育背景</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>专业：{education}</div>
              <div>学历：博士学位</div>
            </div>
          </div>
          
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">核心能力</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>智力：{attributes.intelligence}</div>
              <div>创造力：{attributes.creativity}</div>
              <div>魅力：{attributes.charisma}</div>
            </div>
          </div>
          
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">性格特点</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>{personality.ie > 0.5 ? '外向型' : '内向型'}</div>
              <div>{personality.sn > 0.5 ? '直觉型' : '感觉型'}</div>
              <div>{personality.tf > 0.5 ? '情感型' : '思考型'}</div>
            </div>
          </div>
        </div>

        {/* 职业选择 */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4 text-xl flex items-center gap-2">
            <Target className="w-5 h-5" />
            请选择你的职业
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerOptions.map((career, index) => (
              <button
                key={index}
                onClick={() => handleSelectCareer(career)}
                className={`
                  text-left p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]
                  ${selectedCareer === career 
                    ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedCareer === career 
                      ? 'bg-blue-500/30 text-blue-300' 
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {getCareerIcon(career)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold text-lg">{career}</h4>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${selectedCareer === career 
                          ? 'bg-blue-500/30 text-blue-300' 
                          : 'bg-white/10 text-gray-400'
                        }
                      `}>
                        {getCareerType(career)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      基于你的教育背景、性格特点和能力模型，这个职业与你的匹配度很高。
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      <span>高度匹配你的个人特质</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            你的职业选择将影响你未来的人生轨迹和所有相关事件的发展方向。
          </p>
        </div>
      </div>
    </div>
  );
}
