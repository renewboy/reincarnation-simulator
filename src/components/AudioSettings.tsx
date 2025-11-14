import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { audioService } from '../services/audioService';
import { REGIONS, REGION_NAMES_CN } from '../utils/regions';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioSettings({ isOpen, onClose }: AudioSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 加载当前设置
      setIsEnabled(audioService.isEnabled());
      setVolume(audioService.getVolume());
      setCurrentRegion(audioService.getCurrentRegion() || null);
    }
  }, [isOpen]);

  const handleEnabledChange = (enabled: boolean) => {
    setIsEnabled(enabled);
    audioService.setEnabled(enabled);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioService.setVolume(newVolume);
  };

  const handlePlaySample = () => {
    if (isEnabled) {
      audioService.togglePlayPause();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">音频设置</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* 音乐开关 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEnabled ? (
                <Volume2 className="w-5 h-5 text-green-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">背景音乐</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={(e) => handleEnabledChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* 音量控制 */}
          {isEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">音量</span>
                <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <Volume2 className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}

          {/* 当前播放信息 */}
          {isEnabled && currentRegion && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>当前播放：</strong> {REGION_NAMES_CN[currentRegion as keyof typeof REGION_NAMES_CN]}地区背景音乐
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handlePlaySample}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  {audioService.isPlaying() ? '暂停' : '播放'}
                </button>
              </div>
            </div>
          )}

          {/* 地区音乐说明 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">地区音乐介绍</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• 东亚：古典宫廷音乐融合现代都市元素</div>
              <div>• 欧洲：莫扎特式优雅古典主义音乐</div>
              <div>• 北美：爵士蓝调风格融合现代流行</div>
              <div>• 其他地区：展现各地独特音乐文化特色</div>
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleVolumeChange(0.6);
                handleEnabledChange(true);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              重置默认
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `
      }} />
    </div>
  );
}
