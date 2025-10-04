// 音乐管理模块
class MusicManager {
    constructor() {
        this.currentMusic = null;
        this.currentMusicName = 'none';
        this.musicVolume = 0.3;
        
        // 背景音乐文件映射
        this.musicFiles = {
            // 中文背景音乐
            'festive': './music/喜庆日.mp3', // 喜庆日
            'zen': './music/禅境幽.mp3', // 禅境幽
            'guzheng': './music/筝放松.mp3', // 筝放松
            // 怀旧音乐
            'qibao': './music/game/七宝奇谋.mp3', // 七宝奇谋
            'xianjian1': './music/game/仙剑1.mp3', // 仙剑1
            'xianjian2': './music/game/仙剑2.mp3', // 仙剑2
            'yingzi': './music/game/影子传说.mp3', // 影子传说
            'mario': './music/game/超级玛丽.mp3', // 超级玛丽
            'contra': './music/game/魂斗罗.mp3' // 魂斗罗
        };
        
        // 音乐显示名称映射
        this.musicNames = {
            // 中文背景音乐
            'festive': '喜庆日',
            'zen': '禅境幽',
            'guzheng': '筝放松',
            // 怀旧音乐
            'qibao': '七宝奇谋',
            'xianjian1': '仙剑1',
            'xianjian2': '仙剑2',
            'yingzi': '影子传说',
            'mario': '超级玛丽',
            'contra': '魂斗罗',
            'none': '关闭音乐'
        };
        
        this.init();
    }
    
    init() {
        // 从本地存储加载音乐设置
        const savedMusic = localStorage.getItem('selectedMusic');
        const savedVolume = localStorage.getItem('musicVolume');
        
        if (savedMusic) {
            this.currentMusicName = savedMusic;
        }
        
        if (savedVolume) {
            const volume = parseFloat(savedVolume);
            // 确保音量值在合理范围内 (0-1)
            if (volume >= 0 && volume <= 1) {
                this.musicVolume = volume;
            } else {
                // 如果音量值异常，重置为默认值
                this.musicVolume = 0.3;
                localStorage.setItem('musicVolume', '0.3');
            }
        }
        
        // 注意：事件监听器将在DOM加载完成后初始化
    }
    
    initEventListeners() {
        // 音量滑块事件监听器
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                this.musicVolume = parseInt(volumeSlider.value) / 100;
                volumeValue.textContent = parseInt(volumeSlider.value) + '%';
                
                // 实时调整当前播放音乐的音量
                if (this.currentMusic) {
                    this.currentMusic.volume = this.musicVolume;
                }
                
                // 保存音量设置到本地存储
                localStorage.setItem('musicVolume', this.musicVolume.toString());
            });
        }
        
        // 音乐卡片点击事件监听器需要修正为music-option-card
        document.addEventListener('click', (event) => {
            if (event.target.closest('.music-option-card')) {
                const musicCard = event.target.closest('.music-option-card');
                const musicType = musicCard.getAttribute('data-music');
                if (musicType) {
                    this.selectMusicFromModal(musicType);
                }
            }
        });
        
        // 音乐设置模态框背景点击关闭
        const musicModal = document.getElementById('musicSettingsModal');
        if (musicModal) {
            musicModal.addEventListener('click', (event) => {
                if (event.target === musicModal) {
                    this.closeMusicSettings();
                }
            });
        }
    }
    
    openMusicSettings() {
        const musicModal = document.getElementById('musicSettingsModal');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (musicModal) {
            musicModal.classList.add('show');
        }
        
        if (volumeSlider && volumeValue) {
            volumeSlider.value = this.musicVolume * 100;
            volumeValue.textContent = Math.round(this.musicVolume * 100) + '%';
        }
        
        this.updateMusicSelection();
    }
    
    closeMusicSettings() {
        const musicModal = document.getElementById('musicSettingsModal');
        if (musicModal) {
            musicModal.classList.remove('show');
        }
        
        // 保存音乐设置到本地存储
        if (this.currentMusicName) {
            localStorage.setItem('selectedMusic', this.currentMusicName);
        }
        
        localStorage.setItem('musicVolume', this.musicVolume.toString());
    }
    
    selectMusic(musicType) {
        // 检查是否已经选择了相同的音乐
        if (musicType === this.currentMusicName || (musicType === 'none' && !this.currentMusicName)) {
            return;
        }
        
        // 停止当前播放的音乐
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }
        
        // 清除所有音乐状态显示
        document.querySelectorAll('.music-status').forEach(status => {
            status.textContent = '';
        });
        
        if (musicType === 'none') {
            this.currentMusicName = 'none';
            const noneStatus = document.querySelector('[onclick="selectMusic(\'none\')"] .music-status');
            if (noneStatus) {
                noneStatus.textContent = '✓';
            }
        } else if (this.musicFiles[musicType]) {
            this.currentMusic = new Audio(this.musicFiles[musicType]);
            this.currentMusic.loop = true;
            this.currentMusic.volume = this.musicVolume;
            
            this.currentMusic.play().then(() => {
                this.currentMusicName = musicType;
                const musicStatus = document.querySelector(`[onclick="selectMusic('${musicType}')"] .music-status`);
                if (musicStatus) {
                    musicStatus.textContent = '♪';
                }
            }).catch(error => {
                console.error('音乐播放失败:', error);
                alert('音乐播放失败，请检查网络连接或音频文件');
            });
        }
        
        // 更新"关闭音乐"选项的状态
        const noneStatus = document.querySelector('[onclick="selectMusic(\'none\')"] .music-status');
        if (noneStatus && musicType !== 'none') {
            noneStatus.textContent = '✓';
        }
    }
    
    selectMusicFromModal(musicType) {
        // 停止当前播放的音乐
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }
        
        if (musicType === 'none') {
            this.currentMusicName = 'none';
        } else if (this.musicFiles[musicType]) {
            this.currentMusic = new Audio(this.musicFiles[musicType]);
            this.currentMusic.loop = true;
            this.currentMusic.volume = this.musicVolume;
            
            // 立即播放音乐进行预览
            this.currentMusic.play().then(() => {
                console.log(`正在播放: ${this.getMusicDisplayName(musicType)}`);
            }).catch(error => {
                console.error('音乐播放失败:', error);
                console.error('文件路径:', this.musicFiles[musicType]);
                alert(`音乐播放失败: ${error.message}\n请检查音频文件是否存在`);
            });
            
            this.currentMusicName = musicType;
        }
        
        this.updateMusicSelection();
    }
    
    updateMusicSelection() {
        // 更新音乐选择状态显示
        document.querySelectorAll('.music-option-card').forEach(card => {
            const musicType = card.getAttribute('data-music');
            const statusElement = card.querySelector('.music-status');
            
            if (statusElement) {
                if (musicType === this.currentMusicName) {
                    statusElement.textContent = '✓';
                    statusElement.style.color = '#4CAF50';
                    card.classList.add('selected');
                } else {
                    statusElement.textContent = '○';
                    statusElement.style.color = '';
                    card.classList.remove('selected');
                }
            }
        });
    }
    
    // 获取音乐显示名称
    getMusicDisplayName(musicType) {
        return this.musicNames[musicType] || musicType;
    }
    
    // 获取所有可用音乐列表
    getAvailableMusic() {
        return Object.keys(this.musicFiles);
    }
    
    // 停止所有音乐
    stopAllMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }
        this.currentMusicName = 'none';
    }
}

// 创建全局音乐管理器实例
const musicManager = new MusicManager();

// 导出全局函数供HTML调用
function openMusicSettings() {
    musicManager.openMusicSettings();
}

function closeMusicSettings() {
    musicManager.closeMusicSettings();
}

function selectMusic(musicType) {
    musicManager.selectMusic(musicType);
}

function selectMusicFromModal(musicType) {
    musicManager.selectMusicFromModal(musicType);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化音乐控件事件监听器
    musicManager.initEventListeners();
    
    // 如果有保存的音乐设置，自动播放
    if (musicManager.currentMusicName && musicManager.currentMusicName !== 'none') {
        musicManager.selectMusic(musicManager.currentMusicName);
    }
});