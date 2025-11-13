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
  rotation: number;
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

  // 生成DNA双螺旋形状中的文字位置
  const wordPositions = useMemo((): WordPosition[] => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const spiralRadius = 120;
    const spiralHeight = 400;
    const turns = 3;

    // 计算字体大小范围（根据投胎率）
    const getFontSize = (probability: number): number => {
      const maxProb = countries[0].probability;
      const minProb = countries[countries.length - 1].probability;
      const range = maxProb - minProb;
      
      const minSize = 14;
      const maxSize = 32;
      
      const normalized = (probability - minProb) / range;
      return minSize + normalized * (maxSize - minSize);
    };

    // 绿色系配色方案
    const getGreenColor = (rank: number, probability: number): string => {
      const colors = [
        '#065f46', // 深绿 - 最高概率
        '#047857', // 翡翠绿
        '#059669', // 祖母绿
        '#10b981', // 翠绿
        '#34d399', // 浅绿
        '#6ee7b7', // 薄荷绿
        '#a7f3d0', // 极浅绿
        '#d1fae5', // 淡绿
        '#ecfdf5', // 几乎白色
        '#f0fdf4'  // 纯白背景
      ];
      
      // 根据概率选择颜色，概率越高颜色越深
      const intensityIndex = Math.floor((probability / countries[0].probability) * colors.length);
      return colors[Math.min(intensityIndex, colors.length - 1)];
    };

    const positions: WordPosition[] = [];
    const topCountries = countries.slice(0, 50); // 只显示前50个国家，避免过于拥挤

    topCountries.forEach((country, index) => {
      // 计算在螺旋上的位置
      const t = (index / topCountries.length) * turns * Math.PI * 2;
      const y = centerY + (spiralHeight / 2) * Math.sin(t);
      
      // 双螺旋：左右两个螺旋
      const isLeftStrand = index % 2 === 0;
      const xOffset = isLeftStrand ? -spiralRadius : spiralRadius;
      const x = centerX + xOffset * Math.cos(t) + (Math.random() - 0.5) * 40; // 添加随机偏移避免重叠
      
      // 计算旋转角度（沿螺旋切线）
      const rotation = isLeftStrand ? t * 180 / Math.PI + 90 : t * 180 / Math.PI - 90;

      // 为大型文字添加额外的支撑位置
      const fontSize = getFontSize(country.probability);
      if (fontSize > 24) {
        // 为大字体在螺旋内部添加第二个位置
        const innerOffset = isLeftStrand ? -spiralRadius * 0.6 : spiralRadius * 0.6;
        const innerX = centerX + innerOffset * Math.cos(t) + (Math.random() - 0.5) * 20;
        
        positions.push({
          text: getCountryNameCN(country.name),
          x: innerX,
          y: y + (Math.random() - 0.5) * 30,
          fontSize: fontSize * 0.8, // 稍小一些
          color: getGreenColor(country.rank, country.probability),
          probability: country.probability,
          name: country.name,
          rotation: rotation + (isLeftStrand ? 45 : -45),
        });
      }

      positions.push({
        text: getCountryNameCN(country.name),
        x,
        y: y + (Math.random() - 0.5) * 20,
        fontSize,
        color: getGreenColor(country.rank, country.probability),
        probability: country.probability,
        name: country.name,
        rotation: rotation + (Math.random() - 0.5) * 30, // 添加一些随机旋转
      });
    });

    return positions;
  }, [countries]);

  // 生成DNA螺旋路径
  const dnaPaths = useMemo(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const spiralRadius = 120;
    const spiralHeight = 400;
    const turns = 3;
    const points = 100;

    let leftPath = '';
    let rightPath = '';

    for (let i = 0; i <= points; i++) {
      const t = (i / points) * turns * Math.PI * 2;
      const y = centerY + (spiralHeight / 2) * Math.sin(t);
      
      const leftX = centerX - spiralRadius * Math.cos(t);
      const rightX = centerX + spiralRadius * Math.cos(t);
      
      if (i === 0) {
        leftPath = `M ${leftX} ${y}`;
        rightPath = `M ${rightX} ${y}`;
      } else {
        leftPath += ` L ${leftX} ${y}`;
        rightPath += ` L ${rightX} ${y}`;
      }
    }

    // 生成连接线
    const connections = [];
    for (let i = 0; i <= points; i += 8) {
      const t = (i / points) * turns * Math.PI * 2;
      const y = centerY + (spiralHeight / 2) * Math.sin(t);
      const leftX = centerX - spiralRadius * Math.cos(t);
      const rightX = centerX + spiralRadius * Math.cos(t);
      
      connections.push(`M ${leftX} ${y} L ${rightX} ${y}`);
    }

    return { leftPath, rightPath, connections };
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
          字体大小表示投胎率高低，DNA双螺旋形状表示生命的循环
        </p>
      </div>

      {/* DNA词云图容器 */}
      <div className="relative flex justify-center">
        <svg 
          width="800" 
          height="500" 
          viewBox="0 0 800 500" 
          className="bg-gradient-to-b from-emerald-900/10 to-teal-900/10 rounded-xl border border-emerald-500/20"
        >
          {/* DNA螺旋骨架 */}
          <defs>
            <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#065f46" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#065f46" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6"/>
            </linearGradient>
          </defs>

          {/* 左侧螺旋 */}
          <path
            d={dnaPaths.leftPath}
            stroke="url(#spineGradient)"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-lg"
          />
          
          {/* 右侧螺旋 */}
          <path
            d={dnaPaths.rightPath}
            stroke="url(#spineGradient)"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-lg"
          />

          {/* 连接线 */}
          {dnaPaths.connections.map((connection, index) => (
            <path
              key={index}
              d={connection}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity="0.7"
              className="drop-shadow-sm"
            />
          ))}

          {/* 国家名称文字 */}
          {wordPositions.map(({ text, x, y, fontSize, color, probability, name, rotation }, index) => {
            const isHovered = hoveredCountry === name;

            return (
              <g key={index} className="cursor-pointer">
                <text
                  x={x}
                  y={y}
                  fontSize={fontSize}
                  fill={isHovered ? '#ffffff' : color}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${rotation} ${x} ${y})`}
                  className={`transition-all duration-300 ${
                    isHovered ? 'drop-shadow-xl brightness-125' : 'drop-shadow-md'
                  }`}
                  style={{
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.9)',
                  }}
                  onMouseEnter={() => setHoveredCountry(name)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {text}
                </text>
              </g>
            );
          })}

          {/* 发光效果 */}
          <circle
            cx="400"
            cy="250"
            r="200"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.5"
            opacity="0.3"
            className="blur-sm"
          />
        </svg>

        {/* 悬停提示 */}
        {hoveredCountry && (
          <div className="absolute z-50 top-4 right-4 px-4 py-3 bg-black/90 border border-emerald-500/30 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="text-emerald-400 text-sm font-bold">
              {hoveredCountry}
            </div>
            <div className="text-white text-xs mt-1">
              投胎概率：{countries.find(c => getCountryNameCN(c.name) === hoveredCountry)?.probability.toFixed(3)}%
            </div>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-4 border-t border-emerald-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400"></div>
            <span>高投胎率国家</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-300 to-lime-300"></div>
            <span>中等投胎率国家</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50"></div>
            <span>低投胎率国家</span>
          </div>
        </div>
      </div>
    </div>
  );
}
