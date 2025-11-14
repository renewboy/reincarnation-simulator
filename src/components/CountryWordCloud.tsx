import { useState, useEffect } from 'react';
import type { GameConfig } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';

interface CountryWordCloudProps {
  config: GameConfig;
}

interface Star {
  text: string;
  x: number;
  y: number;
  radius: number;
  brightness: number;
  color: string;
  probability: number;
  name: string;
  twinkleSpeed: number;
}

export default function CountryWordCloud({ config }: CountryWordCloudProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [starField, setStarField] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
  const [countries, setCountries] = useState<Array<{ name: string; probability: number; rank: number }>>([]);

  // 生成星空粒子效果
  useEffect(() => {
    const generateStarField = () => {
      const stars = Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      setStarField(stars);
    };

    generateStarField();
    const interval = setInterval(generateStarField, 5000); // 每5秒重新生成一次星星

    return () => clearInterval(interval);
  }, []);

  // 初始化国家数据（只执行一次）
  useEffect(() => {
    const countriesData = Object.entries(config.countries)
      .map(([name, data]) => ({
        name,
        probability: data.probability_percentage,
        rank: data.rank,
      }))
      .sort(() => Math.random() - 0.5); // 只在初始化时随机排序一次

    setCountries(countriesData);
  }, [config]);

  // 如果数据还没加载，不渲染任何内容
  if (countries.length === 0) {
    return null;
  }

  // 计算概率范围（用于字体大小计算）
  const allProbabilities = countries.map(country => country.probability);
  const maxProb = Math.max(...allProbabilities);
  const minProb = Math.min(...allProbabilities);
  const range = maxProb - minProb;

  // 计算字体大小（根据投胎概率）
  const getFontSize = (probability: number): number => {
    // 字体大小范围：0.8rem - 2.2rem
    const minSize = 0.8;
    const maxSize = 2.2;
    
    const normalized = (probability - minProb) / range;
    return Math.round((minSize + normalized * (maxSize - minSize)) * 10) / 10;
  };

  // 获取颜色（根据排名）
  const getColor = (rank: number): string => {
    const colors = [
      'text-[#ff6b6b] hover:text-[#ff8a80]', // 超新星红
      'text-[#4ecdc4] hover:text-[#7fdbda]', // 星际青
      'text-[#45b7d1] hover:text-[#87ceeb]', // 星云蓝
      'text-[#f9ca24] hover:text-[#f0932b]', // 恒星金
      'text-[#6c5ce7] hover:text-[#a29bfe]', // 星云紫
      'text-[#fd79a8] hover:text-[#fdcb6e]', // 星系粉
      'text-[#00b894] hover:text-[#55efc4]', // 生命绿
      'text-[#e17055] hover:text-[#fab1a0]', // 宇宙橙
      'text-[#74b9ff] hover:text-[#a29bfe]', // 深空蓝
      'text-[#fd79a8] hover:text-[#e84393]', // 星云粉
    ];
    return colors[rank % colors.length] || 'text-[#b2bec3] hover:text-[#74b9ff]';
  };

  // 获取光晕效果
  const getGlowEffect = (rank: number): string => {
    const glowEffects = [
      'shadow-[0_0_20px_rgba(255,107,107,0.4)]',
      'shadow-[0_0_20px_rgba(78,205,196,0.4)]',
      'shadow-[0_0_20px_rgba(69,183,209,0.4)]',
      'shadow-[0_0_20px_rgba(249,202,36,0.4)]',
      'shadow-[0_0_20px_rgba(108,92,231,0.4)]',
      'shadow-[0_0_20px_rgba(253,121,168,0.4)]',
      'shadow-[0_0_20px_rgba(0,184,148,0.4)]',
      'shadow-[0_0_20px_rgba(225,112,85,0.4)]',
      'shadow-[0_0_20px_rgba(116,185,255,0.4)]',
      'shadow-[0_0_20px_rgba(253,121,168,0.4)]',
    ];
    return glowEffects[rank % glowEffects.length];
  };

  return (
    <div className="relative min-h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30">
      {/* 宇宙背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-cyan-900/20" />
      
      {/* 星云效果 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-32 w-80 h-80 bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* 动态星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {starField.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 主容器 */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 tracking-wide">
            ✨ 全球投胎概率分布 ✨
          </h2>
          <div className="space-y-2 text-sm">
            <p className="text-cyan-300/80 font-medium tracking-wider">
              🌌 数据来源：2024年全球各国新生儿出生人数 | 总计：93,370,000 名新生儿
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-4">
            </div>
          </div>
        </div>

        {/* 词云图容器 */}
        <div className="flex-1 relative flex flex-wrap items-center justify-center gap-x-6 gap-y-4 p-6 min-h-[400px]">
          {countries.map(({ name, probability, rank }, index) => {
            const fontSize = getFontSize(probability);
            const isHovered = hoveredCountry === name;
            const color = getColor(index); // 使用随机排列中的索引，而不是原始rank
            const glowEffect = getGlowEffect(index); // 使用随机排列中的索引，而不是原始rank

            return (
              <div
                key={name}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  isHovered ? 'z-20' : 'z-10'
                }`}
                onMouseEnter={() => setHoveredCountry(name)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                
                <span
                  className={`
                    relative inline-block
                    font-bold
                    tracking-wide
                    transition-all duration-500
                    transform hover:scale-125 hover:rotate-12
                    ${color}
                    ${isHovered ? `opacity-100 ${glowEffect}` : 'opacity-90'}
                    ${isHovered ? 'drop-shadow-[0_0_10px_currentColor]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'}
                  `}
                  style={{ 
                    fontSize: `${fontSize}rem`,
                    textShadow: isHovered ? '0 0 20px currentColor' : 'none',
                    filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                  }}
                >
                  {getCountryNameCN(name)}
                </span>

                {/* 国家信息悬浮窗 */}
                {isHovered && (
                  <div className="absolute z-50 left-1/2 -translate-x-1/2 -bottom-20 px-4 py-3 bg-slate-900/70 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl whitespace-nowrap animate-fade-in-up">
                    <div className="text-center space-y-1">
                      <div className="text-white font-bold text-sm tracking-wider">
                        {getCountryNameCN(name)}
                      </div>
                      <div className="text-cyan-400 font-mono text-xs">
                        投胎率: {probability.toFixed(3)}%
                      </div>
                      <div className="text-purple-400 text-xs">
                        排名: {rank}
                      </div>
                    </div>
                    {/* 向上箭头指示器 */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-slate-900/70" />
                  </div>
                )}

                {/* 光环效果 */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-current to-transparent opacity-20 blur-sm animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* 漂浮光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-float delay-0" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-float delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-float delay-3000" />
      </div>
      
      {/* 沉浸式游戏文案区域 */}
      <div className="relative mt-8 px-6 py-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-cyan-900/10 to-pink-900/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <span className="text-2xl animate-pulse">🌌</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
            每一次投胎都是宇宙中的一次神秘重生，你的灵魂即将踏上全新的旅程
          </h3>
          <p className="text-sm text-gray-300/90 leading-relaxed max-w-2xl mx-auto italic font-light tracking-wide">
            选择一个国家，让命运为你编织属于这个时代的传奇故事...
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
