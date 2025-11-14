import { useState } from 'react';
import { BookOpen, GraduationCap, Sparkles, AlertCircle } from 'lucide-react';
import type { GameConfig, GameState } from '../types/game';
import MajorSelection from './MajorSelection';
import CareerSelection from './CareerSelection';
import { generateMajorOptions, generateCareerOptions } from '../services/llm';

interface EducationChoiceScreenProps {
  config: GameConfig;
  gameState: GameState;
  onSelectMajor: (major: string) => void;
  onAcademicChoice: (type: 'master' | 'phd' | 'career', choice: string) => void;
  onSkipEducation: (type: 'master' | 'phd') => void;
}

export default function EducationChoiceScreen({
  config,
  gameState,
  onSelectMajor,
  onAcademicChoice,
  onSkipEducation,
}: EducationChoiceScreenProps) {
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [majorOptions, setMajorOptions] = useState<string[]>([]);
  const [careerOptions, setCareerOptions] = useState<string[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionType, setSelectionType] = useState<'major' | 'career' | null>(null);
  const [showMainButtons, setShowMainButtons] = useState(true); // 控制是否显示主选择按钮
  const [debugInfo, setDebugInfo] = useState<any>(null); // LLM调试信息

  // 教育阶段中文显示翻译
  const getEducationStageDisplayName = (stage: string) => {
    const stageMap: Record<string, string> = {
      'none': '学前教育',
      'elementary': '小学教育',
      'middle': '中学教育', 
      'high': '高中教育',
      'bachelor': '本科教育',
      'master': '研究生教育',
      'phd': '博士教育',
      'completed': '教育完成'
    };
    return stageMap[stage] || stage;
  };

  // 获取当前教育阶段的显示文本
  const getEducationStageText = (type: string) => {
    switch (type) {
      case 'major':
        return '大学专业选择';
      case 'career':
        return '职业选择';
      case 'master':
        return '硕士专业选择';
      case 'phd':
        return '博士专业选择';
      default:
        return '教育选择';
    }
  };

  // 获取当前年龄的教育描述
  const getEducationDescription = (age: number) => {
    const currentStage = gameState.education.stage;
    const currentMajor = gameState.education.major || gameState.education.masterMajor || gameState.education.phdMajor;
    
    // 根据实际教育阶段显示描述，而非硬编码年龄
    if (currentStage === 'high' && !gameState.education.major) {
      return `你已经${age}岁，即将踏入大学校园。选择一个你感兴趣的专业开始大学生活吧！`;
    } else if (currentStage === 'bachelor' && !currentMajor) {
      return `你已经${age}岁，正在大学学习。现在需要选择一个你感兴趣的专业。`;
    } else if (currentStage === 'bachelor' && currentMajor) {
      return `你已经${age}岁，本科即将毕业（专业：${currentMajor}）。现在可以选择继续深造或直接进入职场。`;
    } else if (currentStage === 'master' && !gameState.education.masterMajor) {
      return `你已经${age}岁，硕士阶段需要选择专业方向。`;
    } else if (currentStage === 'master' && gameState.education.masterMajor) {
      return `你已经${age}岁，硕士即将毕业（专业：${gameState.education.masterMajor}）。可以选择继续攻读博士学位或开始职业生涯。`;
    } else if (currentStage === 'phd' && !gameState.education.phdMajor) {
      return `你已经${age}岁，博士阶段需要选择研究方向。`;
    } else if (currentStage === 'phd' && gameState.education.phdMajor) {
      return `你已经${age}岁，完成了博士学位（专业：${gameState.education.phdMajor}）。现在是时候选择一个适合的职业来发挥你的专业技能了！`;
    }
    return `你已经${age}岁，现在需要你做出重要的教育选择。`;
  };

  // 处理教育选择按钮点击
  const handleEducationChoiceClick = async (type: 'master' | 'phd') => {
    setIsGeneratingOptions(true);
    setShowMainButtons(false);
    setDebugInfo(null);
    
    try {
      console.group('🎓 LLM调试信息 - 教育选择生成');
      console.log('📝 请求参数:', {
        age: gameState.currentAge,
        country: gameState.currentCountry,
        type,
        attributes: gameState.attributes,
        personality: gameState.personality,
        education: gameState.education
      });
      console.groupEnd();
      
      // 生成专业选项
      const majors = await generateMajorOptions(
        gameState.currentAge,
        gameState.currentCountry,
        gameState.attributes,
        gameState.personality,
        gameState.education
      );
      
      console.log('✅ LLM生成结果:', majors);
      setMajorOptions(majors);
      setSelectionType('major');
      setShowSelectionModal(true);
    } catch (error) {
      console.error('生成专业选项失败:', error);
      console.log('❌ 错误详情:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 显示调试信息
      setDebugInfo({
        type: 'education',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        errorDetails: {
          name: error instanceof Error ? error.name : 'UnknownError',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      // 使用默认选项
      const defaultMajors = ['计算机科学与技术', '工商管理', '心理学', '生物科学'];
      setMajorOptions(defaultMajors);
      setSelectionType('major');
      setShowSelectionModal(true);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  // 处理职业选择按钮点击
  const handleCareerChoiceClick = async () => {
    setIsGeneratingOptions(true);
    setShowMainButtons(false);
    setDebugInfo(null);
    
    try {
      const major = gameState.education.phdMajor || gameState.education.masterMajor || gameState.education.major || '通用专业';
      const educationLevel = gameState.education.stage || 'bachelor';
      
      console.group('💼 LLM调试信息 - 职业选择生成');
      console.log('📝 请求参数:', {
        country: gameState.currentCountry,
        major,
        educationLevel,
        attributes: gameState.attributes,
        personality: gameState.personality
      });
      console.groupEnd();
      
      // 生成职业选项
      const careers = await generateCareerOptions(
        gameState.currentCountry,
        major,
        educationLevel,
        gameState.attributes,
        gameState.personality
      );
      
      console.log('✅ LLM生成结果:', careers);
      setCareerOptions(careers);
      setSelectionType('career');
      setShowSelectionModal(true);
    } catch (error) {
      console.error('生成职业选项失败:', error);
      console.log('❌ 错误详情:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 显示调试信息
      setDebugInfo({
        type: 'career',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        errorDetails: {
          name: error instanceof Error ? error.name : 'UnknownError',
          stack: error instanceof Error ? error.stack : undefined
        }
      });
      
      // 使用默认选项
      const defaultCareers = ['高级工程师', '企业管理者', '研究员', '咨询师'];
      setCareerOptions(defaultCareers);
      setSelectionType('career');
      setShowSelectionModal(true);
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  // 返回主选择界面
  const handleBackToMain = () => {
    setShowSelectionModal(false);
    setShowMainButtons(true);
    setMajorOptions([]);
    setCareerOptions([]);
    setSelectionType(null);
  };

  // 处理教育选择触发
  const handleEducationChoice = async () => {
    setIsGeneratingOptions(true);
    setShowMainButtons(false);
    
    try {
      if (gameState.pendingEducationChoice?.type === 'major') {
        // 生成专业选项
        const majors = await generateMajorOptions(
          gameState.currentAge,
          gameState.currentCountry,
          gameState.attributes,
          gameState.personality,
          gameState.education
        );
        setMajorOptions(majors);
        setSelectionType('major');
        setShowSelectionModal(true);
      } else if (gameState.pendingEducationChoice?.type === 'career') {
        // 生成职业选项
        const major = gameState.education.phdMajor || gameState.education.masterMajor || gameState.education.major || '通用专业';
        const educationLevel = gameState.education.stage || 'bachelor';
        const careers = await generateCareerOptions(
          gameState.currentCountry,
          major,
          educationLevel,
          gameState.attributes,
          gameState.personality
        );
        setCareerOptions(careers);
        setSelectionType('career');
        setShowSelectionModal(true);
      } else if (gameState.pendingEducationChoice?.type === 'master') {
        // 生成硕士专业选项
        const majors = await generateMajorOptions(
          gameState.currentAge,
          gameState.currentCountry,
          gameState.attributes,
          gameState.personality,
          gameState.education
        );
        setMajorOptions(majors);
        setSelectionType('major');
        setShowSelectionModal(true);
      } else if (gameState.pendingEducationChoice?.type === 'phd') {
        // 生成博士专业选项
        const majors = await generateMajorOptions(
          gameState.currentAge,
          gameState.currentCountry,
          gameState.attributes,
          gameState.personality,
          gameState.education
        );
        setMajorOptions(majors);
        setSelectionType('major');
        setShowSelectionModal(true);
      }
    } catch (error) {
      console.error('生成教育选项失败:', error);
      
      // 使用默认选项
      const defaultMajors = ['计算机科学与技术', '工商管理', '心理学', '生物科学'];
      const defaultCareers = ['高级工程师', '企业管理者', '研究员', '咨询师'];
      
      if (gameState.pendingEducationChoice?.type === 'major' || 
          gameState.pendingEducationChoice?.type === 'master' || 
          gameState.pendingEducationChoice?.type === 'phd') {
        setMajorOptions(defaultMajors);
        setSelectionType('major');
        setShowSelectionModal(true);
      } else if (gameState.pendingEducationChoice?.type === 'career') {
        setCareerOptions(defaultCareers);
        setSelectionType('career');
        setShowSelectionModal(true);
      }
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  // 处理专业选择
  const handleMajorSelect = (major: string) => {
    setShowSelectionModal(false);
    // 根据待选择类型调用不同处理函数
    if (gameState.pendingEducationChoice?.type === 'master') {
      onAcademicChoice('master', major);
    } else if (gameState.pendingEducationChoice?.type === 'phd') {
      onAcademicChoice('phd', major);
    } else {
      onSelectMajor(major);
    }
  };

  // 处理职业选择
  const handleCareerSelect = (career: string) => {
    setShowSelectionModal(false);
    onAcademicChoice('career', career);
  };

  // 如果没有待处理的教育选择，显示错误状态
  if (!gameState.pendingEducationChoice) {
    return (
      <div className="min-h-screen p-8 bg-gradient-game flex items-center justify-center">
        <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">教育选择状态错误</h2>
          <p className="text-gray-300 text-sm">
            当前没有待处理的教育选择。请返回游戏继续。
          </p>
        </div>
      </div>
    );
  }

  // 渲染主选择界面
  if (showMainButtons) {
    return (
      <div className="min-h-screen p-8 bg-gradient-game">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 主标题 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-12 h-12 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">{getEducationStageText(gameState.pendingEducationChoice?.type || '')}</h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {getEducationDescription(gameState.currentAge)}
            </p>
          </div>

          {/* 角色信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                基本信息
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div>国家：{gameState.currentCountry}</div>
                <div>年龄：{gameState.currentAge}岁</div>
                <div>轮回：第{gameState.reincarnationCount + 1}世</div>
              </div>
            </div>
            
            <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                主要属性
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div>智力：{gameState.attributes.intelligence}</div>
                <div>创造力：{gameState.attributes.creativity}</div>
                <div>魅力：{gameState.attributes.charisma}</div>
                <div>财富：{gameState.attributes.wealth}</div>
              </div>
            </div>
            
            <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                教育背景
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div>当前阶段：{getEducationStageDisplayName(gameState.education.stage)}</div>
                <div>专业：{gameState.education.major || gameState.education.masterMajor || gameState.education.phdMajor || '未选择'}</div>
                <div>金币：{gameState.gold}</div>
              </div>
            </div>
          </div>

          {/* 选择按钮 */}
          <div className="text-center space-y-4">
            {isGeneratingOptions ? (
              <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-2xl p-8">
                <div className="animate-pulse">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white text-lg">正在生成选择选项...</p>
                  <p className="text-gray-400 text-sm mt-2">AI正在为您的角色量身定制</p>
                </div>
              </div>
            ) : (
              <>
                {/* 针对不同教育阶段显示不同的按钮 */}
                {gameState.pendingEducationChoice?.type === 'master' && (
                  <>
                    <button
                      onClick={() => handleEducationChoiceClick('master')}
                      className="px-8 py-4 bg-gradient-primary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg mr-4"
                    >
                      选择硕士专业
                    </button>
                    <button
                      onClick={() => onSkipEducation('master')}
                      className="px-8 py-4 bg-gradient-secondary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
                    >
                      直接就业
                    </button>
                  </>
                )}
                
                {gameState.pendingEducationChoice?.type === 'phd' && (
                  <>
                    <button
                      onClick={() => handleEducationChoiceClick('phd')}
                      className="px-8 py-4 bg-gradient-primary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg mr-4"
                    >
                      选择博士专业
                    </button>
                    <button
                      onClick={() => onSkipEducation('phd')}
                      className="px-8 py-4 bg-gradient-secondary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
                    >
                      直接就业
                    </button>
                  </>
                )}
                
                {gameState.pendingEducationChoice?.type === 'career' && (
                  <button
                    onClick={handleCareerChoiceClick}
                    className="px-8 py-4 bg-gradient-primary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
                  >
                    选择职业
                  </button>
                )}
                
                {gameState.pendingEducationChoice?.type === 'major' && (
                  <button
                    onClick={handleEducationChoice}
                    className="px-8 py-4 bg-gradient-primary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
                  >
                    开始选择专业
                  </button>
                )}
                
                {/* 其他教育选择类型使用原有逻辑 */}
                {(!gameState.pendingEducationChoice?.type || 
                  (gameState.pendingEducationChoice?.type !== 'major' && 
                   gameState.pendingEducationChoice?.type !== 'master' && 
                   gameState.pendingEducationChoice?.type !== 'phd' && 
                   gameState.pendingEducationChoice?.type !== 'career')) && (
                  <button
                    onClick={handleEducationChoice}
                    className="px-8 py-4 bg-gradient-primary-btn text-white text-xl font-semibold rounded-2xl hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
                  >
                    开始选择{getEducationStageText(gameState.pendingEducationChoice?.type || '')}
                  </button>
                )}
              </>
            )}
          </div>

          {/* 说明文字 */}
          <div className="backdrop-blur-glass bg-glass-bg border border-glass-border rounded-xl p-6 text-center">
            <p className="text-gray-300 text-sm">
              {gameState.pendingEducationChoice?.type === 'major' 
                ? '你的专业选择将影响整个大学期间的学习体验和未来的职业发展方向。'
                : gameState.pendingEducationChoice?.type === 'master'
                ? '硕士教育将深化你的专业能力，为未来的职业发展或学术研究打下坚实基础。'
                : gameState.pendingEducationChoice?.type === 'phd'
                ? '博士学位将让你成为某个领域的专家，适合追求学术成就或高端职业发展。'
                : '你的职业选择将决定你的人生道路和成就高度。慎重考虑吧！'
              }
            </p>
          </div>
          
          {/* LLM调试信息显示 */}
          {debugInfo && (
            <div className="mt-4 backdrop-blur-glass bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-semibold mb-2">🔍 LLM调试信息</h3>
              <div className="text-red-300 text-sm space-y-1">
                <p><span className="font-medium">类型:</span> {debugInfo.type}</p>
                <p><span className="font-medium">时间:</span> {new Date(debugInfo.timestamp).toLocaleString()}</p>
                <p><span className="font-medium">错误:</span> {debugInfo.error}</p>
                {debugInfo.rawResponse && (
                  <div className="mt-2">
                    <p className="font-medium">原始响应:</p>
                    <pre className="bg-black/30 p-2 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(debugInfo.rawResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 如果显示选择模态框，渲染选择界面
  if (showSelectionModal) {
    if (selectionType === 'major' && majorOptions.length > 0) {
      return (
        <MajorSelection
          currentCountry={gameState.currentCountry}
          currentAge={gameState.currentAge}
          attributes={gameState.attributes}
          personality={gameState.personality}
          majorOptions={majorOptions}
          onSelectMajor={handleMajorSelect}
          onBack={handleBackToMain}
        />
      );
    }
    
    if (selectionType === 'career' && careerOptions.length > 0) {
      return (
        <CareerSelection
          currentCountry={gameState.currentCountry}
          attributes={gameState.attributes}
          personality={gameState.personality}
          education={gameState.education.major || '博士'}
          careerOptions={careerOptions}
          onSelectCareer={handleCareerSelect}
          onBack={handleBackToMain}
        />
      );
    }
  }

  return null;
}
