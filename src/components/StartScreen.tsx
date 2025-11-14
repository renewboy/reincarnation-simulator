import type { GameConfig, GameState } from '../types/game';
import { Coins, Sparkles, Settings } from 'lucide-react';
import CountryWordCloud from './CountryWordCloud';

interface StartScreenProps {
  config: GameConfig;
  gameState: GameState;
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenAudioSettings: () => void;
}

export default function StartScreen({ config, gameState, onStart, onOpenSettings, onOpenAudioSettings }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* 设置按钮 */}
        <div className="fixed top-6 right-6">
          <div className="flex items-center gap-2">
            {/* 音频设置按钮 */}
            <button
              onClick={onOpenAudioSettings}
              className="p-3 backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 shadow-lg"
              title="音频设置"
            >
              🎵
            </button>
            {/* 模型设置按钮 */}
            <button
              onClick={onOpenSettings}
              className="p-3 backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 shadow-lg"
              title="模型设置"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center space-y-4 animate-float">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            投胎模拟器
          </h1>
          <p className="text-gray-300 text-lg">
            基于2024年全球新生儿真实的出生数据
          </p>
        </div>

        {/* 资产信息卡片 */}
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-300 text-lg">资产</span>
              </div>
              <div className="text-3xl font-bold text-white">
                金 {gameState.gold}
              </div>
              {gameState.reincarnationCount > 0 && (
                <div className="text-sm text-purple-300">
                  第 {gameState.reincarnationCount + 1} 世轮回
                </div>
              )}
            </div>
            
            <button className="px-6 py-3 bg-gradient-secondary-btn text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
              查看属性
            </button>
          </div>
        </div>

        {/* 开始投胎按钮 */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="px-12 py-4 bg-gradient-primary-btn text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg animate-pulse-glow"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <span>开始投胎</span>
              <Sparkles className="w-6 h-6" />
            </div>
          </button>
        </div>

        {/* 全球投胎概率分布（云词图）*/}
        <CountryWordCloud config={config} />
      </div>
    </div>
  );
}
