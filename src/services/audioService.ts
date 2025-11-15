/**
 * 音频管理系统
 * 负责地区背景音乐的播放、切换和音量控制
 */

import {regionManager, Region } from '../utils/regions';

export interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-1
  currentRegion: Region | null;
}

class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  private settings: AudioSettings = {
    enabled: true,
    volume: 0.6,
    currentRegion: null,
  };
  private isInitialized = false;

  /**
   * 初始化音频系统
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 创建音频元素
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.volume = this.settings.volume;
      this.audioElement.preload = 'auto';
      
      // 监听音频加载错误
      this.audioElement.addEventListener('error', (e) => {
        console.warn('音频加载失败:', e);
      });

      // 监听音频结束
      this.audioElement.addEventListener('ended', () => {
        if (this.settings.enabled) {
          this.audioElement?.play();
        }
      });

      // 从本地存储加载设置
      this.loadSettings();
      this.settings.currentRegion = null;
      this.isInitialized = true;
      console.log('音频系统初始化完成');
    } catch (error) {
      console.error('音频系统初始化失败:', error);
    }
  }

  /**
   * 播放指定地区音乐
   */
  async playRegionMusic(region: Region): Promise<void> {
    if (!this.audioElement || !this.settings.enabled) return;

    try {
      const musicPath = regionManager.getRegionMusicPath(region);
      
      // 如果当前播放的音乐已是目标音乐，跳过
      if (this.settings.currentRegion === region) {
        console.log(`地区音乐${region}已是当前播放，无需切换`);
        return;
      }

      // 更新设置
      this.settings.currentRegion = region;
      this.saveSettings();

      // 停止当前播放
      this.audioElement.pause();
      this.audioElement.currentTime = 0;

      // 加载新音乐
      this.audioElement.src = musicPath;
      this.audioElement.load();

      // 播放新音乐
      await new Promise(resolve => setTimeout(resolve, 1500));
      await this.audioElement.play();
      console.log(`开始播放${region}地区音乐`);
    } catch (error) {
      console.error(`播放${region}地区音乐失败:`, error);
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    if (!this.audioElement) return;
    
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.settings.currentRegion = null;
    this.saveSettings();
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.settings.volume;
    }
    this.saveSettings();
  }

  /**
   * 获取当前音量
   */
  getVolume(): number {
    return this.settings.volume;
  }

  /**
   * 启用/禁用音乐
   */
  setEnabled(enabled: boolean): void {
    console.log('audioService setEnabled', enabled);
    this.settings.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
    this.saveSettings();
  }

  /**
   * 获取是否启用状态
   */
  isEnabled(): boolean {
    return this.settings.enabled;
  }

  /**
   * 根据国家播放对应地区音乐
   */
  async playCountryMusic(country: string): Promise<void> {
    const region = regionManager.getCountryRegion(country);
    console.log('audioService playCountryMusic', country, region);
    if (region) {
      await this.playRegionMusic(region);
    }
  }

  /**
   * 获取当前播放地区
   */
  getCurrentRegion(): Region | null {
    return this.settings.currentRegion;
  }

  /**
   * 检查是否正在播放
   */
  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }

  /**
   * 暂停/恢复播放
   */
  togglePlayPause(): void {
    if (!this.audioElement) return;

    if (this.audioElement.paused && this.settings.currentRegion) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  /**
   * 保存设置到本地存储
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('reincarnation_audio_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('保存音频设置失败:', error);
    }
  }

  /**
   * 从本地存储加载设置
   */
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('reincarnation_audio_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.settings = {
          ...this.settings,
          ...parsed,
        };
        
        // 确保音频元素音量同步
        if (this.audioElement) {
          this.audioElement.volume = this.settings.volume;
        }
      }
    } catch (error) {
      console.warn('加载音频设置失败:', error);
    }
  }

  /**
   * 重置为默认设置
   */
  resetToDefaults(): void {
    this.settings = {
      enabled: true,
      volume: 0.6,
      currentRegion: null,
    };
    
    if (this.audioElement) {
      this.audioElement.volume = this.settings.volume;
    }
    
    this.stop();
    this.saveSettings();
  }

  /**
   * 销毁音频系统
   */
  destroy(): void {
    if (this.audioElement) {
      this.stop();
      this.audioElement.remove();
      this.audioElement = null;
    }
    this.isInitialized = false;
  }
}

// 单例实例
export const audioService = new AudioService();

// 初始化函数
export async function initAudioService(): Promise<void> {
  await audioService.initialize();
}

// 清理函数
export function cleanupAudioService(): void {
  audioService.destroy();
}
