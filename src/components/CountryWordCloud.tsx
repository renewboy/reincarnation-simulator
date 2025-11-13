import { useState } from 'react';
import type { GameConfig } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';

interface CountryWordCloudProps {
  config: GameConfig;
}

export default function CountryWordCloud({ config }: CountryWordCloudProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // 获取所有国家并按投胎率排序
  const countries = Object.entries(config.countries)
    .map(([name, data]) => ({
      name,
      probability: data.probability_percentage,
      rank: data.rank,
    }))
    .sort((a, b) => b.probability - a.probability);

  // 计算字体大小（根据投胎率）
  const getFontSize = (probability: number): number => {
    const maxProb = countries[0].probability;
    const minProb = countries[countries.length - 1].probability;
    const range = maxProb - minProb;
    
    // 字体大小范围：12px - 36px
    const minSize = 12;
    const maxSize = 36;
    
    const normalized = (probability - minProb) / range;
    return Math.round(minSize + normalized * (maxSize - minSize));
  };

  // 获取颜色（根据排名）
  const getColor = (rank: number): string => {
    const colors = [
      'text-red-400',
      'text-green-400',
      'text-blue-400',
      'text-purple-400',
      'text-yellow-400',
      'text-pink-400',
      'text-cyan-400',
      'text-indigo-400',
      'text-orange-400',
      'text-teal-400',
    ];
    return colors[rank % colors.length] || 'text-gray-400';
  };

  return (
    <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          全球投胎概率分布
        </h2>
        <p className="text-gray-400 text-sm">
          数据来源：2024年全球各国新生儿出生人数 | 总计：93,370,000 名新生儿
        </p>
        <p className="text-gray-400 text-sm mt-1">
          字体大小表示投胎率高低，悬停查看具体数值
        </p>
      </div>

      {/* 云词图容器 */}
      <div className="relative min-h-[400px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3 p-4">
        {countries.map(({ name, probability, rank }) => {
          const fontSize = getFontSize(probability);
          const isHovered = hoveredCountry === name;

          return (
            <div
              key={name}
              className="relative inline-block"
              onMouseEnter={() => setHoveredCountry(name)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <span
                className={`
                  ${getColor(rank)}
                  font-bold
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:scale-110
                  ${isHovered ? 'opacity-100 text-white' : 'opacity-80'}
                `}
                style={{ fontSize: `${fontSize}px` }}
              >
                {getCountryNameCN(name)}
              </span>

              {/* 悬停提示 */}
              {isHovered && (
                <div className="absolute z-50 left-1/2 -translate-x-1/2 -top-12 px-3 py-2 bg-black/90 border border-white/20 rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
                  <div className="text-white text-sm font-medium">
                    {probability.toFixed(3)}%
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 图例说明 */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-400">大</span>
            <span>高投胎率</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">小</span>
            <span>低投胎率</span>
          </div>
        </div>
      </div>
    </div>
  );
}
