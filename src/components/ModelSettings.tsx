import { useState } from 'react';
import { Settings, Check, X } from 'lucide-react';

interface ModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onModelChange: (model: string) => void;
  currentModel: string;
}

// 模拟模型列表
const AVAILABLE_MODELS = [
  {
    id: 'doubao-seed-1-6-flash-250828',
    name: '豆包-seed-1.6-flash (最新版)',
    description: '最新flash模型，响应速度快，适合正式体验',
    type: 'production'
  },
  {
    id: 'fake-rapid',
    name: 'Fake模型-快速版 (调试用)',
    description: '快速返回预设答案，仅用于调试和测试UI流程',
    type: 'debug'
  },
  {
    id: 'fake-basic',
    name: 'Fake模型-基础版 (调试用)',
    description: '返回基础答案，模拟真实模型返回格式',
    type: 'debug'
  }
];

export default function ModelSettings({ isOpen, onClose, onModelChange, currentModel }: ModelSettingsProps) {
  const [selectedModel, setSelectedModel] = useState(currentModel);

  if (!isOpen) return null;

  const handleSave = () => {
    onModelChange(selectedModel);
    onClose();
  };

  const getModelTypeColor = (type: string) => {
    return type === 'production' ? 'text-green-400' : 'text-yellow-400';
  };

  const getModelTypeBadge = (type: string) => {
    return type === 'production' ? (
      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
        生产版
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
        调试版
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">模型设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 说明文字 */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-blue-300 text-sm">
            <strong>注意：</strong>选择Fake模型会快速返回预设答案，适用于UI调试和流程测试。
            正式游戏体验建议使用生产版模型。
          </p>
        </div>

        {/* 模型列表 */}
        <div className="space-y-3 mb-6">
          {AVAILABLE_MODELS.map((model) => (
            <div
              key={model.id}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${selectedModel === model.id
                  ? 'bg-purple-500/20 border-purple-400 ring-2 ring-purple-400/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                }
              `}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{model.name}</h3>
                    {getModelTypeBadge(model.type)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{model.description}</p>
                  <div className="text-xs text-gray-500">
                    模型ID: {model.id}
                  </div>
                </div>
                <div className="ml-4">
                  {selectedModel === model.id ? (
                    <Check className="w-6 h-6 text-purple-400" />
                  ) : (
                    <div className="w-6 h-6 border border-gray-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 按钮组 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-primary-btn text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}