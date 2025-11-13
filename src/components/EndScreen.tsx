import type { GameState } from '../types/game';
import { Trophy, Heart, Brain, Smile, Wallet, Star, Sparkles, RotateCcw } from 'lucide-react';

interface EndScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function EndScreen({ gameState, onRestart }: EndScreenProps) {
  const totalScore = Object.values(gameState.attributes).reduce((sum, val) => sum + val, 0);
  const averageScore = Math.round(totalScore / 6);
  
  // 计算继承金币
  const hasReincarnationMedal = gameState.items.some(item => item.id === 'reincarnation_medal');
  const inheritanceRate = hasReincarnationMedal ? 0.75 : 0.5;
  const inheritedGold = Math.floor(gameState.gold * inheritanceRate);

  // 根据分数给予评价
  const getRating = (score: number) => {
    if (score >= 80) return { text: '传奇人生', color: 'text-yellow-400' };
    if (score >= 70) return { text: '精彩人生', color: 'text-purple-400' };
    if (score >= 60) return { text: '不错的人生', color: 'text-blue-400' };
    if (score >= 50) return { text: '平凡人生', color: 'text-green-400' };
    return { text: '艰难人生', color: 'text-gray-400' };
  };

  const rating = getRating(averageScore);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full space-y-6">
        {/* 标题 */}
        <div className="text-center animate-float">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            人生终章
          </h1>
          <p className="text-gray-300 text-lg">
            享年 {gameState.currentAge}岁 • {gameState.currentCountry}
          </p>
        </div>

        {/* 评分卡片 */}
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="text-gray-400 mb-2">综合评分</div>
            <div className="text-6xl font-bold text-white mb-2">{averageScore}</div>
            <div className={`text-2xl font-semibold ${rating.color}`}>{rating.text}</div>
          </div>

          {/* 属性详情 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <AttributeCard
              icon={<Heart className="w-6 h-6" />}
              label="健康"
              value={gameState.attributes.health}
              color="text-red-400"
            />
            <AttributeCard
              icon={<Brain className="w-6 h-6" />}
              label="智力"
              value={gameState.attributes.intelligence}
              color="text-blue-400"
            />
            <AttributeCard
              icon={<Smile className="w-6 h-6" />}
              label="情绪"
              value={gameState.attributes.emotion}
              color="text-yellow-400"
            />
            <AttributeCard
              icon={<Wallet className="w-6 h-6" />}
              label="财富"
              value={gameState.attributes.wealth}
              color="text-green-400"
            />
            <AttributeCard
              icon={<Star className="w-6 h-6" />}
              label="魅力"
              value={gameState.attributes.charisma}
              color="text-purple-400"
            />
            <AttributeCard
              icon={<Sparkles className="w-6 h-6" />}
              label="创造力"
              value={gameState.attributes.creativity}
              color="text-indigo-400"
            />
          </div>
        </div>

        {/* 人生统计 */}
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6">
          <h3 className="text-white font-semibold text-xl mb-4">人生统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {gameState.reincarnationCount + 1}
              </div>
              <div className="text-gray-400 text-sm mt-1">轮回次数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">
                {gameState.lifeHistory.length}
              </div>
              <div className="text-gray-400 text-sm mt-1">人生事件</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {gameState.gold}
              </div>
              <div className="text-gray-400 text-sm mt-1">剩余金币</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {inheritedGold + 100}
              </div>
              <div className="text-gray-400 text-sm mt-1">下世金币</div>
            </div>
          </div>
        </div>

        {/* 继承提示 */}
        <div className="space-y-4">
          {/* 金币继承 */}
          <div className="backdrop-blur-glass bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-300 mt-1 flex-shrink-0" />
              <div className="text-sm text-purple-200">
                <div className="font-semibold mb-1">金币继承</div>
                <div>
                  下一世你将继承 <span className="text-yellow-300 font-bold">{inheritanceRate * 100}%</span> 的金币
                  （{inheritedGold}金币）+ 100新手金币 = <span className="text-yellow-300 font-bold">{inheritedGold + 100}</span>金币
                </div>
                {hasReincarnationMedal ? (
                  <div className="mt-2 text-purple-100">
                    轮回勋章生效：继承率从50%提升至75%
                  </div>
                ) : (
                  <div className="mt-2 text-purple-300">
                    提示：购买轮回勋章可将继承率提升至75%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 属性和性格继承 */}
          <div className="backdrop-blur-glass bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-blue-300 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <div className="font-semibold mb-1">属性与性格继承</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-100 font-medium">属性继承：</span>
                    当前属性超过70时，下一世有30%概率获得+10加成；超过85时，有50%概率获得+15加成
                  </div>
                  <div className="mt-2">
                    <span className="text-blue-100 font-medium">性格继承：</span>
                    下一世的性格将继承本世性格倾向的30%
                  </div>
                  <div className="mt-2 text-xs text-blue-300">
                    优秀的基因会延续到下一世，努力提升属性将让你的未来更加光明！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="px-12 py-4 bg-gradient-primary-btn text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg animate-pulse-glow"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6" />
              <span>开启新的轮回</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function AttributeCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className={`${color} mb-2 flex justify-center`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}
