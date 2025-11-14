import type { GameConfig, GameState, EventOption, Item } from '../types/game';
import { Coins, Heart, Brain, Smile, Wallet, Star, Sparkles, ShoppingBag, BarChart3, User } from 'lucide-react';
import { useState } from 'react';
import Shop from './Shop';
import DataVisualization from './DataVisualization';
import ResultModal from './ResultModal';
import MajorSelection from './MajorSelection';
import AcademicProgress from './AcademicProgress';
import CareerSelection from './CareerSelection';
import { generateMajorOptions, generateCareerOptions } from '../services/llm';

interface GameScreenProps {
  config: GameConfig;
  gameState: GameState;
  isGeneratingEvent: boolean;
  onChooseOption: (option: EventOption) => void;
  onBuyItem: (item: Item) => void;
  onSelectMajor: (major: string) => void;
  onAcademicChoice: (type: 'master' | 'phd' | 'career', choice: string) => void;
}

// 获取MBTI类型
function getMBTIType(personality: any): string {
  const ie = personality.ie > 0.5 ? 'E' : 'I';
  const sn = personality.sn > 0.5 ? 'N' : 'S';
  const tf = personality.tf > 0.5 ? 'F' : 'T';
  const jp = personality.jp > 0.5 ? 'P' : 'J';
  return `${ie}${sn}${tf}${jp}`;
}

export default function GameScreen({
  config,
  gameState,
  isGeneratingEvent,
  onChooseOption,
  onBuyItem,
  onSelectMajor,
  onAcademicChoice,
}: GameScreenProps) {
  const [showShop, setShowShop] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastOptionEffects, setLastOptionEffects] = useState<EventOption['effects'] | null>(null);
  const [pendingOption, setPendingOption] = useState<EventOption | null>(null);
  const [educationChoices, setEducationChoices] = useState<{
    majors?: string[];
    careers?: string[];
  }>({});
  const [loadingEducation, setLoadingEducation] = useState(false);
  const countryData = config.countries[gameState.currentCountry];

  // 处理选择选项，立即生成下一个事件
  const handleChooseOption = (option: EventOption) => {
    // 立即调用 onChooseOption 开始生成下一个事件（不等待弹窗关闭）
    onChooseOption(option);
    
    // 保存选项和效果，显示弹窗
    setPendingOption(option);
    setLastOptionEffects(option.effects);
    setShowResultModal(true);
  };

  // 处理弹窗关闭
  const handleCloseModal = () => {
    setShowResultModal(false);
    // 清理弹窗状态
    setPendingOption(null);
    setLastOptionEffects(null);
  };

  // 处理教育选择
  const handleEducationChoice = async (type: 'major' | 'master' | 'phd' | 'career') => {
    setLoadingEducation(true);
    try {
      if (type === 'major') {
        const majors = await generateMajorOptions(
          gameState.currentAge,
          gameState.currentCountry,
          gameState.attributes,
          gameState.personality
        );
        setEducationChoices({ majors });
        setPendingOption({ text: '选择专业', effects: {} } as EventOption);
      } else if (type === 'career') {
        const major = gameState.education.phdMajor || gameState.education.masterMajor || gameState.education.major || '通用专业';
        const educationLevel = gameState.education.stage || 'bachelor';
        const careers = await generateCareerOptions(
          gameState.currentCountry,
          major,
          educationLevel,
          gameState.attributes,
          gameState.personality
        );
        setEducationChoices({ careers });
        setPendingOption({ text: '选择职业', effects: {} } as EventOption);
      }
    } catch (error) {
      console.error('生成教育选项失败:', error);
      // 使用默认选项
      const defaultMajors = ['计算机科学与技术', '工商管理', '心理学', '生物科学'];
      const defaultCareers = ['高级工程师', '企业管理者', '研究员', '咨询师'];
      setEducationChoices({ 
        majors: defaultMajors, 
        careers: defaultCareers 
      });
    } finally {
      setLoadingEducation(false);
    }
  };

  // 处理专业选择
  const handleSelectMajor = (major: string) => {
    onSelectMajor(major);
    setEducationChoices({});
    setPendingOption(null);
  };

  // 处理学术选择
  const handleSelectAcademicChoice = (type: 'master' | 'phd' | 'career', choice: string) => {
    onAcademicChoice(type, choice);
    setEducationChoices({});
    setPendingOption(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 顶部信息栏 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 基本信息 */}
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">基本信息</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>国家</span>
                <span className="text-white font-medium">{gameState.currentCountry}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>年龄</span>
                <span className="text-white font-medium">{gameState.currentAge}岁 / {gameState.maxAge}岁</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>轮回</span>
                <span className="text-purple-300 font-medium">第{gameState.reincarnationCount + 1}世</span>
              </div>
            </div>
          </div>

          {/* 性格 */}
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              性格
            </h3>
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {getMBTIType(gameState.personality)}
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>{gameState.personality.ie > 0.5 ? '外向' : '内向'}</span>
                <span className="text-purple-300">{(gameState.personality.ie * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>{gameState.personality.sn > 0.5 ? '直觉' : '感觉'}</span>
                <span className="text-purple-300">{(gameState.personality.sn * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>{gameState.personality.tf > 0.5 ? '思考' : '情感'}</span>
                <span className="text-purple-300">{(gameState.personality.tf * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>{gameState.personality.jp > 0.5 ? '判断' : '知觉'}</span>
                <span className="text-purple-300">{(gameState.personality.jp * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* 资产 */}
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              资产
            </h3>
            <div className="text-3xl font-bold text-yellow-400">
              {gameState.gold}
            </div>
            <button
              onClick={() => setShowShop(true)}
              className="mt-2 w-full px-4 py-2 bg-gradient-secondary-btn text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              打开商店
            </button>
          </div>

          {/* 进度 */}
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">人生进度</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>生命值</span>
                <span>{gameState.currentAge}/{gameState.maxAge}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(gameState.currentAge / gameState.maxAge) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="mt-2 w-full px-4 py-2 bg-gradient-primary-btn text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showStats ? '返回游戏' : '查看统计'}
            </button>
          </div>
        </div>

        {/* 条件渲染：游戏界面或统计界面 */}
        {showStats ? (
          <DataVisualization gameState={gameState} />
        ) : (
          <>
            {/* 教育进度 */}
            <AcademicProgress
              education={gameState.education}
              attributes={gameState.attributes}
              personality={gameState.personality}
              currentAge={gameState.currentAge}
              showContinueOption={gameState.currentAge === 18 || gameState.currentAge === 22 || gameState.currentAge === 25 || gameState.currentAge === 29}
              onContinueEducation={() => {
                if (gameState.currentAge === 18) handleEducationChoice('major');
                if (gameState.currentAge === 22) handleEducationChoice('major');
                if (gameState.currentAge === 25) handleEducationChoice('major');
                if (gameState.currentAge === 29) handleEducationChoice('career');
              }}
            />

            {/* 属性展示 */}
            <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 text-lg">角色属性</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AttributeBar
              icon={<Heart className="w-5 h-5" />}
              label="健康"
              value={gameState.attributes.health}
              color="from-red-500 to-pink-500"
            />
            <AttributeBar
              icon={<Brain className="w-5 h-5" />}
              label="智力"
              value={gameState.attributes.intelligence}
              color="from-blue-500 to-cyan-500"
            />
            <AttributeBar
              icon={<Smile className="w-5 h-5" />}
              label="情绪"
              value={gameState.attributes.emotion}
              color="from-yellow-500 to-orange-500"
            />
            <AttributeBar
              icon={<Wallet className="w-5 h-5" />}
              label="财富"
              value={gameState.attributes.wealth}
              color="from-green-500 to-emerald-500"
            />
            <AttributeBar
              icon={<Star className="w-5 h-5" />}
              label="魅力"
              value={gameState.attributes.charisma}
              color="from-purple-500 to-pink-500"
            />
            <AttributeBar
              icon={<Sparkles className="w-5 h-5" />}
              label="创造力"
              value={gameState.attributes.creativity}
              color="from-indigo-500 to-purple-500"
            />
          </div>
        </div>

        {/* 事件卡片 */}
        {isGeneratingEvent ? (
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-8 text-center">
            <div className="animate-pulse">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg">人生事件生成中...</p>
              <p className="text-gray-400 text-sm mt-2">AI正在为您量身定制下一段人生</p>
            </div>
          </div>
        ) : gameState.currentEvent ? (
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6 animate-float">
            <div className="mb-4">
              <div className="text-purple-300 text-sm mb-2">{gameState.currentAge}岁</div>
              <h3 className="text-white text-xl font-semibold mb-3">人生事件</h3>
              <p className="text-gray-200 leading-relaxed">
                {gameState.currentEvent.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameState.currentEvent.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChooseOption(option)}
                  className="text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all hover:scale-[1.02]"
                >
                  <div className="text-white font-medium">{option.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
          </>
        )}
      </div>

      {/* 商店模态框 */}
      {showShop && (
        <Shop
          gold={gameState.gold}
          currentCountry={gameState.currentCountry}
          onBuyItem={onBuyItem}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* 结果弹窗 */}
      {showResultModal && lastOptionEffects && (
        <ResultModal
          changes={lastOptionEffects}
          onClose={handleCloseModal}
        />
      )}

      {/* 教育选择弹窗 */}
      {educationChoices.majors && (
        <MajorSelection
          currentCountry={gameState.currentCountry}
          currentAge={gameState.currentAge}
          attributes={gameState.attributes}
          personality={gameState.personality}
          majorOptions={educationChoices.majors}
          onSelectMajor={handleSelectMajor}
        />
      )}

      {/* 职业选择弹窗 */}
      {educationChoices.careers && (
        <CareerSelection
          currentCountry={gameState.currentCountry}
          attributes={gameState.attributes}
          personality={gameState.personality}
          education={gameState.education.major || '博士'}
          careerOptions={educationChoices.careers}
          onSelectCareer={(career) => handleSelectAcademicChoice('career', career)}
        />
      )}

      {/* 加载状态 */}
      {loadingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8 text-center">
            <div className="animate-pulse">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg">正在生成选择选项...</p>
              <p className="text-gray-400 text-sm mt-2">AI正在为您的角色量身定制</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttributeBar({
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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
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
