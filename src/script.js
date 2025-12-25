/**
 * Music Summary - Main Script
 * 音乐总结工具核心逻辑
 * 支持 3840x2160 (4K) 输出
 */

// ============================================
// Global Variables & State
// ============================================
let currentTheme = 'dark';
let currentCoverUrl = null;
let totalDuration = 225; // 默认 3:45
let currentPalette = [];
let albumPalette = []; // 保存从专辑封面提取的颜色

// DOM Element References
const elements = {};

// Available system fonts
let availableFonts = [];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadSystemFonts();
    initializeEventListeners();
    loadSettings();
    setTheme('dark');
    updatePreviewScale();
    generateDefaultCover();
    renderInkBackground();
    updateLyrics();
    updateReviewDisplay();
    
    window.addEventListener('resize', updatePreviewScale);
});

function initializeElements() {
    // Sidebar elements
    elements.audioInput = document.getElementById('audioInput');
    elements.coverInput = document.getElementById('coverInput');
    elements.audioFileName = document.getElementById('audioFileName');
    elements.coverFileName = document.getElementById('coverFileName');
    
    elements.trackTitle = document.getElementById('trackTitle');
    elements.artistName = document.getElementById('artistName');
    elements.lyricsInput = document.getElementById('lyricsInput');
    
    elements.showLyrics = document.getElementById('showLyrics');
    elements.showTranslation = document.getElementById('showTranslation');
    elements.showAlbumArt = document.getElementById('showAlbumArt');
    elements.showProgressBar = document.getElementById('showProgressBar');
    elements.showMetadata = document.getElementById('showMetadata');
    elements.showReview = document.getElementById('showReview');
    
    elements.progressSlider = document.getElementById('progressSlider');
    elements.currentTime = document.getElementById('currentTime');
    elements.totalTime = document.getElementById('totalTime');
    
    elements.reviewContent = document.getElementById('reviewContent');
    elements.reviewAuthor = document.getElementById('reviewAuthor');
    elements.reviewDate = document.getElementById('reviewDate');
    
    // Style sliders
    elements.coverSize = document.getElementById('coverSize');
    elements.titleFontSize = document.getElementById('titleFontSize');
    elements.artistFontSize = document.getElementById('artistFontSize');
    elements.lyricsFontSize = document.getElementById('lyricsFontSize');
    elements.translationFontSize = document.getElementById('translationFontSize');
    elements.reviewFontSize = document.getElementById('reviewFontSize');
    elements.lyricsLines = document.getElementById('lyricsLines');
    elements.borderRadius = document.getElementById('borderRadius');
    elements.blurStrength = document.getElementById('blurStrength');
    
    // Style value displays
    elements.coverSizeValue = document.getElementById('coverSizeValue');
    elements.titleFontSizeValue = document.getElementById('titleFontSizeValue');
    elements.artistFontSizeValue = document.getElementById('artistFontSizeValue');
    elements.lyricsFontSizeValue = document.getElementById('lyricsFontSizeValue');
    elements.translationFontSizeValue = document.getElementById('translationFontSizeValue');
    elements.reviewFontSizeValue = document.getElementById('reviewFontSizeValue');
    elements.lyricsLinesValue = document.getElementById('lyricsLinesValue');
    elements.borderRadiusValue = document.getElementById('borderRadiusValue');
    elements.blurStrengthValue = document.getElementById('blurStrengthValue');
    
    // Layout/Edit mode elements
    elements.editModeToggle = document.getElementById('editModeToggle');
    elements.metadataAlign = document.getElementById('metadataAlign');
    elements.lyricsAlign = document.getElementById('lyricsAlign');
    elements.leftColumnX = document.getElementById('leftColumnX');
    elements.leftColumnY = document.getElementById('leftColumnY');
    elements.rightColumnX = document.getElementById('rightColumnX');
    elements.rightColumnY = document.getElementById('rightColumnY');
    elements.leftColumnXValue = document.getElementById('leftColumnXValue');
    elements.leftColumnYValue = document.getElementById('leftColumnYValue');
    elements.rightColumnXValue = document.getElementById('rightColumnXValue');
    elements.rightColumnYValue = document.getElementById('rightColumnYValue');
    
    // Font selectors
    elements.titleFont = document.getElementById('titleFont');
    elements.artistFont = document.getElementById('artistFont');
    elements.lyricsFont = document.getElementById('lyricsFont');
    elements.translationFont = document.getElementById('translationFont');
    elements.reviewFont = document.getElementById('reviewFont');
    
    elements.exportBtn = document.getElementById('exportBtn');
    elements.refreshBgBtn = document.getElementById('refreshBgBtn');
    
    // Preview elements
    elements.previewContainer = document.getElementById('previewContainer');
    elements.bgLayer = document.getElementById('bgLayer');
    elements.dynamicBg = document.getElementById('dynamicBg');
    elements.overlayLayer = document.getElementById('overlayLayer');
    
    elements.leftColumn = document.getElementById('leftColumn');
    elements.rightColumn = document.getElementById('rightColumn');
    
    elements.albumArt = document.getElementById('albumArt');
    elements.albumArtContainer = document.getElementById('albumArtContainer');
    
    elements.displayTitle = document.getElementById('displayTitle');
    elements.displayArtist = document.getElementById('displayArtist');
    
    elements.lyricsContainer = document.getElementById('lyricsContainer');
    elements.lyricsPanel = document.getElementById('lyricsPanel');
    
    elements.progressBarFill = document.getElementById('progressBarFill');
    elements.displayCurrentTime = document.getElementById('displayCurrentTime');
    elements.displayTotalTime = document.getElementById('displayTotalTime');
    elements.progressPanel = document.getElementById('progressPanel');
    elements.metadataPanel = document.getElementById('metadataPanel');
    
    elements.reviewPanel = document.getElementById('reviewPanel');
    elements.displayReviewContent = document.getElementById('displayReviewContent');
    elements.displayReviewAuthor = document.getElementById('displayReviewAuthor');
    elements.displayReviewDate = document.getElementById('displayReviewDate');
    
    elements.scaleValue = document.getElementById('scaleValue');
}

// ============================================
// System Font Detection
// ============================================
function loadSystemFonts() {
    // Common fonts that are likely to be available on the system
    const commonFonts = [
        // Default
        'sans-serif',
        'serif',
        'monospace',
        // Windows fonts
        'Microsoft YaHei',
        'SimHei',
        'SimSun',
        'KaiTi',
        'FangSong',
        'YouYuan',
        'STXingkai',
        'STCaiyun',
        'STHupo',
        'STLiti',
        // macOS fonts
        'PingFang SC',
        'Hiragino Sans GB',
        'STHeiti',
        'STSong',
        'STKaiti',
        // Common fonts
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Georgia',
        'Verdana',
        'Trebuchet MS',
        // Chinese artistic fonts
        'Ma Shan Zheng',
        'ZCOOL XiaoWei',
        'ZCOOL QingKe HuangYou',
        'Noto Sans SC',
        'Noto Serif SC',
        'Source Han Sans SC',
        'Source Han Serif SC'
    ];
    
    // Use document.fonts API if available
    if (document.fonts && document.fonts.check) {
        availableFonts = commonFonts.filter(font => {
            try {
                return document.fonts.check(`12px "${font}"`);
            } catch (e) {
                return false;
            }
        });
    } else {
        // Fallback: assume common fonts are available
        availableFonts = commonFonts.slice(0, 15);
    }
    
    // Ensure at least basic fonts
    if (availableFonts.length === 0) {
        availableFonts = ['sans-serif', 'serif', 'monospace'];
    }
    
    // Populate font selectors
    populateFontSelectors();
}

function populateFontSelectors() {
    const fontSelectors = [
        elements.titleFont,
        elements.artistFont,
        elements.lyricsFont,
        elements.translationFont,
        elements.reviewFont
    ];
    
    fontSelectors.forEach(selector => {
        if (!selector) return;
        
        selector.innerHTML = '';
        availableFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font;
            selector.appendChild(option);
        });
    });
    
    // Set defaults
    if (elements.titleFont) elements.titleFont.value = 'Microsoft YaHei';
    if (elements.artistFont) elements.artistFont.value = 'Microsoft YaHei';
    if (elements.lyricsFont) elements.lyricsFont.value = 'Microsoft YaHei';
    if (elements.translationFont) elements.translationFont.value = 'Microsoft YaHei';
    if (elements.reviewFont) {
        // Try to set artistic font for review
        const artisticFonts = ['Ma Shan Zheng', 'KaiTi', 'STKaiti', 'STXingkai'];
        const found = artisticFonts.find(f => availableFonts.includes(f));
        elements.reviewFont.value = found || 'serif';
    }
}

function initializeEventListeners() {
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setTheme(btn.dataset.theme);
        });
    });
    
    // File inputs
    elements.audioInput.addEventListener('change', handleAudioUpload);
    elements.coverInput.addEventListener('change', handleCoverUpload);
    
    // Text inputs - live update
    elements.trackTitle.addEventListener('input', updateDisplayText);
    elements.artistName.addEventListener('input', updateDisplayText);
    elements.lyricsInput.addEventListener('input', updateLyrics);
    
    elements.reviewContent.addEventListener('input', updateReviewDisplay);
    elements.reviewAuthor.addEventListener('input', updateReviewDisplay);
    elements.reviewDate.addEventListener('input', updateReviewDisplay);
    
    // Checkbox inputs
    elements.showLyrics.addEventListener('change', updateVisibility);
    elements.showTranslation.addEventListener('change', updateLyrics);
    elements.showAlbumArt.addEventListener('change', updateVisibility);
    elements.showProgressBar.addEventListener('change', updateVisibility);
    elements.showMetadata.addEventListener('change', updateVisibility);
    elements.showReview.addEventListener('change', updateVisibility);
    
    // Progress slider
    elements.progressSlider.addEventListener('input', updateProgress);
    
    // Style sliders
    elements.coverSize.addEventListener('input', updateStyles);
    elements.titleFontSize.addEventListener('input', updateStyles);
    elements.artistFontSize.addEventListener('input', updateStyles);
    elements.lyricsFontSize.addEventListener('input', updateStyles);
    elements.translationFontSize.addEventListener('input', updateStyles);
    elements.reviewFontSize.addEventListener('input', updateStyles);
    elements.lyricsLines.addEventListener('input', () => { updateStyles(); updateLyrics(); });
    elements.borderRadius.addEventListener('input', updateStyles);
    elements.blurStrength.addEventListener('input', updateStyles);
    
    // Layout/Edit mode controls
    elements.editModeToggle.addEventListener('change', toggleEditMode);
    elements.metadataAlign.addEventListener('change', updateAlignment);
    elements.lyricsAlign.addEventListener('change', updateAlignment);
    elements.leftColumnX.addEventListener('input', updateLayout);
    elements.leftColumnY.addEventListener('input', updateLayout);
    elements.rightColumnX.addEventListener('input', updateLayout);
    elements.rightColumnY.addEventListener('input', updateLayout);
    
    // Font selectors
    elements.titleFont.addEventListener('change', updateFonts);
    elements.artistFont.addEventListener('change', updateFonts);
    elements.lyricsFont.addEventListener('change', updateFonts);
    elements.translationFont.addEventListener('change', updateFonts);
    elements.reviewFont.addEventListener('change', updateFonts);
    
    // Export and refresh buttons
    elements.exportBtn.addEventListener('click', exportScreenshot);
    elements.refreshBgBtn.addEventListener('click', () => {
        if (currentTheme === 'light') {
            // Use album colors if available, otherwise random
            if (albumPalette.length > 0) {
                renderInkBackground(albumPalette);
            } else {
                refreshInkColors();
            }
        } else {
            // Re-render dynamic background
            if (currentCoverUrl) {
                elements.dynamicBg.style.backgroundImage = `url(${currentCoverUrl})`;
            }
        }
    });
}

// ============================================
// Theme Management
// ============================================
function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
        // Use album colors if available, otherwise random
        if (albumPalette.length > 0) {
            renderInkBackground(albumPalette);
        } else {
            renderInkBackground();
        }
    } else {
        // Dark theme uses dynamic blur
        if (currentCoverUrl) {
            elements.dynamicBg.style.backgroundImage = `url(${currentCoverUrl})`;
        }
    }
}

// ============================================
// File Upload Handlers
// ============================================
function resetAllMetadata() {
    // Reset text fields
    elements.trackTitle.value = '';
    elements.artistName.value = '';
    elements.lyricsInput.value = '';
    elements.reviewContent.value = '';
    elements.reviewAuthor.value = '';
    elements.reviewDate.value = '';
    
    // Reset file names
    elements.audioFileName.textContent = '未选择文件';
    elements.coverFileName.textContent = '未选择文件';
    
    // Reset duration
    totalDuration = 225;
    elements.progressSlider.value = 30;
    
    // Reset color palettes
    currentPalette = [];
    albumPalette = [];
    
    // Reset cover
    currentCoverUrl = null;
    
    // Update displays
    updateDisplayText();
    updateLyrics();
    updateReviewDisplay();
    updateProgress();
}

function handleAudioUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset all metadata when importing new song
    resetAllMetadata();
    
    elements.audioFileName.textContent = file.name;
    
    // Parse ID3 tags using jsmediatags
    jsmediatags.read(file, {
        onSuccess: function(tag) {
            const tags = tag.tags;
            console.log('ID3 Tags:', tags);
            
            // Set title
            if (tags.title) {
                elements.trackTitle.value = tags.title;
            }
            
            // Set artist
            if (tags.artist) {
                elements.artistName.value = tags.artist;
            }
            
            // Extract cover - always try to extract
            if (tags.picture) {
                const picture = tags.picture;
                console.log('Found picture:', picture.format, picture.data.length);
                
                // Convert to base64
                let base64String = '';
                const bytes = new Uint8Array(picture.data);
                for (let i = 0; i < bytes.length; i++) {
                    base64String += String.fromCharCode(bytes[i]);
                }
                base64String = window.btoa(base64String);
                
                // Determine MIME type
                let mimeType = picture.format;
                if (!mimeType || mimeType === '') {
                    // Try to detect from data
                    if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
                        mimeType = 'image/jpeg';
                    } else if (bytes[0] === 0x89 && bytes[1] === 0x50) {
                        mimeType = 'image/png';
                    } else {
                        mimeType = 'image/jpeg'; // default
                    }
                }
                
                const imageUrl = `data:${mimeType};base64,${base64String}`;
                setCoverImage(imageUrl);
                elements.coverFileName.textContent = '从音频提取';
            } else {
                // Generate default cover if no picture found
                generateDefaultCover();
            }
            
            // Extract lyrics if available
            if (tags.lyrics && tags.lyrics.lyrics) {
                elements.lyricsInput.value = tags.lyrics.lyrics;
                updateLyrics();
            } else if (tags.USLT && tags.USLT.data && tags.USLT.data.lyrics) {
                elements.lyricsInput.value = tags.USLT.data.lyrics;
                updateLyrics();
            }
            
            updateDisplayText();
        },
        onError: function(error) {
            console.log('Error reading ID3 tags:', error);
            generateDefaultCover();
        }
    });
    
    // Get audio duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
        totalDuration = audio.duration;
        updateTimeDisplay();
    });
}

function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    elements.coverFileName.textContent = file.name;
    const url = URL.createObjectURL(file);
    setCoverImage(url);
}

function setCoverImage(url) {
    currentCoverUrl = url;
    
    // Set cover image
    elements.albumArt.src = url;
    
    // Set dynamic background for dark theme
    if (currentTheme === 'dark') {
        elements.dynamicBg.style.backgroundImage = `url(${url})`;
    }
    
    // Extract colors for light theme
    extractColorsFromImage(url);
}

function extractColorsFromImage(url) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 5);
            currentPalette = palette;
            albumPalette = palette; // Save album colors for refresh
            
            if (currentTheme === 'light') {
                renderInkBackground(palette);
            }
        } catch (e) {
            console.log('Error extracting colors:', e);
        }
    };
    img.src = url;
}

function generateDefaultCover() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 800);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);
    
    // Add simple music icon (no emoji)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    // Draw music note shape
    ctx.moveTo(320, 550);
    ctx.lineTo(320, 250);
    ctx.lineTo(520, 200);
    ctx.lineTo(520, 500);
    ctx.stroke();
    // Draw note heads
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(280, 560, 60, 40, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(480, 510, 60, 40, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    const url = canvas.toDataURL();
    setCoverImage(url);
}

// ============================================
// Display Updates
// ============================================
function updateDisplayText() {
    const title = elements.trackTitle.value || '歌曲名称';
    const artist = elements.artistName.value || '艺术家';
    
    elements.displayTitle.textContent = title;
    elements.displayArtist.textContent = artist;
}

function updateLyrics() {
    const lyricsText = elements.lyricsInput.value;
    const showTranslation = elements.showTranslation.checked;
    const progress = elements.progressSlider.value / 100;
    const currentTimeSeconds = progress * totalDuration;
    
    const parsedLyrics = parseLyrics(lyricsText);
    const html = renderLyricsHTML(parsedLyrics, currentTimeSeconds, showTranslation);
    
    elements.lyricsContainer.innerHTML = html;
    
    // Apply font and size settings to newly rendered lyrics
    applyLyricsStyles();
}

function applyLyricsStyles() {
    // Apply lyrics font size
    const lyricsFontSize = elements.lyricsFontSize.value + 'px';
    document.querySelectorAll('.lyric-text').forEach(el => {
        if (!el.classList.contains('current')) {
            el.style.fontSize = lyricsFontSize;
        }
    });
    document.querySelectorAll('.lyric-text.current').forEach(el => {
        el.style.fontSize = (parseInt(elements.lyricsFontSize.value) + 4) + 'px';
    });
    
    // Apply translation font size
    const translationFontSize = elements.translationFontSize.value + 'px';
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.fontSize = translationFontSize;
    });
    
    // Apply lyrics font
    const lyricsFont = elements.lyricsFont.value;
    document.querySelectorAll('.lyric-text').forEach(el => {
        el.style.fontFamily = `"${lyricsFont}", sans-serif`;
    });
    
    // Apply translation font
    const translationFont = elements.translationFont.value;
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.fontFamily = `"${translationFont}", sans-serif`;
    });
}

function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    const lyrics = [];
    let currentLyric = null;
    
    for (const line of lines) {
        // Match LRC format [mm:ss.xx] or [mm:ss]
        const timeMatch = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/);
        
        if (timeMatch) {
            const minutes = parseInt(timeMatch[1]);
            const seconds = parseInt(timeMatch[2]);
            const ms = timeMatch[3] ? parseInt(timeMatch[3].padEnd(3, '0')) : 0;
            const time = minutes * 60 + seconds + ms / 1000;
            const text = timeMatch[4].trim();
            
            if (text) {
                // Check if this is a translation (follows a lyric closely)
                if (currentLyric && Math.abs(currentLyric.time - time) < 0.5 && !currentLyric.translation) {
                    currentLyric.translation = text;
                } else {
                    currentLyric = { time, text, translation: '' };
                    lyrics.push(currentLyric);
                }
            }
        } else if (line.trim() && currentLyric && !currentLyric.translation) {
            // Non-timestamped line might be translation
            currentLyric.translation = line.trim();
        }
    }
    
    return lyrics;
}

function renderLyricsHTML(lyrics, currentTime, showTranslation) {
    if (lyrics.length === 0) {
        return `<div class="lyric-line">
            <p class="lyric-text">暂无歌词</p>
        </div>`;
    }
    
    // Get max lines from slider
    const maxLines = parseInt(elements.lyricsLines.value) || 4;
    
    // Find current lyric index
    let currentIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime) {
            currentIndex = i;
        }
    }
    
    // Show lyrics around current position based on maxLines setting
    const linesBeforeCurrent = Math.floor(maxLines / 4); // Show about 1/4 of lines before current
    const startIndex = Math.max(0, currentIndex - linesBeforeCurrent);
    const endIndex = Math.min(lyrics.length, startIndex + maxLines);
    
    let html = '';
    for (let i = startIndex; i < endIndex; i++) {
        const lyric = lyrics[i];
        const isCurrent = i === currentIndex;
        
        html += `<div class="lyric-line">
            <p class="lyric-text ${isCurrent ? 'current' : ''}">${lyric.text}</p>
            ${showTranslation && lyric.translation ? `<p class="lyric-translation">${lyric.translation}</p>` : ''}
        </div>`;
    }
    
    return html;
}

function updateReviewDisplay() {
    const content = elements.reviewContent.value || '在这里输入您对这首歌曲的评价...';
    const author = elements.reviewAuthor.value || '署名';
    const date = elements.reviewDate.value || new Date().toLocaleDateString('zh-CN').replace(/\//g, '.');
    
    elements.displayReviewContent.textContent = content;
    elements.displayReviewAuthor.textContent = author;
    elements.displayReviewDate.textContent = date;
}

function updateProgress() {
    const progress = elements.progressSlider.value;
    
    // Update progress bar
    elements.progressBarFill.style.width = `${progress}%`;
    
    // Update time display
    updateTimeDisplay();
    
    // Update lyrics position
    updateLyrics();
}

function updateTimeDisplay() {
    const progress = elements.progressSlider.value / 100;
    const currentSeconds = Math.floor(progress * totalDuration);
    const totalSeconds = Math.floor(totalDuration);
    
    const currentFormatted = formatTime(currentSeconds);
    const totalFormatted = formatTime(totalSeconds);
    
    elements.currentTime.textContent = currentFormatted;
    elements.totalTime.textContent = totalFormatted;
    elements.displayCurrentTime.textContent = currentFormatted;
    elements.displayTotalTime.textContent = totalFormatted;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateVisibility() {
    // Lyrics
    const showLyrics = elements.showLyrics.checked;
    elements.lyricsPanel.style.display = showLyrics ? '' : 'none';
    
    // Album art
    const showAlbumArt = elements.showAlbumArt.checked;
    elements.albumArtContainer.style.display = showAlbumArt ? '' : 'none';
    
    // Progress bar
    const showProgressBar = elements.showProgressBar.checked;
    elements.progressPanel.style.display = showProgressBar ? '' : 'none';
    
    // Metadata
    const showMetadata = elements.showMetadata.checked;
    elements.metadataPanel.style.display = showMetadata ? '' : 'none';
    
    // Review
    const showReview = elements.showReview.checked;
    elements.reviewPanel.style.display = showReview ? '' : 'none';
}

function updateStyles() {
    // Update value displays
    elements.coverSizeValue.textContent = elements.coverSize.value;
    elements.titleFontSizeValue.textContent = elements.titleFontSize.value;
    elements.artistFontSizeValue.textContent = elements.artistFontSize.value;
    elements.lyricsFontSizeValue.textContent = elements.lyricsFontSize.value;
    elements.translationFontSizeValue.textContent = elements.translationFontSize.value;
    elements.reviewFontSizeValue.textContent = elements.reviewFontSize.value;
    elements.lyricsLinesValue.textContent = elements.lyricsLines.value;
    elements.borderRadiusValue.textContent = elements.borderRadius.value;
    elements.blurStrengthValue.textContent = elements.blurStrength.value;
    
    // Apply cover size (also update progress bar width)
    const coverSize = elements.coverSize.value + 'px';
    elements.albumArtContainer.style.width = coverSize;
    elements.albumArtContainer.style.height = coverSize;
    elements.progressPanel.style.width = coverSize;
    
    // Apply title font size
    const titleFontSize = elements.titleFontSize.value + 'px';
    elements.displayTitle.style.fontSize = titleFontSize;
    
    // Apply artist font size
    const artistFontSize = elements.artistFontSize.value + 'px';
    elements.displayArtist.style.fontSize = artistFontSize;
    
    // Apply lyrics font size
    const lyricsFontSize = elements.lyricsFontSize.value + 'px';
    document.querySelectorAll('.lyric-text').forEach(el => {
        if (!el.classList.contains('current')) {
            el.style.fontSize = lyricsFontSize;
        }
    });
    document.querySelectorAll('.lyric-text.current').forEach(el => {
        el.style.fontSize = (parseInt(elements.lyricsFontSize.value) + 4) + 'px';
    });
    
    // Apply translation font size
    const translationFontSize = elements.translationFontSize.value + 'px';
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.fontSize = translationFontSize;
    });
    
    // Apply review font size
    const reviewFontSize = elements.reviewFontSize.value + 'px';
    elements.displayReviewContent.style.fontSize = reviewFontSize;
    
    // Apply border radius
    const borderRadius = elements.borderRadius.value + 'px';
    elements.albumArtContainer.style.borderRadius = borderRadius;
    
    // Apply blur strength
    const blurStrength = elements.blurStrength.value + 'px';
    elements.dynamicBg.style.filter = `blur(${blurStrength})`;
    elements.overlayLayer.style.backdropFilter = `blur(${parseInt(blurStrength) * 0.75}px)`;
}

function updateLayout() {
    // Update value displays
    elements.leftColumnXValue.textContent = elements.leftColumnX.value;
    elements.leftColumnYValue.textContent = elements.leftColumnY.value;
    elements.rightColumnXValue.textContent = elements.rightColumnX.value;
    elements.rightColumnYValue.textContent = elements.rightColumnY.value;
    
    // Apply position offsets
    const leftX = parseInt(elements.leftColumnX.value);
    const leftY = parseInt(elements.leftColumnY.value);
    const rightX = parseInt(elements.rightColumnX.value);
    const rightY = parseInt(elements.rightColumnY.value);
    
    elements.leftColumn.style.transform = `translate(${leftX}px, ${leftY}px)`;
    elements.rightColumn.style.transform = `translate(${rightX}px, ${rightY}px)`;
}

function updateAlignment() {
    // Metadata alignment
    const metadataAlign = elements.metadataAlign.value;
    elements.metadataPanel.classList.remove('align-left', 'align-center');
    elements.metadataPanel.classList.add(`align-${metadataAlign}`);
    elements.metadataPanel.style.textAlign = metadataAlign;
    
    // Lyrics alignment
    const lyricsAlign = elements.lyricsAlign.value;
    elements.lyricsPanel.classList.remove('align-left', 'align-center');
    elements.lyricsPanel.classList.add(`align-${lyricsAlign}`);
    elements.lyricsContainer.style.textAlign = lyricsAlign;
}

function toggleEditMode() {
    const editMode = elements.editModeToggle.checked;
    elements.previewContainer.classList.toggle('edit-mode', editMode);
    
    if (editMode) {
        // Add visual indicators for edit mode
        elements.leftColumn.style.outline = '2px dashed rgba(255, 100, 100, 0.5)';
        elements.rightColumn.style.outline = '2px dashed rgba(100, 100, 255, 0.5)';
    } else {
        elements.leftColumn.style.outline = '';
        elements.rightColumn.style.outline = '';
    }
}

function updateFonts() {
    // Apply title font
    const titleFont = elements.titleFont.value;
    elements.displayTitle.style.fontFamily = `"${titleFont}", sans-serif`;
    
    // Apply artist font
    const artistFont = elements.artistFont.value;
    elements.displayArtist.style.fontFamily = `"${artistFont}", sans-serif`;
    
    // Apply lyrics font
    const lyricsFont = elements.lyricsFont.value;
    document.querySelectorAll('.lyric-text').forEach(el => {
        el.style.fontFamily = `"${lyricsFont}", sans-serif`;
    });
    
    // Apply translation font
    const translationFont = elements.translationFont.value;
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.fontFamily = `"${translationFont}", sans-serif`;
    });
    
    // Apply review font
    const reviewFont = elements.reviewFont.value;
    elements.displayReviewContent.style.fontFamily = `"${reviewFont}", serif`;
}

// ============================================
// Preview Scaling
// ============================================
function updatePreviewScale() {
    const container = elements.previewContainer;
    const wrapper = container.parentElement;
    
    // Get available space
    const availableWidth = wrapper.clientWidth - 40;
    const availableHeight = wrapper.clientHeight - 40;
    
    // Calculate scale to fit 3840x2160 into available space
    const scaleX = availableWidth / 3840;
    const scaleY = availableHeight / 2160;
    const scale = Math.min(scaleX, scaleY, 1);
    
    container.style.transform = `scale(${scale})`;
    elements.scaleValue.textContent = `${Math.round(scale * 100)}%`;
}

// ============================================
// Ink Background (Light Theme)
// ============================================
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function brightenInkColor(rgb) {
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    
    // Brighten colors more aggressively for light mode
    let newL;
    if (l < 0.3) {
        // Very dark colors - brighten very significantly
        newL = 0.65 + (l * 0.3);
    } else if (l < 0.5) {
        // Dark colors - brighten significantly
        newL = 0.6 + (l * 0.25);
    } else if (l < 0.7) {
        // Medium colors - brighten moderately
        newL = 0.65 + (l * 0.2);
    } else {
        // Already bright - keep bright
        newL = Math.max(0.7, Math.min(0.88, l));
    }
    
    // Reduce saturation slightly for softer pastel look
    const newS = Math.min(0.8, s * 0.85);
    
    return hslToRgb(h, newS, newL);
}

function pickRandomInkPalette(count = 5) {
    const palette = [];
    const used = new Set();
    while (palette.length < count && used.size < colorLibrary.length) {
        const idx = Math.floor(Math.random() * colorLibrary.length);
        if (used.has(idx)) continue;
        used.add(idx);
        palette.push(colorLibrary[idx]);
    }
    return palette;
}

function renderInkBackground(palette, options = {}) {
    const { alreadyBright = false } = options;
    
    // Use provided palette or current/random
    let basePalette;
    if (palette && palette.length) {
        basePalette = palette;
    } else if (currentPalette.length) {
        basePalette = currentPalette;
    } else {
        basePalette = pickRandomInkPalette(5);
    }
    
    const brightPalette = alreadyBright ? basePalette : basePalette.map(brightenInkColor);
    currentPalette = brightPalette;
    
    const gradients = [];
    const mainDrops = 22;
    const hazeLayers = 5;
    
    // Generate main ink drops
    for (let i = 0; i < mainDrops; i++) {
        const color = brightPalette[i % brightPalette.length];
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        const size = Math.floor(Math.random() * 24) + 32;
        const opacity = (Math.random() * 0.1 + 0.14).toFixed(2);
        
        gradients.push(
            `radial-gradient(circle at ${posX}% ${posY}%, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity}) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) ${size}%)`
        );
    }
    
    // Generate haze layers
    for (let i = 0; i < hazeLayers; i++) {
        const color = brightPalette[i % brightPalette.length];
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        const size = Math.floor(Math.random() * 45) + 75;
        const opacity = (Math.random() * 0.06 + 0.05).toFixed(2);
        
        gradients.push(
            `radial-gradient(circle at ${posX}% ${posY}%, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity}) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) ${size}%)`
        );
    }
    
    elements.bgLayer.style.backgroundColor = '#F2EFE4';
    elements.bgLayer.style.backgroundImage = gradients.join(', ');
    elements.bgLayer.style.backgroundSize = '100% 100%';
}

function refreshInkColors() {
    const randomPalette = pickRandomInkPalette(5);
    renderInkBackground(randomPalette);
}

// ============================================
// Export Screenshot
// ============================================
async function exportScreenshot() {
    const btn = elements.exportBtn;
    const originalText = btn.textContent;
    btn.textContent = '正在生成...';
    btn.disabled = true;
    
    try {
        // Store original transform and remove for capture
        const container = elements.previewContainer;
        const originalTransform = container.style.transform;
        container.style.transform = 'none';
        
        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture with html2canvas at exact 3840x2160
        const canvas = await html2canvas(container, {
            width: 3840,
            height: 2160,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false,
            windowWidth: 3840,
            windowHeight: 2160
        });
        
        // Restore transform
        container.style.transform = originalTransform;
        
        // Create download link
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const title = elements.trackTitle.value || 'music_summary';
        link.download = `${title}_${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        btn.textContent = '导出成功!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Export failed:', error);
        btn.textContent = '导出失败';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

// ============================================
// Settings Persistence
// ============================================
function saveSettings() {
    const settings = {
        coverSize: elements.coverSize.value,
        titleFontSize: elements.titleFontSize.value,
        artistFontSize: elements.artistFontSize.value,
        lyricsFontSize: elements.lyricsFontSize.value,
        translationFontSize: elements.translationFontSize.value,
        reviewFontSize: elements.reviewFontSize.value,
        lyricsLines: elements.lyricsLines.value,
        borderRadius: elements.borderRadius.value,
        blurStrength: elements.blurStrength.value,
        showLyrics: elements.showLyrics.checked,
        showTranslation: elements.showTranslation.checked,
        showAlbumArt: elements.showAlbumArt.checked,
        showProgressBar: elements.showProgressBar.checked,
        showMetadata: elements.showMetadata.checked,
        showReview: elements.showReview.checked,
        theme: currentTheme,
        // Font settings
        titleFont: elements.titleFont.value,
        artistFont: elements.artistFont.value,
        lyricsFont: elements.lyricsFont.value,
        translationFont: elements.translationFont.value,
        reviewFont: elements.reviewFont.value,
        // Layout settings
        metadataAlign: elements.metadataAlign.value,
        lyricsAlign: elements.lyricsAlign.value,
        leftColumnX: elements.leftColumnX.value,
        leftColumnY: elements.leftColumnY.value,
        rightColumnX: elements.rightColumnX.value,
        rightColumnY: elements.rightColumnY.value
    };
    
    localStorage.setItem('musicSummarySettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('musicSummarySettings');
    if (!saved) return;
    
    try {
        const settings = JSON.parse(saved);
        
        // Apply slider values
        if (settings.coverSize) elements.coverSize.value = settings.coverSize;
        if (settings.titleFontSize) elements.titleFontSize.value = settings.titleFontSize;
        if (settings.artistFontSize) elements.artistFontSize.value = settings.artistFontSize;
        if (settings.lyricsFontSize) elements.lyricsFontSize.value = settings.lyricsFontSize;
        if (settings.translationFontSize) elements.translationFontSize.value = settings.translationFontSize;
        if (settings.reviewFontSize) elements.reviewFontSize.value = settings.reviewFontSize;
        if (settings.lyricsLines) elements.lyricsLines.value = settings.lyricsLines;
        if (settings.borderRadius) elements.borderRadius.value = settings.borderRadius;
        if (settings.blurStrength) elements.blurStrength.value = settings.blurStrength;
        
        // Apply checkbox values
        if (settings.showLyrics !== undefined) elements.showLyrics.checked = settings.showLyrics;
        if (settings.showTranslation !== undefined) elements.showTranslation.checked = settings.showTranslation;
        if (settings.showAlbumArt !== undefined) elements.showAlbumArt.checked = settings.showAlbumArt;
        if (settings.showProgressBar !== undefined) elements.showProgressBar.checked = settings.showProgressBar;
        if (settings.showMetadata !== undefined) elements.showMetadata.checked = settings.showMetadata;
        if (settings.showReview !== undefined) elements.showReview.checked = settings.showReview;
        
        // Apply font values
        if (settings.titleFont && availableFonts.includes(settings.titleFont)) {
            elements.titleFont.value = settings.titleFont;
        }
        if (settings.artistFont && availableFonts.includes(settings.artistFont)) {
            elements.artistFont.value = settings.artistFont;
        }
        if (settings.lyricsFont && availableFonts.includes(settings.lyricsFont)) {
            elements.lyricsFont.value = settings.lyricsFont;
        }
        if (settings.translationFont && availableFonts.includes(settings.translationFont)) {
            elements.translationFont.value = settings.translationFont;
        }
        if (settings.reviewFont && availableFonts.includes(settings.reviewFont)) {
            elements.reviewFont.value = settings.reviewFont;
        }
        
        // Apply layout settings
        if (settings.metadataAlign) elements.metadataAlign.value = settings.metadataAlign;
        if (settings.lyricsAlign) elements.lyricsAlign.value = settings.lyricsAlign;
        if (settings.leftColumnX) elements.leftColumnX.value = settings.leftColumnX;
        if (settings.leftColumnY) elements.leftColumnY.value = settings.leftColumnY;
        if (settings.rightColumnX) elements.rightColumnX.value = settings.rightColumnX;
        if (settings.rightColumnY) elements.rightColumnY.value = settings.rightColumnY;
        
        // Apply theme
        if (settings.theme) currentTheme = settings.theme;
        
        // Update displays
        updateStyles();
        updateFonts();
        updateVisibility();
        updateLayout();
        updateAlignment();
        
    } catch (e) {
        console.log('Error loading settings:', e);
    }
}

// Save settings on window close
window.addEventListener('beforeunload', saveSettings);
