import { useState } from 'react';
import { BookOpen, TrendingUp, Users, Palette, Code, Heart } from 'lucide-react';
import type { CharacterAttributes, MBTIPersonality } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';

interface MajorSelectionProps {
  currentCountry: string;
  currentAge: number;
  attributes: CharacterAttributes;
  personality: MBTIPersonality;
  majorOptions: string[];
  onSelectMajor: (major: string) => void;
  onBack?: () => void; // 可选的后退按钮
}

// 根据专业类型返回相应的图标
function getMajorIcon(major: string) {
  const lowerMajor = major.toLowerCase();
  
  if (lowerMajor.includes('计算机') || lowerMajor.includes('软件') || lowerMajor.includes('信息') || lowerMajor.includes('数据') || lowerMajor.includes('ai') || lowerMajor.includes('人工智能')) {
    return <Code className="w-6 h-6" />;
  }
  if (lowerMajor.includes('医学') || lowerMajor.includes('健康') || lowerMajor.includes('护理') || lowerMajor.includes('药学')) {
    return <Heart className="w-6 h-6" />;
  }
  if (lowerMajor.includes('艺术') || lowerMajor.includes('设计') || lowerMajor.includes('音乐') || lowerMajor.includes('美术') || lowerMajor.includes('创意')) {
    return <Palette className="w-6 h-6" />;
  }
  if (lowerMajor.includes('商业') || lowerMajor.includes('管理') || lowerMajor.includes('经济') || lowerMajor.includes('金融') || lowerMajor.includes('营销')) {
    return <TrendingUp className="w-6 h-6" />;
  }
  if (lowerMajor.includes('教育') || lowerMajor.includes('社会') || lowerMajor.includes('心理') || lowerMajor.includes('人文') || lowerMajor.includes('语言')) {
    return <Users className="w-6 h-6" />;
  }
  
  return <BookOpen className="w-6 h-6" />;
}

// 获取MBTI类型描述
function getMBTIType(personality: MBTIPersonality): string {
  const ie = personality.ie > 0.5 ? 'E' : 'I';
  const sn = personality.sn > 0.5 ? 'N' : 'S';
  const tf = personality.tf > 0.5 ? 'F' : 'T';
  const jp = personality.jp > 0.5 ? 'P' : 'J';
  return `${ie}${sn}${tf}${jp}`;
}

export default function MajorSelection({
  currentCountry,
  currentAge,
  attributes,
  personality,
  majorOptions,
  onSelectMajor,
  onBack,
}: MajorSelectionProps) {
  const [selectedMajor, setSelectedMajor] = useState<string>('');

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major);
    setTimeout(() => {
      onSelectMajor(major);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
              <BookOpen className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">专业选择</h2>
            </div>
            <div className="w-20"></div> {/* 占位符保持布局平衡 */}
          </div>
          <p className="text-gray-300 text-lg">
            请选择一个你感兴趣的专业开始学习！
          </p>
        </div>

        {/* 角色信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">基本信息</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>国家：{getCountryNameCN(currentCountry)}</div>
              <div>年龄：{currentAge}岁</div>
              <div>MBTI：{getMBTIType(personality)}</div>
            </div>
          </div>
          
          <div className="backdrop-blur-glass bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">主要属性</h3>
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

        {/* 专业选择 */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4 text-xl">请选择你的专业</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {majorOptions.map((major, index) => (
              <button
                key={index}
                onClick={() => handleSelectMajor(major)}
                className={`
                  text-left p-6 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]
                  ${selectedMajor === major 
                    ? 'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedMajor === major 
                      ? 'bg-purple-500/30 text-purple-300' 
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {getMajorIcon(major)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2">{major}</h4>
                    <p className="text-gray-400 text-sm">
                      这个专业与你的性格和能力匹配度较高，未来的发展道路很光明。
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            你的专业选择将影响整个大学期间的学习体验和未来的职业发展方向。
          </p>
        </div>
      </div>
    </div>
  );
}
