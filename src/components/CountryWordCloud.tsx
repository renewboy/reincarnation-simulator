import { useState, useMemo } from 'react';
import type { GameConfig } from '../types/game';
import { getCountryNameCN } from '../utils/countryNames';

interface CountryWordCloudProps {
  config: GameConfig;
}

interface WordPosition {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  probability: number;
  name: string;
  angle: number;
}

export default function CountryWordCloud({ config }: CountryWordCloudProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // 获取所有国家并按投胎率排序
  const countries = useMemo(() => {
    return Object.entries(config.countries)
      .map(([name, data]) => ({
        name,
        probability: data.probability_percentage,
        rank: data.rank,
      }))
      .sort((a, b) => b.probability - a.probability);
  }, [config.countries]);

  // 生成星云能量球形状中的文字位置
  const wordPositions = useMemo((): WordPosition[] => {
    const centerX = 300;
    const centerY = 300;
    const mainRadius = 120; // 主星云半径
    const outerRadius = 160; // 外圈半径
    const innerRadius = 80; // 内圈半径

    // 计算字体大小范围（根据投胎率）
    const getFontSize = (probability: number): number => {
      const maxProb = countries[0].probability;
      const minProb = countries[countries.length - 1].probability;
      const range = maxProb - minProb;
      
      const minSize = 12;
      const maxSize = 28;
      
      const normalized = (probability - minProb) / range;
      return minSize + normalized * (maxSize - minSize);
    };

    // 游戏风格的紫粉渐变配色
    const getGameColor = (rank: number, probability: number): string => {
      const gradients = [
        { main: '#ec4899', secondary: '#f472b6' }, // 粉红 - 最高概率
        { main: '#a855f7', secondary: '#c084fc' }, // 紫色
        { main: '#8b5cf6', secondary: '#a78bfa' }, // 深紫
        { main: '#7c3aed', secondary: '#8b5cf6' }, // 靛紫
        { main: '#6366f1', secondary: '#818cf8' }, // 靛蓝
        { main: '#3b82f6', secondary: '#60a5fa' }, // 蓝色
        { main: '#06b6d4', secondary: '#22d3ee' }, // 青色
        { main: '#10b981', secondary: '#34d399' }, // 绿色
        { main: '#f59e0b', secondary: '#fbbf24' }, // 橙色
        { main: '#f97316', secondary: '#fb923c' }, // 深橙
      ];
      
      // 根据排名选择渐变
      const colorSet = gradients[rank % gradients.length];
      
      // 根据概率调整颜色透明度
      const opacity = 0.7 + (probability / countries[0].probability) * 0.3;
      
      // 返回渐变色
      return `url(#gradient-${rank % gradients.length})`;
    };

    const positions: WordPosition[] = [];
    const topCountries = countries.slice(0, 60); // 显示前60个国家

    topCountries.forEach((country, index) => {
      // 根据排名决定位置层级
      const tier = Math.floor(index / 12); // 12个国家为一级
      const positionInTier = index % 12;
      
      // 计算角度
      const angle = (positionInTier / 12) * 2 * Math.PI + (tier * Math.PI / 6);
      
      // 根据层级确定半径
      let radius;
      if (tier === 0) {
        // 核心区域 - 最重要的国家
        radius = innerRadius * (0.3 + Math.random() * 0.4);
      } else if (tier === 1) {
        // 中间区域
        radius = innerRadius + (mainRadius - innerRadius) * (0.3 + Math.random() * 0.4);
      } else {
        // 外围区域
        radius = mainRadius + (outerRadius - mainRadius) * (0.2 + Math.random() * 0.6);
      }

      // 添加一些随机性避免重叠
      const randomOffset = (Math.random() - 0.5) * 20;
      
      const x = centerX + Math.cos(angle) * (radius + randomOffset);
      const y = centerY + Math.sin(angle) * (radius + randomOffset);
      
      const fontSize = getFontSize(country.probability);

      positions.push({
        text: getCountryNameCN(country.name),
        x,
        y,
        fontSize,
        color: getGameColor(country.rank, country.probability),
        probability: country.probability,
        name: country.name,
        angle: angle * 180 / Math.PI,
      });
    });

    return positions;
  }, [countries]);

  // 生成渐变定义
  const gradients = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => (
      <defs key={i}>
        <radialGradient id={`gradient-${i}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={['#ec4899', '#a855f7', '#8b5cf6', '#7c3aed', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f97316'][i]} stopOpacity="0.9" />
          <stop offset="50%" stopColor={['#f472b6', '#c084fc', '#a78bfa', '#8b5cf6', '#818cf8', '#60a5fa', '#22d3ee', '#34d399', '#fbbf24', '#fb923c'][i]} stopOpacity="0.7" />
          <stop offset="100%" stopColor={['#f472b6', '#c084fc', '#a78bfa', '#8b5cf6', '#818cf8', '#60a5fa', '#22d3ee', '#34d399', '#fbbf24', '#fb923c'][i]} stopOpacity="0.3" />
        </radialGradient>
      </defs>
    ));
  }, []);

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
          字体大小表示投胎率高低，星云形状展现全球分布
        </p>
      </div>

      {/* 星云词云图容器 */}
      <div className="relative flex justify-center">
        <div className="relative">
          {/* 主星云容器 */}
          <svg 
            width="600" 
            height="600" 
            viewBox="0 0 600 600" 
            className="relative z-10"
          >
            {/* 渐变定义 */}
            {gradients}
            
            {/* 星云光晕背景 */}
            <circle
              cx="300"
              cy="300"
              r="150"
              fill="url(#gradient-0)"
              opacity="0.1"
              className="animate-pulse-glow blur-xl"
            />
            
            {/* 外层光晕 */}
            <circle
              cx="300"
              cy="300"
              r="180"
              fill="url(#gradient-2)"
              opacity="0.05"
              className="animate-pulse-glow blur-2xl"
              style={{ animationDelay: '1s' }}
            />
            
            {/* 国家名称文字 */}
            {wordPositions.map(({ text, x, y, fontSize, color, probability, name, angle }, index) => {
              const isHovered = hoveredCountry === name;
              
              return (
                <g key={index} className="cursor-pointer">
                  <text
                    x={x}
                    y={y}
                    fontSize={fontSize}
                    fill={isHovered ? '#ffffff' : color}
                    fontWeight={fontSize > 20 ? "bold" : "medium"}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`transition-all duration-300 ${
                      isHovered 
                        ? 'drop-shadow-2xl brightness-125 scale-110' 
                        : 'drop-shadow-lg hover:brightness-110'
                    }`}
                    style={{
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                      filter: isHovered 
                        ? 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' 
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                    }}
                    onMouseEnter={() => setHoveredCountry(name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    transform={`rotate(${angle * 0.5} ${x} ${y})`}
                  >
                    {text}
                  </text>
                </g>
              );
            })}
            
            {/* 核心发光点 */}
            <circle
              cx="300"
              cy="300"
              r="4"
              fill="#ec4899"
              className="animate-pulse"
            />
          </svg>
          
          {/* 浮动装饰元素 */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 animate-float" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* 悬停提示 */}
        {hoveredCountry && (
          <div className="absolute z-50 top-4 right-4 px-4 py-3 bg-black/90 border border-pink-500/30 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="text-pink-400 text-sm font-bold">
              {hoveredCountry}
            </div>
            <div className="text-white text-xs mt-1">
              投胎概率：{countries.find(c => getCountryNameCN(c.name) === hoveredCountry)?.probability.toFixed(3)}%
            </div>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-300 animate-pulse"></div>
            <span>核心国家（最高投胎率）</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-300"></div>
            <span>主要国家（中等投胎率）</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-300"></div>
            <span>其他地区（低投胎率）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
