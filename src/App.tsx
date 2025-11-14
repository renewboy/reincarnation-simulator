import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import EducationChoiceScreen from './components/EducationChoiceScreen';
import ModelSettings from './components/ModelSettings';
import AudioSettings from './components/AudioSettings';
import { GAME_CONFIG } from './config/gameConfig';
import { initAudioService, audioService } from './services/audioService';
import { regionManager } from './utils/regions';
import { COUNTRY_NAMES_EN } from './utils/countryNames';

function App() {
  const {
    config,
    gameState,
    isGeneratingEvent,
    startReincarnation,
    chooseOption,
    buyItem,
    restart,
    handleMajorSelection,
    handleAcademicChoice,
    onSkipEducation,
    onModelChange,
    setCurrentModel,
  } = useGameState();

  const [showModelSettings, setShowModelSettings] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [currentModel, setCurrentModelLocal] = useState<string>(GAME_CONFIG.LLM.MODEL);

  // 初始化音频服务
  useEffect(() => {
    initAudioService();
  }, []);

  // 监听游戏状态变化，自动播放对应地区音乐
  useEffect(() => {
    if (gameState.currentCountry && audioService.isEnabled()) {
      const countryENName = COUNTRY_NAMES_EN[gameState.currentCountry];
      const region = regionManager.getCountryRegion(countryENName);
      if (region) {
        audioService.playRegionMusic(region);
      }
    }
  }, [gameState.currentCountry]);

  const handleOpenSettings = () => {
    setShowModelSettings(true);
  };

  const handleCloseSettings = () => {
    setShowModelSettings(false);
  };

  const handleOpenAudioSettings = () => {
    setShowAudioSettings(true);
  };

  const handleCloseAudioSettings = () => {
    setShowAudioSettings(false);
  };

  const handleModelChange = (modelId: string) => {
    setCurrentModelLocal(modelId);
    setCurrentModel(modelId); // 调用从 useGameState 传来的函数
    onModelChange(modelId);
    setShowModelSettings(false);
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-game">
      {gameState.gamePhase === 'start' && (
        <StartScreen
          config={config}
          gameState={gameState}
          onStart={startReincarnation}
          onOpenSettings={handleOpenSettings}
          onOpenAudioSettings={handleOpenAudioSettings}
        />
      )}
      
      {gameState.gamePhase === 'playing' && (
        <GameScreen
          config={config}
          gameState={gameState}
          isGeneratingEvent={isGeneratingEvent}
          onChooseOption={chooseOption}
          onBuyItem={buyItem}
          onSelectMajor={handleMajorSelection}
          onAcademicChoice={handleAcademicChoice}
        />
      )}
      
      {gameState.gamePhase === 'education-choice' && (
        <EducationChoiceScreen
          config={config}
          gameState={gameState}
          onSelectMajor={handleMajorSelection}
          onAcademicChoice={handleAcademicChoice}
          onSkipEducation={onSkipEducation}
        />
      )}
      
      {gameState.gamePhase === 'ended' && (
        <EndScreen
          gameState={gameState}
          onRestart={restart}
        />
      )}

      {/* 模型设置弹窗 */}
      {showModelSettings && (
        <ModelSettings
          isOpen={showModelSettings}
          onClose={handleCloseSettings}
          onModelChange={handleModelChange}
          currentModel={currentModel}
        />
      )}

      {/* 音频设置弹窗 */}
      {showAudioSettings && (
        <AudioSettings
          isOpen={showAudioSettings}
          onClose={handleCloseAudioSettings}
        />
      )}
    </div>
  );
}

export default App;
