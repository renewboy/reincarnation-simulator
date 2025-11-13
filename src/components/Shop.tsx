import { useEffect, useState } from 'react';
import type { Item } from '../types/game';
import { SHOP_ITEMS } from '../types/game';
import { X, ShoppingCart, Star } from 'lucide-react';
import { getCountrySpecialItem } from '../services/specialItems';
import { getCountryNameCN } from '../utils/countryNames';

interface ShopProps {
  gold: number;
  currentCountry: string;
  onBuyItem: (item: Item) => void;
  onClose: () => void;
}

export default function Shop({ gold, currentCountry, onBuyItem, onClose }: ShopProps) {
  const [specialItem, setSpecialItem] = useState<Item | null>(null);
  const [isLoadingSpecial, setIsLoadingSpecial] = useState(true);

  // 加载国家专属道具
  useEffect(() => {
    async function loadSpecialItem() {
      setIsLoadingSpecial(true);
      try {
        const item = await getCountrySpecialItem(currentCountry);
        setSpecialItem(item);
      } catch (error) {
        console.error('加载专属道具失败:', error);
      } finally {
        setIsLoadingSpecial(false);
      }
    }
    loadSpecialItem();
  }, [currentCountry]);

  const allItems = specialItem ? [specialItem, ...SHOP_ITEMS] : SHOP_ITEMS;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">道具商店</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* 当前金币 */}
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-sm text-yellow-200 mb-1">当前拥有金币</div>
          <div className="text-3xl font-bold text-yellow-400">{gold}</div>
        </div>

        {/* 道具列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingSpecial && (
            <div className="col-span-full text-center py-8">
              <div className="animate-pulse text-purple-400">
                正在生成{getCountryNameCN(currentCountry)}专属道具...
              </div>
            </div>
          )}
          
          {allItems.map((item, index) => {
            const canAfford = gold >= item.price;
            const isSpecial = item.id.startsWith('special_');
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSpecial
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/50 shadow-lg'
                    : canAfford
                    ? 'bg-white/5 border-white/20 hover:border-purple-400/50 hover:bg-white/10'
                    : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* 专属标签 */}
                {isSpecial && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">
                      {getCountryNameCN(currentCountry)}专属
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  </div>
                </div>

                {/* 效果展示 */}
                {item.effects.attributes && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(item.effects.attributes).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <span
                          key={key}
                          className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                        >
                          {getAttributeLabel(key)}+{value}
                        </span>
                      );
                    })}
                  </div>
                )}

                {item.effects.lifespan && (
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                      寿命+{item.effects.lifespan}年
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className={`font-bold text-lg ${isSpecial ? 'text-yellow-400' : 'text-yellow-400'}`}>
                    {item.price} 金币
                  </div>
                  <button
                    onClick={() => {
                      if (canAfford) {
                        onBuyItem(item);
                      }
                    }}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      canAfford
                        ? isSpecial
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                          : 'bg-gradient-primary-btn text-white hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? '购买' : '金币不足'}
                  </button>
                </div>
              </div>
            );
          })}
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
