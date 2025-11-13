import { useState, useMemo, useEffect } from 'react';
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
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  // 动画循环
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.02);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

  // 生成星空中的星星位置
  const stars = useMemo((): Star[] => {
    const starCount = 80;
    const width = 800;
    const height = 500;
    
    // 计算星星属性
    const getStarProperties = (probability: number) => {
      const maxProb = countries[0].probability;
      const minProb = countries[countries.length - 1].probability;
      const range = maxProb - minProb;
      
      // 星星半径：3-12像素
      const minRadius = 3;
      const maxRadius = 12;
      const normalized = (probability - minProb) / range;
      const radius = minRadius + normalized * (maxRadius - minRadius);
      
      // 亮度：0.3-1.0
      const brightness = 0.3 + normalized * 0.7;
      
      // 闪烁速度
      const twinkleSpeed = 0.5 + Math.random() * 1.5;
      
      return { radius, brightness, twinkleSpeed };
    };

    const generatedStars: Star[] = [];
    
    // 创建背景星尘
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      
      generatedStars.push({
        text: '', // 背景星尘没有文字
        x,
        y,
        radius: size,
        brightness: Math.random() * 0.5 + 0.1,
        color: `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 40 + 60}%)`,
        probability: 0,
        name: '',
        twinkleSpeed: Math.random() * 2 + 0.5,
      });
    }

    // 添加国家星星
    countries.slice(0, 50).forEach((country, index) => {
      const angle = (index / 50) * Math.PI * 2;
      const distance = 120 + Math.random() * 200;
      const centerX = width / 2;
      const centerY = height / 2;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const properties = getStarProperties(country.probability);
      
      // 星空主题配色
      const starColors = [
        '#fbbf24', // 金黄色 - 最亮的星
        '#f59e0b', // 琥珀色
        '#eab308', // 深黄色
        '#84cc16', // lime绿
        '#22d3ee', // 青色
        '#3b82f6', // 蓝色
        '#8b5cf6', // 紫色
        '#ec4899', // 粉红色
      ];
      
      const color = starColors[country.rank % starColors.length];
      
      generatedStars.push({
        text: getCountryNameCN(country.name),
        x,
        y,
        radius: properties.radius,
        brightness: properties.brightness,
        color,
        probability: country.probability,
        name: country.name,
        twinkleSpeed: properties.twinkleSpeed,
      });
    });

    return generatedStars;
  }, [countries]);

  return (
    <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          全球投胎概率分布
        </h2>
        <p className="text-gray-400 text-sm">
          数据来源：2024年全球各国新生儿出生人数 | 总计：93,370,000 名新生儿
        </p>
        <p className="text-gray-400 text-sm mt-1">
          星星大小和亮度表示投胎率高低，闪烁的星空展现宇宙般的分布
        </p>
      </div>

      {/* 星空容器 */}
      <div className="relative flex justify-center">
        <div className="relative">
          {/* 背景渐变 */}
          <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-purple-900/10 to-transparent rounded-xl" />
          
          <svg 
            width="800" 
            height="500" 
            viewBox="0 0 800 500" 
            className="relative z-10"
          >
            {/* 星座连线（仅对前10个国家） */}
            {countries.slice(0, 10).map((country, index) => {
              if (index === 9) return null; // 不连接最后一个
              const currentStar = stars.find(s => s.name === country.name);
              const nextStar = stars.find(s => s.name === countries[index + 1].name);
              
              if (!currentStar || !nextStar) return null;
              
              return (
                <line
                  key={`line-${index}`}
                  x1={currentStar.x}
                  y1={currentStar.y}
                  x2={nextStar.x}
                  y2={nextStar.y}
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              );
            })}
            
            {/* 星星和星尘 */}
            {stars.map((star, index) => {
              const isHovered = hoveredStar === star.name;
              const twinkle = Math.sin(animationTime * star.twinkleSpeed + index) * 0.3 + 0.7;
              const currentBrightness = star.brightness * twinkle;
              
              if (star.text === '') {
                // 背景星尘
                return (
                  <circle
                    key={`dust-${index}`}
                    cx={star.x}
                    cy={star.y}
                    r={star.radius}
                    fill={star.color}
                    opacity={currentBrightness * 0.6}
                    className="transition-opacity duration-1000"
                  />
                );
              }
              
              // 国家星星
              return (
                <g key={`star-${index}`} className="cursor-pointer">
                  {/* 发光效果 */}
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.radius * 3}
                    fill={star.color}
                    opacity={currentBrightness * 0.2}
                    className="blur-sm"
                  />
                  
                  {/* 主星星 */}
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.radius}
                    fill={star.color}
                    opacity={currentBrightness}
                    className={`transition-all duration-300 ${
                      isHovered ? 'drop-shadow-2xl brightness-150 scale-125' : 'drop-shadow-lg'
                    }`}
                    onMouseEnter={() => setHoveredStar(star.name)}
                    onMouseLeave={() => setHoveredStar(null)}
                  />
                  
                  {/* 十字光芒 */}
                  <g opacity={currentBrightness * 0.8}>
                    <line x1={star.x - star.radius * 2} y1={star.y} x2={star.x + star.radius * 2} y2={star.y} stroke={star.color} strokeWidth="0.5" />
                    <line x1={star.x} y1={star.y - star.radius * 2} x2={star.x} y2={star.y + star.radius * 2} stroke={star.color} strokeWidth="0.5" />
                  </g>
                  
                  {/* 国家名称（仅在大星星上显示） */}
                  {star.radius > 8 && (
                    <text
                      x={star.x}
                      y={star.y + star.radius + 15}
                      fontSize={Math.max(10, star.radius - 2)}
                      fill="#ffffff"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none drop-shadow-md"
                      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
                    >
                      {star.text}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* 粒子效果装饰 */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute top-32 right-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* 悬停提示 */}
        {hoveredStar && (
          <div className="absolute z-50 top-4 right-4 px-4 py-3 bg-black/90 border border-yellow-500/30 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="text-yellow-400 text-sm font-bold">
              {hoveredStar}
            </div>
            <div className="text-white text-xs mt-1">
              投胎概率：{countries.find(c => getCountryNameCN(c.name) === hoveredStar)?.probability.toFixed(3)}%
            </div>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse shadow-lg"></div>
            <span>巨星（最高投胎率）</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-md"></div>
            <span>亮星（中等投胎率）</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
            <span>暗星（低投胎率）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
