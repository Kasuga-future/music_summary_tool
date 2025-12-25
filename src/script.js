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
let totalDuration = 205; // 默认 3:25
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
    updateStyles();
    updateElementPositions();
    updateAlignment();
    
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
    elements.titleArtistGap = document.getElementById('titleArtistGap');
    elements.metadataCoverGap = document.getElementById('metadataCoverGap');
    elements.coverProgressGap = document.getElementById('coverProgressGap');
    elements.titleFontSize = document.getElementById('titleFontSize');
    elements.artistFontSize = document.getElementById('artistFontSize');
    elements.lyricsFontSize = document.getElementById('lyricsFontSize');
    elements.translationFontSize = document.getElementById('translationFontSize');
    elements.reviewFontSize = document.getElementById('reviewFontSize');
    elements.reviewMetaFontSize = document.getElementById('reviewMetaFontSize');
    elements.lyricsLineGap = document.getElementById('lyricsLineGap');
    elements.lyricsHeight = document.getElementById('lyricsHeight');
    elements.lyricsFade = document.getElementById('lyricsFade');
    elements.reviewBoxWidth = document.getElementById('reviewBoxWidth');
    elements.reviewBoxHeight = document.getElementById('reviewBoxHeight');
    elements.reviewBgOpacity = document.getElementById('reviewBgOpacity');
    elements.borderRadius = document.getElementById('borderRadius');
    elements.blurStrength = document.getElementById('blurStrength');
    
    // Gray scale controls
    elements.titleGray = document.getElementById('titleGray');
    elements.artistGray = document.getElementById('artistGray');
    elements.lyricsGray = document.getElementById('lyricsGray');
    elements.translationGray = document.getElementById('translationGray');
    elements.reviewGray = document.getElementById('reviewGray');
    
    // Style value displays
    elements.coverSizeValue = document.getElementById('coverSizeValue');
    elements.titleArtistGapValue = document.getElementById('titleArtistGapValue');
    elements.metadataCoverGapValue = document.getElementById('metadataCoverGapValue');
    elements.coverProgressGapValue = document.getElementById('coverProgressGapValue');
    elements.titleFontSizeValue = document.getElementById('titleFontSizeValue');
    elements.artistFontSizeValue = document.getElementById('artistFontSizeValue');
    elements.lyricsFontSizeValue = document.getElementById('lyricsFontSizeValue');
    elements.translationFontSizeValue = document.getElementById('translationFontSizeValue');
    elements.reviewFontSizeValue = document.getElementById('reviewFontSizeValue');
    elements.reviewMetaFontSizeValue = document.getElementById('reviewMetaFontSizeValue');
    elements.lyricsLineGapValue = document.getElementById('lyricsLineGapValue');
    elements.lyricsHeightValue = document.getElementById('lyricsHeightValue');
    elements.lyricsFadeValue = document.getElementById('lyricsFadeValue');
    elements.reviewBoxWidthValue = document.getElementById('reviewBoxWidthValue');
    elements.reviewBoxHeightValue = document.getElementById('reviewBoxHeightValue');
    elements.reviewBgOpacityValue = document.getElementById('reviewBgOpacityValue');
    elements.borderRadiusValue = document.getElementById('borderRadiusValue');
    elements.progressBarHeight = document.getElementById('progressBarHeight');
    elements.progressBarHeightValue = document.getElementById('progressBarHeightValue');
    elements.progressTimeFontSize = document.getElementById('progressTimeFontSize');
    elements.progressTimeFontSizeValue = document.getElementById('progressTimeFontSizeValue');
    elements.blurStrengthValue = document.getElementById('blurStrengthValue');
    elements.titleGrayValue = document.getElementById('titleGrayValue');
    elements.artistGrayValue = document.getElementById('artistGrayValue');
    elements.lyricsGrayValue = document.getElementById('lyricsGrayValue');
    elements.translationGrayValue = document.getElementById('translationGrayValue');
    elements.reviewGrayValue = document.getElementById('reviewGrayValue');
    
    // Layout/Edit mode elements
    elements.editModeToggle = document.getElementById('editModeToggle');
    elements.metadataAlign = document.getElementById('metadataAlign');
    elements.lyricsAlign = document.getElementById('lyricsAlign');
    
    // Individual element position controls
    elements.metadataX = document.getElementById('metadataX');
    elements.metadataY = document.getElementById('metadataY');
    elements.coverX = document.getElementById('coverX');
    elements.coverY = document.getElementById('coverY');
    elements.progressX = document.getElementById('progressX');
    elements.progressY = document.getElementById('progressY');
    elements.lyricsX = document.getElementById('lyricsX');
    elements.lyricsY = document.getElementById('lyricsY');
    elements.reviewX = document.getElementById('reviewX');
    elements.reviewY = document.getElementById('reviewY');
    
    elements.metadataXValue = document.getElementById('metadataXValue');
    elements.metadataYValue = document.getElementById('metadataYValue');
    elements.coverXValue = document.getElementById('coverXValue');
    elements.coverYValue = document.getElementById('coverYValue');
    elements.progressXValue = document.getElementById('progressXValue');
    elements.progressYValue = document.getElementById('progressYValue');
    elements.lyricsXValue = document.getElementById('lyricsXValue');
    elements.lyricsYValue = document.getElementById('lyricsYValue');
    elements.reviewXValue = document.getElementById('reviewXValue');
    elements.reviewYValue = document.getElementById('reviewYValue');
    
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
    
    // Set data labels for edit mode
    elements.metadataPanel.setAttribute('data-label', '标题/歌手');
    elements.albumArtContainer.setAttribute('data-label', '专辑封面');
    elements.progressPanel.setAttribute('data-label', '进度条');
    elements.lyricsPanel.setAttribute('data-label', '歌词');
    elements.reviewPanel.setAttribute('data-label', '评价');
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
    elements.titleArtistGap.addEventListener('input', updateStyles);
    elements.metadataCoverGap.addEventListener('input', updateStyles);
    elements.coverProgressGap.addEventListener('input', updateStyles);
    elements.titleFontSize.addEventListener('input', updateStyles);
    elements.artistFontSize.addEventListener('input', updateStyles);
    elements.lyricsFontSize.addEventListener('input', updateStyles);
    elements.translationFontSize.addEventListener('input', updateStyles);
    elements.reviewFontSize.addEventListener('input', updateStyles);
    elements.lyricsLineGap.addEventListener('input', () => { updateStyles(); updateLyrics(); });
    elements.lyricsHeight.addEventListener('input', updateStyles);
    elements.lyricsFade.addEventListener('input', updateStyles);
    elements.reviewBoxWidth.addEventListener('input', updateStyles);
    elements.reviewBoxHeight.addEventListener('input', updateStyles);
    elements.reviewBgOpacity.addEventListener('input', updateStyles);
    elements.borderRadius.addEventListener('input', updateStyles);
    elements.progressBarHeight.addEventListener('input', updateStyles);
    elements.progressTimeFontSize.addEventListener('input', updateStyles);
    elements.reviewMetaFontSize.addEventListener('input', updateStyles);
    elements.blurStrength.addEventListener('input', updateStyles);
    elements.titleGray.addEventListener('input', updateStyles);
    elements.artistGray.addEventListener('input', updateStyles);
    elements.lyricsGray.addEventListener('input', updateStyles);
    elements.translationGray.addEventListener('input', updateStyles);
    elements.reviewGray.addEventListener('input', updateStyles);
    
    // Layout/Edit mode controls
    elements.editModeToggle.addEventListener('change', toggleEditMode);
    elements.metadataAlign.addEventListener('change', updateAlignment);
    elements.lyricsAlign.addEventListener('change', updateAlignment);
    
    // Individual element position controls
    elements.metadataX.addEventListener('input', updateElementPositions);
    elements.metadataY.addEventListener('input', updateElementPositions);
    elements.coverX.addEventListener('input', updateElementPositions);
    elements.coverY.addEventListener('input', updateElementPositions);
    elements.progressX.addEventListener('input', updateElementPositions);
    elements.progressY.addEventListener('input', updateElementPositions);
    elements.lyricsX.addEventListener('input', updateElementPositions);
    elements.lyricsY.addEventListener('input', updateElementPositions);
    elements.reviewX.addEventListener('input', updateElementPositions);
    elements.reviewY.addEventListener('input', updateElementPositions);
    
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
        // Set light theme gray values: 标题50、歌手90、歌词10、翻译90、评价50
        elements.titleGray.value = 50;
        elements.artistGray.value = 90;
        elements.lyricsGray.value = 10;
        elements.translationGray.value = 90;
        elements.reviewGray.value = 50;
    } else {
        // Dark theme uses dynamic blur
        if (currentCoverUrl) {
            elements.dynamicBg.style.backgroundImage = `url(${currentCoverUrl})`;
        }
        // Set dark theme gray values (bright text)
        elements.titleGray.value = 255;
        elements.artistGray.value = 180;
        elements.lyricsGray.value = 255;
        elements.translationGray.value = 180;
        elements.reviewGray.value = 220;
    }
    
    // Update review panel background opacity for theme
    updateStyles();
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
    
    // Center current lyric in the container
    centerCurrentLyric();
}

function centerCurrentLyric() {
    const container = elements.lyricsContainer;
    const panel = elements.lyricsPanel;
    const currentLine = container.querySelector('.current-line');
    
    if (!currentLine) return;
    
    // Get panel height
    const panelHeight = panel.clientHeight;
    
    // Calculate offset to center current lyric
    const currentLineTop = currentLine.offsetTop;
    const currentLineHeight = currentLine.offsetHeight;
    const centerOffset = currentLineTop - (panelHeight / 2) + (currentLineHeight / 2);
    
    // Apply transform to container to scroll
    container.style.transform = `translateY(${-centerOffset}px)`;
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
    
    // Apply line gap
    const lineGap = elements.lyricsLineGap.value + 'px';
    elements.lyricsContainer.style.gap = lineGap;
    
    // Apply gray scale
    const lyricsGray = elements.lyricsGray.value;
    const translationGray = elements.translationGray.value;
    document.querySelectorAll('.lyric-text').forEach(el => {
        el.style.color = `rgb(${lyricsGray}, ${lyricsGray}, ${lyricsGray})`;
    });
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.color = `rgb(${translationGray}, ${translationGray}, ${translationGray})`;
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
        return `<div class="lyric-line current-line">
            <p class="lyric-text current">暂无歌词</p>
        </div>`;
    }
    
    // Find current lyric index
    let currentIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime) {
            currentIndex = i;
        }
    }
    
    // Render ALL lyrics, the CSS will handle centering current one
    let html = '';
    for (let i = 0; i < lyrics.length; i++) {
        const lyric = lyrics[i];
        const isCurrent = i === currentIndex;
        
        html += `<div class="lyric-line ${isCurrent ? 'current-line' : ''}" data-index="${i}">
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
    elements.titleArtistGapValue.textContent = elements.titleArtistGap.value;
    elements.metadataCoverGapValue.textContent = elements.metadataCoverGap.value;
    elements.coverProgressGapValue.textContent = elements.coverProgressGap.value;
    elements.titleFontSizeValue.textContent = elements.titleFontSize.value;
    elements.artistFontSizeValue.textContent = elements.artistFontSize.value;
    elements.lyricsFontSizeValue.textContent = elements.lyricsFontSize.value;
    elements.translationFontSizeValue.textContent = elements.translationFontSize.value;
    elements.reviewFontSizeValue.textContent = elements.reviewFontSize.value;
    elements.reviewMetaFontSizeValue.textContent = elements.reviewMetaFontSize.value;
    elements.lyricsLineGapValue.textContent = elements.lyricsLineGap.value;
    elements.lyricsHeightValue.textContent = elements.lyricsHeight.value;
    elements.lyricsFadeValue.textContent = elements.lyricsFade.value;
    elements.reviewBoxWidthValue.textContent = elements.reviewBoxWidth.value;
    elements.reviewBoxHeightValue.textContent = elements.reviewBoxHeight.value;
    elements.reviewBgOpacityValue.textContent = elements.reviewBgOpacity.value;
    elements.borderRadiusValue.textContent = elements.borderRadius.value;
    elements.progressBarHeightValue.textContent = elements.progressBarHeight.value;
    elements.progressTimeFontSizeValue.textContent = elements.progressTimeFontSize.value;
    elements.blurStrengthValue.textContent = elements.blurStrength.value;
    elements.titleGrayValue.textContent = elements.titleGray.value;
    elements.artistGrayValue.textContent = elements.artistGray.value;
    elements.lyricsGrayValue.textContent = elements.lyricsGray.value;
    elements.translationGrayValue.textContent = elements.translationGray.value;
    elements.reviewGrayValue.textContent = elements.reviewGray.value;
    
    // Apply cover size (also update progress bar width and metadata panel width)
    const coverSize = elements.coverSize.value + 'px';
    elements.albumArtContainer.style.width = coverSize;
    elements.albumArtContainer.style.height = coverSize;
    elements.progressPanel.style.width = coverSize;
    elements.metadataPanel.style.width = coverSize;
    
    // Apply gaps
    const titleArtistGap = elements.titleArtistGap.value + 'px';
    const metadataCoverGap = elements.metadataCoverGap.value + 'px';
    const coverProgressGap = elements.coverProgressGap.value + 'px';
    elements.displayTitle.style.marginBottom = titleArtistGap;
    elements.metadataPanel.style.marginBottom = metadataCoverGap;
    elements.albumArtContainer.style.marginBottom = coverProgressGap;
    
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
    
    // Apply review meta (watermark/date) font size
    const reviewMetaFontSize = elements.reviewMetaFontSize.value + 'px';
    elements.displayReviewAuthor.style.fontSize = reviewMetaFontSize;
    elements.displayReviewDate.style.fontSize = reviewMetaFontSize;
    
    // Apply lyrics height
    const lyricsHeight = elements.lyricsHeight.value + '%';
    elements.lyricsPanel.style.flex = `0 0 ${lyricsHeight}`;
    
    // Apply lyrics fade effect
    const lyricsFade = parseInt(elements.lyricsFade.value);
    const fadeEnd = 100 - lyricsFade;
    elements.lyricsPanel.style.maskImage = `linear-gradient(to bottom, transparent 0%, black ${lyricsFade}%, black ${fadeEnd}%, transparent 100%)`;
    elements.lyricsPanel.style.webkitMaskImage = `linear-gradient(to bottom, transparent 0%, black ${lyricsFade}%, black ${fadeEnd}%, transparent 100%)`;
    
    // Apply review box size
    const reviewBoxWidth = elements.reviewBoxWidth.value + '%';
    const reviewBoxHeight = elements.reviewBoxHeight.value + 'px';
    elements.reviewPanel.style.width = reviewBoxWidth;
    elements.reviewPanel.style.minHeight = reviewBoxHeight;
    
    // Apply review background opacity - with theme-aware colors
    const reviewBgOpacity = elements.reviewBgOpacity.value / 100;
    if (currentTheme === 'dark') {
        elements.reviewPanel.style.background = `rgba(0, 0, 0, ${reviewBgOpacity})`;
    } else {
        elements.reviewPanel.style.background = `rgba(255, 255, 255, ${0.3 + reviewBgOpacity * 0.7})`;
    }
    
    // Apply border radius
    const borderRadius = elements.borderRadius.value + 'px';
    elements.albumArtContainer.style.borderRadius = borderRadius;
    
    // Apply progress bar height
    const progressBarHeight = elements.progressBarHeight.value + 'px';
    document.querySelector('.progress-bar-bg').style.height = progressBarHeight;
    document.querySelector('.progress-bar-fill').style.height = progressBarHeight;
    document.querySelector('.progress-bar-bg').style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    document.querySelector('.progress-bar-fill').style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    
    // Apply progress time font size
    const progressTimeFontSize = elements.progressTimeFontSize.value + 'px';
    document.querySelector('.progress-time').style.fontSize = progressTimeFontSize;
    
    // Apply blur strength
    const blurStrength = elements.blurStrength.value + 'px';
    elements.dynamicBg.style.filter = `blur(${blurStrength})`;
    elements.overlayLayer.style.backdropFilter = `blur(${parseInt(blurStrength) * 0.75}px)`;
    
    // Apply gray scale to text elements
    const titleGray = elements.titleGray.value;
    const artistGray = elements.artistGray.value;
    const lyricsGray = elements.lyricsGray.value;
    const translationGray = elements.translationGray.value;
    const reviewGray = elements.reviewGray.value;
    
    elements.displayTitle.style.color = `rgb(${titleGray}, ${titleGray}, ${titleGray})`;
    elements.displayArtist.style.color = `rgb(${artistGray}, ${artistGray}, ${artistGray})`;
    
    document.querySelectorAll('.lyric-text').forEach(el => {
        el.style.color = `rgb(${lyricsGray}, ${lyricsGray}, ${lyricsGray})`;
    });
    
    document.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.color = `rgb(${translationGray}, ${translationGray}, ${translationGray})`;
    });
    
    elements.displayReviewContent.style.color = `rgb(${reviewGray}, ${reviewGray}, ${reviewGray})`;
}

function updateElementPositions() {
    // Update value displays
    elements.metadataXValue.textContent = elements.metadataX.value;
    elements.metadataYValue.textContent = elements.metadataY.value;
    elements.coverXValue.textContent = elements.coverX.value;
    elements.coverYValue.textContent = elements.coverY.value;
    elements.progressXValue.textContent = elements.progressX.value;
    elements.progressYValue.textContent = elements.progressY.value;
    elements.lyricsXValue.textContent = elements.lyricsX.value;
    elements.lyricsYValue.textContent = elements.lyricsY.value;
    elements.reviewXValue.textContent = elements.reviewX.value;
    elements.reviewYValue.textContent = elements.reviewY.value;
    
    // Apply position transforms to individual elements
    const metadataX = parseInt(elements.metadataX.value);
    const metadataY = parseInt(elements.metadataY.value);
    elements.metadataPanel.style.transform = `translate(${metadataX}px, ${metadataY}px)`;
    
    const coverX = parseInt(elements.coverX.value);
    const coverY = parseInt(elements.coverY.value);
    elements.albumArtContainer.style.transform = `translate(${coverX}px, ${coverY}px)`;
    
    const progressX = parseInt(elements.progressX.value);
    const progressY = parseInt(elements.progressY.value);
    elements.progressPanel.style.transform = `translate(${progressX}px, ${progressY}px)`;
    
    const lyricsX = parseInt(elements.lyricsX.value);
    const lyricsY = parseInt(elements.lyricsY.value);
    elements.lyricsPanel.style.transform = `translate(${lyricsX}px, ${lyricsY}px)`;
    
    const reviewX = parseInt(elements.reviewX.value);
    const reviewY = parseInt(elements.reviewY.value);
    elements.reviewPanel.style.transform = `translate(${reviewX}px, ${reviewY}px)`;
}

function updateLayout() {
    // Legacy function - now using updateElementPositions instead
    updateElementPositions();
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
        // Setup drag functionality for each element
        setupDragForElement(elements.metadataPanel, 'metadata');
        setupDragForElement(elements.albumArtContainer, 'cover');
        setupDragForElement(elements.progressPanel, 'progress');
        setupDragForElement(elements.lyricsPanel, 'lyrics');
        setupDragForElement(elements.reviewPanel, 'review');
    } else {
        // Remove drag handlers
        removeDragFromElement(elements.metadataPanel);
        removeDragFromElement(elements.albumArtContainer);
        removeDragFromElement(elements.progressPanel);
        removeDragFromElement(elements.lyricsPanel);
        removeDragFromElement(elements.reviewPanel);
    }
}

function setupDragForElement(element, elementName) {
    let isDragging = false;
    let startX, startY;
    let startOffsetX, startOffsetY;
    
    const onMouseDown = (e) => {
        if (!elements.editModeToggle.checked) return;
        
        isDragging = true;
        element.classList.add('dragging');
        
        // Get the current scale of the preview container
        const container = elements.previewContainer;
        const transform = window.getComputedStyle(container).transform;
        let scale = 1;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            scale = matrix.a;
        }
        
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current offset values from sliders
        startOffsetX = parseInt(elements[elementName + 'X'].value) || 0;
        startOffsetY = parseInt(elements[elementName + 'Y'].value) || 0;
        
        e.preventDefault();
    };
    
    const onMouseMove = (e) => {
        if (!isDragging) return;
        
        // Get the current scale
        const container = elements.previewContainer;
        const transform = window.getComputedStyle(container).transform;
        let scale = 1;
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            scale = matrix.a;
        }
        
        // Calculate movement adjusted for scale
        const dx = (e.clientX - startX) / scale;
        const dy = (e.clientY - startY) / scale;
        
        // Calculate new offset
        const newX = Math.round(startOffsetX + dx);
        const newY = Math.round(startOffsetY + dy);
        
        // Clamp values to slider range
        const clampedX = Math.max(-500, Math.min(500, newX));
        const clampedY = Math.max(-500, Math.min(500, newY));
        
        // Update slider values
        elements[elementName + 'X'].value = clampedX;
        elements[elementName + 'Y'].value = clampedY;
        
        // Update positions
        updateElementPositions();
    };
    
    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
        }
    };
    
    element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    // Store handlers for removal
    element._dragHandlers = { onMouseDown, onMouseMove, onMouseUp };
}

function removeDragFromElement(element) {
    if (element._dragHandlers) {
        element.removeEventListener('mousedown', element._dragHandlers.onMouseDown);
        document.removeEventListener('mousemove', element._dragHandlers.onMouseMove);
        document.removeEventListener('mouseup', element._dragHandlers.onMouseUp);
        delete element._dragHandlers;
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

// Helper function to draw rounded rectangle path
function roundedRectPath(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

async function exportScreenshot() {
    const btn = elements.exportBtn;
    const originalText = btn.textContent;
    btn.textContent = '正在生成...';
    btn.disabled = true;
    
    try {
        const container = elements.previewContainer;
        const albumContainer = elements.albumArtContainer;
        const albumImg = elements.albumArt;
        const reviewPanel = elements.reviewPanel;
        
        // Store original styles
        const originalTransform = container.style.transform;
        
        // Remove transform for accurate capture
        container.style.transform = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get positions after transform removal
        const containerRect = container.getBoundingClientRect();
        const albumRect = albumContainer.getBoundingClientRect();
        const reviewRect = reviewPanel.getBoundingClientRect();
        
        // Calculate positions in 4K coordinates
        const scaleX = 3840 / containerRect.width;
        const scaleY = 2160 / containerRect.height;
        
        const albumX = (albumRect.left - containerRect.left) * scaleX;
        const albumY = (albumRect.top - containerRect.top) * scaleY;
        const albumWidth = parseInt(elements.coverSize.value);
        const albumHeight = albumWidth;
        const borderRadius = parseInt(elements.borderRadius.value);
        
        const reviewX = (reviewRect.left - containerRect.left) * scaleX;
        const reviewY = (reviewRect.top - containerRect.top) * scaleY;
        const reviewWidth = reviewRect.width * scaleX;
        const reviewHeight = reviewRect.height * scaleY;
        
        // Create final canvas
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 3840;
        finalCanvas.height = 2160;
        const ctx = finalCanvas.getContext('2d');
        
        // ========== Step 1: Draw Background ==========
        if (currentTheme === 'dark') {
            // Dark theme: first fill with base color
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, 3840, 2160);
            
            // Draw blurred album cover if available
            if (currentCoverUrl && albumImg.complete && albumImg.naturalWidth > 0) {
                const blurRadius = parseInt(elements.blurStrength.value);
                
                // Create a temporary canvas for the blurred background
                const bgCanvas = document.createElement('canvas');
                bgCanvas.width = 4416; // 3840 * 1.15
                bgCanvas.height = 2484; // 2160 * 1.15
                const bgCtx = bgCanvas.getContext('2d');
                
                // Fill with dark color first
                bgCtx.fillStyle = '#0a0a0a';
                bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
                
                // Calculate cover dimensions to fill and overflow
                const imgRatio = albumImg.naturalWidth / albumImg.naturalHeight;
                const canvasRatio = bgCanvas.width / bgCanvas.height;
                let drawW, drawH, drawX, drawY;
                
                if (imgRatio > canvasRatio) {
                    drawH = bgCanvas.height;
                    drawW = drawH * imgRatio;
                } else {
                    drawW = bgCanvas.width;
                    drawH = drawW / imgRatio;
                }
                drawX = (bgCanvas.width - drawW) / 2;
                drawY = (bgCanvas.height - drawH) / 2;
                
                // Draw image with blur
                bgCtx.filter = `blur(${blurRadius}px)`;
                bgCtx.drawImage(albumImg, drawX, drawY, drawW, drawH);
                bgCtx.filter = 'none';
                
                // Draw blurred background centered with opacity
                ctx.globalAlpha = 0.7;
                ctx.drawImage(bgCanvas, -288, -162, 4416, 2484); // Offset to center
                ctx.globalAlpha = 1.0;
                
                // Dark overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(0, 0, 3840, 2160);
            }
        } else {
            // Light theme: simple background color
            ctx.fillStyle = '#F8F6F0';
            ctx.fillRect(0, 0, 3840, 2160);
        }
        
        // ========== Step 2: Capture content with html2canvas ==========
        const contentCanvas = await html2canvas(container, {
            width: 3840,
            height: 2160,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false,
            windowWidth: 3840,
            windowHeight: 2160,
            onclone: function(clonedDoc) {
                const clonedAlbum = clonedDoc.getElementById('albumArtContainer');
                const clonedReview = clonedDoc.getElementById('reviewPanel');
                const clonedDynamicBg = clonedDoc.getElementById('dynamicBg');
                const clonedOverlay = clonedDoc.getElementById('overlayLayer');
                const clonedBgLayer = clonedDoc.getElementById('bgLayer');
                
                // For dark theme, hide dynamic backgrounds (we draw them manually)
                if (currentTheme === 'dark') {
                    if (clonedDynamicBg) clonedDynamicBg.style.opacity = '0';
                    if (clonedOverlay) clonedOverlay.style.background = 'transparent';
                    if (clonedBgLayer) clonedBgLayer.style.background = 'transparent';
                }
                // Light theme: keep bgLayer as-is for ink background
                
                // Hide album (we'll draw it with proper rounding)
                if (clonedAlbum) {
                    clonedAlbum.style.visibility = 'hidden';
                }
                
                // Hide review panel shadow (we draw it manually)
                if (clonedReview) {
                    clonedReview.style.boxShadow = 'none';
                }
            }
        });
        
        // ========== Step 3: Draw album shadow ==========
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 50;
        ctx.fillStyle = '#000000';
        roundedRectPath(ctx, albumX, albumY, albumWidth, albumHeight, borderRadius);
        ctx.fill();
        ctx.restore();
        
        // ========== Step 4: Draw review panel shadow ==========
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 50;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;
        ctx.fillStyle = currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.65)';
        roundedRectPath(ctx, reviewX, reviewY, reviewWidth, reviewHeight, 16);
        ctx.fill();
        ctx.restore();
        
        // ========== Step 5: Draw html2canvas content ==========
        ctx.drawImage(contentCanvas, 0, 0);
        
        // ========== Step 6: Draw album cover with perfect rounded corners ==========
        if (albumImg.complete && albumImg.src && albumImg.naturalWidth > 0) {
            ctx.save();
            roundedRectPath(ctx, albumX, albumY, albumWidth, albumHeight, borderRadius);
            ctx.clip();
            ctx.drawImage(albumImg, albumX, albumY, albumWidth, albumHeight);
            ctx.restore();
        }
        
        // Restore original transform
        container.style.transform = originalTransform;
        
        // Create download
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const title = elements.trackTitle.value || 'music_summary';
        link.download = `${title}_${timestamp}.png`;
        link.href = finalCanvas.toDataURL('image/png', 1.0);
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
        titleArtistGap: elements.titleArtistGap.value,
        metadataCoverGap: elements.metadataCoverGap.value,
        coverProgressGap: elements.coverProgressGap.value,
        titleFontSize: elements.titleFontSize.value,
        artistFontSize: elements.artistFontSize.value,
        lyricsFontSize: elements.lyricsFontSize.value,
        translationFontSize: elements.translationFontSize.value,
        reviewFontSize: elements.reviewFontSize.value,
        lyricsLineGap: elements.lyricsLineGap.value,
        lyricsHeight: elements.lyricsHeight.value,
        lyricsFade: elements.lyricsFade.value,
        reviewBoxWidth: elements.reviewBoxWidth.value,
        reviewBoxHeight: elements.reviewBoxHeight.value,
        reviewBgOpacity: elements.reviewBgOpacity.value,
        borderRadius: elements.borderRadius.value,
        blurStrength: elements.blurStrength.value,
        // Gray scale settings
        titleGray: elements.titleGray.value,
        artistGray: elements.artistGray.value,
        lyricsGray: elements.lyricsGray.value,
        translationGray: elements.translationGray.value,
        reviewGray: elements.reviewGray.value,
        // Visibility settings
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
        // Individual element positions
        metadataX: elements.metadataX.value,
        metadataY: elements.metadataY.value,
        coverX: elements.coverX.value,
        coverY: elements.coverY.value,
        progressX: elements.progressX.value,
        progressY: elements.progressY.value,
        lyricsX: elements.lyricsX.value,
        lyricsY: elements.lyricsY.value,
        reviewX: elements.reviewX.value,
        reviewY: elements.reviewY.value
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
        if (settings.titleArtistGap) elements.titleArtistGap.value = settings.titleArtistGap;
        if (settings.metadataCoverGap) elements.metadataCoverGap.value = settings.metadataCoverGap;
        if (settings.coverProgressGap) elements.coverProgressGap.value = settings.coverProgressGap;
        if (settings.titleFontSize) elements.titleFontSize.value = settings.titleFontSize;
        if (settings.artistFontSize) elements.artistFontSize.value = settings.artistFontSize;
        if (settings.lyricsFontSize) elements.lyricsFontSize.value = settings.lyricsFontSize;
        if (settings.translationFontSize) elements.translationFontSize.value = settings.translationFontSize;
        if (settings.reviewFontSize) elements.reviewFontSize.value = settings.reviewFontSize;
        if (settings.lyricsLineGap) elements.lyricsLineGap.value = settings.lyricsLineGap;
        if (settings.lyricsHeight) elements.lyricsHeight.value = settings.lyricsHeight;
        if (settings.lyricsFade) elements.lyricsFade.value = settings.lyricsFade;
        if (settings.reviewBoxWidth) elements.reviewBoxWidth.value = settings.reviewBoxWidth;
        if (settings.reviewBoxHeight) elements.reviewBoxHeight.value = settings.reviewBoxHeight;
        if (settings.reviewBgOpacity) elements.reviewBgOpacity.value = settings.reviewBgOpacity;
        if (settings.borderRadius) elements.borderRadius.value = settings.borderRadius;
        if (settings.blurStrength) elements.blurStrength.value = settings.blurStrength;
        
        // Gray scale settings
        if (settings.titleGray) elements.titleGray.value = settings.titleGray;
        if (settings.artistGray) elements.artistGray.value = settings.artistGray;
        if (settings.lyricsGray) elements.lyricsGray.value = settings.lyricsGray;
        if (settings.translationGray) elements.translationGray.value = settings.translationGray;
        if (settings.reviewGray) elements.reviewGray.value = settings.reviewGray;
        
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
        
        // Apply individual element positions
        if (settings.metadataX) elements.metadataX.value = settings.metadataX;
        if (settings.metadataY) elements.metadataY.value = settings.metadataY;
        if (settings.coverX) elements.coverX.value = settings.coverX;
        if (settings.coverY) elements.coverY.value = settings.coverY;
        if (settings.progressX) elements.progressX.value = settings.progressX;
        if (settings.progressY) elements.progressY.value = settings.progressY;
        if (settings.lyricsX) elements.lyricsX.value = settings.lyricsX;
        if (settings.lyricsY) elements.lyricsY.value = settings.lyricsY;
        if (settings.reviewX) elements.reviewX.value = settings.reviewX;
        if (settings.reviewY) elements.reviewY.value = settings.reviewY;
        
        // Apply theme
        if (settings.theme) currentTheme = settings.theme;
        
        // Update displays
        updateStyles();
        updateFonts();
        updateVisibility();
        updateElementPositions();
        updateAlignment();
        
    } catch (e) {
        console.log('Error loading settings:', e);
    }
}

// Save settings on window close
window.addEventListener('beforeunload', saveSettings);
