import { useCallback } from 'react';
import { X, TrendingUp, TrendingDown, Coins, User } from 'lucide-react';
import type { CharacterAttributes, MBTIPersonality } from '../types/game';

interface ResultModalProps {
  changes: {
    attributes?: Partial<CharacterAttributes>;
    gold?: number;
    personality?: Partial<MBTIPersonality>;
  };
  onClose: () => void;
}

export default function ResultModal({ 
  changes, 
  onClose
}: Omit<ResultModalProps, 'autoCloseDelay'>) {
  
  // 点击外部关闭弹窗
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // 只有点击背景区域才关闭弹窗
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // 阻止事件冒泡
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const hasChanges = 
    (changes.attributes && Object.keys(changes.attributes).length > 0) ||
    changes.gold !== undefined ||
    (changes.personality && Object.keys(changes.personality).length > 0);

  if (!hasChanges) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up"
        onClick={handleModalClick}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            变化结果
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 属性变化 */}
        {changes.attributes && Object.keys(changes.attributes).length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-300 mb-2 font-semibold">属性变化</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(changes.attributes).map(([key, value]) => {
                if (value === 0 || value === undefined) return null;
                const isPositive = value > 0;
                return (
                  <div
                    key={key}
                    className={`
                      px-3 py-2 rounded-lg border
                      ${isPositive 
                        ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }
                      animate-bounce-in
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {getAttributeLabel(key)}
                      </span>
                      <span className="text-lg font-bold flex items-center gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {isPositive ? '+' : ''}{value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 金币变化 */}
        {changes.gold !== undefined && changes.gold !== 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-300 mb-2 font-semibold">资产变化</div>
            <div
              className={`
                px-4 py-3 rounded-lg border
                ${changes.gold > 0 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
                }
                animate-bounce-in
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className={`w-5 h-5 ${changes.gold > 0 ? 'text-yellow-400' : 'text-red-400'}`} />
                  <span className="text-white font-medium">金币</span>
                </div>
                <span className={`text-xl font-bold ${changes.gold > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {changes.gold > 0 ? '+' : ''}{changes.gold}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 性格变化 */}
        {changes.personality && Object.keys(changes.personality).length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-300 mb-2 font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              性格变化
            </div>
            <div className="space-y-2">
              {Object.entries(changes.personality).map(([key, value]) => {
                if (value === 0 || value === undefined) return null;
                const isPositive = value > 0;
                const label = getPersonalityLabel(key);
                return (
                  <div
                    key={key}
                    className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 animate-bounce-in"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{label}</span>
                      <span className="font-bold">
                        {isPositive ? '+' : ''}{(value * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 关闭提示 */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400">
            点击外部区域或按X按钮关闭
          </div>
        </div>
      </div>
    </div>
  );
}

function getAttributeLabel(key: string): string {
  const labels: Record<string, string> = {
    health: '健康',
    intelligence: '智力',
    emotion: '情绪',
    wealth: '财富',
    charisma: '魅力',
    creativity: '创造力',
  };
  return labels[key] || key;
}

function getPersonalityLabel(key: string): string {
  const labels: Record<string, string> = {
    ie: '外向倾向',
    sn: '直觉倾向',
    tf: '情感倾向',
    jp: '感知倾向',
  };
  return labels[key] || key;
}
