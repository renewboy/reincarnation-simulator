// @ts-nocheck
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GameState, LifeEvent } from '../types/game';

interface DataVisualizationProps {
  gameState: GameState;
}

// 构建属性历史数据
function buildAttributeHistory(
  lifeHistory: LifeEvent[],
  initialAttributes: any,
  currentAttributes: any
) {
  const history: any[] = [];
  
  // 添加初始状态
  history.push({
    age: 0,
    健康: initialAttributes.health || 50,
    智力: initialAttributes.intelligence || 50,
    情绪: initialAttributes.emotion || 50,
    财富: initialAttributes.wealth || 50,
    魅力: initialAttributes.charisma || 50,
    创造力: initialAttributes.creativity || 50,
  });
  
  // 添加当前状态
  if (lifeHistory.length > 0) {
    history.push({
      age: lifeHistory.length,
      健康: currentAttributes.health,
      智力: currentAttributes.intelligence,
      情绪: currentAttributes.emotion,
      财富: currentAttributes.wealth,
      魅力: currentAttributes.charisma,
      创造力: currentAttributes.creativity,
    });
  }
  
  return history;
}

export default function DataVisualization({ gameState }: DataVisualizationProps) {
  // 准备属性演化数据
  const attributeData = buildAttributeHistory(
    gameState.lifeHistory,
    { 
      health: 50, 
      intelligence: 50, 
      emotion: 50, 
      wealth: 50, 
      charisma: 50, 
      creativity: 50 
    },
    gameState.attributes
  );

  // 当前属性数据
  const currentAttributes = [
    { name: '健康', value: gameState.attributes.health, color: '#ef4444' },
    { name: '智力', value: gameState.attributes.intelligence, color: '#3b82f6' },
    { name: '情绪', value: gameState.attributes.emotion, color: '#f59e0b' },
    { name: '财富', value: gameState.attributes.wealth, color: '#10b981' },
    { name: '魅力', value: gameState.attributes.charisma, color: '#a855f7' },
    { name: '创造力', value: gameState.attributes.creativity, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* 当前属性分布 */}
      <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">当前属性分布</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentAttributes.map((attr) => (
            <div key={attr.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{attr.name}</span>
                <span className="text-white font-semibold">{attr.value}</span>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full transition-all duration-500"
                  style={{
                    width: `${attr.value}%`,
                    backgroundColor: attr.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 属性演化曲线 */}
      {gameState.lifeHistory.length > 0 && attributeData.length > 1 && (
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">属性演化曲线</h3>
          <div className="text-gray-400 text-sm mb-4">
            从出生到{gameState.currentAge}岁的属性变化轨迹
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attributeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="age" 
                  stroke="#9ca3af"
                  label={{ value: '年龄', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  domain={[0, 100]}
                  label={{ value: '属性值', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 27, 75, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="健康" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="智力" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="情绪" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="财富" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="魅力" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="创造力" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 人生事件时间线 */}
      {gameState.lifeHistory.length > 0 && (
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">人生重要时刻</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {gameState.lifeHistory.slice(-10).reverse().map((event, index) => (
              <div key={index} className="flex gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-purple-400 font-bold">{event.age}岁</div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          {gameState.lifeHistory.length > 10 && (
            <div className="text-center text-gray-500 text-sm mt-3">
              显示最近10个事件，共{gameState.lifeHistory.length}个
            </div>
          )}
        </div>
      )}
    </div>
  );
}
