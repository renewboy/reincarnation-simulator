import { useState } from 'react';
import type { GameConfig, GameState } from '../types/game';
import { Coins, Sparkles, Settings, Star, Target } from 'lucide-react';
import CountryWordCloud from './CountryWordCloud';
import { getCountryNameCN } from '../utils/countryNames';
import { GAME_CONFIG } from '@/config/gameConfig';

interface StartScreenProps {
  config: GameConfig;
  gameState: GameState;
  onStart: (selectedCountry?: string) => void;
  onOpenSettings: () => void;
  onOpenAudioSettings: () => void;
}

export default function StartScreen({ config, gameState, onStart, onOpenSettings, onOpenAudioSettings }: StartScreenProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const handleCountrySelect = (countryEN: string) => {
    setSelectedCountry(selectedCountry === countryEN ? null : countryEN);
  };

  const handleCustomReincarnation = () => {
    console.log('selectedCountry:', selectedCountry);
    if (selectedCountry) {
      onStart(selectedCountry);
    }
  };

  const customReincarnateGoldCost = GAME_CONFIG.GAME.CUSTOM_REINCARNATE_GOLD_COST;
  const canCustomReincarnate = selectedCountry && gameState.gold >= customReincarnateGoldCost;
  const selectedCountryCN = selectedCountry ? getCountryNameCN(selectedCountry) : '';
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
                金币 {gameState.gold}
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

        {/* 开始投胎按钮区域 */}
        <div className="flex flex-col items-center gap-4">
          {/* 随机投胎按钮 */}
          <div className="text-center">
            <button
              onClick={() => onStart()}
              className="px-12 py-4 bg-gradient-primary-btn text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg animate-pulse-glow"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                <span>随机投胎</span>
                <Sparkles className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* 自定义投胎按钮 */}
          {selectedCountry && (
            <div className="text-center space-y-2">
              <div className="text-sm text-cyan-300">
                已选择：<span className="text-yellow-300 font-bold">{selectedCountryCN}</span>
              </div>
              <button
                onClick={handleCustomReincarnation}
                disabled={!canCustomReincarnate}
                className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
                  canCustomReincarnate
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg animate-pulse hover:shadow-purple-500/50'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={!selectedCountry ? '请先选择一个国家' : gameState.gold < customReincarnateGoldCost ? `需要${customReincarnateGoldCost}金币，当前只有${gameState.gold}金币` : '自定义投胎到指定国家'}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>命运抉择</span>
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span>{customReincarnateGoldCost}</span>
                </div>
              </button>
              {selectedCountry && !canCustomReincarnate && (
                <div className="text-xs text-red-400">
                  {gameState.gold < customReincarnateGoldCost ? `金币不足，需要${customReincarnateGoldCost}金币` : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 全球投胎概率分布（云词图）*/}
        <CountryWordCloud 
          config={config} 
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountry || undefined}
        />
      </div>
    </div>
  );
}
