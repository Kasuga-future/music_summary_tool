/**
 * Music Summary - Main Script
 * 音乐总结工具核心逻辑
 * 支持 3840x2160 (4K) 横屏输出
 * 支持 2160x3840 竖屏输出 (+1440px 评价区域可选)
 */

// ============================================
// Global Variables & State
// ============================================
let currentTheme = 'dark';
let currentCoverUrl = null;
let totalDuration = 205; // 默认 3:25
let currentPalette = [];
let albumPalette = []; // 保存从专辑封面提取的颜色
let currentLayout = 'horizontal'; // 'horizontal' or 'vertical'

// DOM Element References
const elements = {};

// Available system fonts
let availableFonts = [];

// ============================================
// Initialization
// ============================================
const SETTINGS_VERSION = '2.0'; // Update this to reset settings to new defaults

document.addEventListener('DOMContentLoaded', () => {
    // Check settings version - reset if outdated
    const savedVersion = localStorage.getItem('musicSummarySettings_version');
    if (savedVersion !== SETTINGS_VERSION) {
        localStorage.removeItem('musicSummarySettings_horizontal');
        localStorage.removeItem('musicSummarySettings_vertical');
        localStorage.removeItem('musicSummarySettings_common');
        localStorage.setItem('musicSummarySettings_version', SETTINGS_VERSION);
    }
    
    initializeElements();
    loadSystemFonts();
    initializeEventListeners();
    loadSettings();
    
    // Apply saved layout and theme
    setTheme(currentTheme || 'dark');
    if (currentLayout === 'vertical') {
        setLayoutMode('vertical');
    }
    
    updatePreviewScale();
    generateDefaultCover();
    renderInkBackground();
    updateLyrics();
    updateReviewDisplay();
    updateStyles();
    updateElementPositions();
    updateAlignment();
    initializeScrollNav();
    initializeTimeInputs();
    
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
    elements.totalTimeInput = document.getElementById('totalTimeInput');
    elements.currentTimeInput = document.getElementById('currentTimeInput');
    
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
    elements.lyricsWidth = document.getElementById('lyricsWidth');
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
    elements.lyricsWidthValue = document.getElementById('lyricsWidthValue');
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
    // Layout mode buttons
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLayoutMode(btn.dataset.layout);
        });
    });
    
    // Vertical mode module options
    document.getElementById('showLyricsModule').addEventListener('change', updateVerticalModules);
    document.getElementById('showReviewModule').addEventListener('change', updateVerticalModules);
    document.getElementById('verticalTitlePosition').addEventListener('change', updateVerticalTitlePosition);
    
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
    
    // Allow Tab key to insert spaces in review textarea
    elements.reviewContent.addEventListener('keydown', handleReviewTextareaKeydown);
    
    // Checkbox inputs
    elements.showLyrics.addEventListener('change', updateVisibility);
    elements.showTranslation.addEventListener('change', updateLyrics);
    elements.showAlbumArt.addEventListener('change', updateVisibility);
    elements.showProgressBar.addEventListener('change', updateVisibility);
    elements.showMetadata.addEventListener('change', updateVisibility);
    elements.showReview.addEventListener('change', updateVisibility);
    
    // Progress slider
    elements.progressSlider.addEventListener('input', updateProgress);
    
    // Time input fields
    elements.totalTimeInput.addEventListener('input', handleTotalTimeInput);
    elements.totalTimeInput.addEventListener('blur', handleTotalTimeInput);
    elements.currentTimeInput.addEventListener('input', handleCurrentTimeInput);
    elements.currentTimeInput.addEventListener('blur', handleCurrentTimeInput);
    
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
    elements.lyricsWidth.addEventListener('input', updateStyles);
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
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
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

/**
 * Extract lyrics from audio file metadata - supports multiple formats
 * 
 * Supported formats:
 * - MP3 (ID3v2): USLT, SYLT, lyrics, TXXX
 * - FLAC: LYRICS, UNSYNCEDLYRICS (Vorbis Comments)
 * - M4A/MP4: ©lyr (iTunes lyrics tag)
 * - OGG: LYRICS, UNSYNCEDLYRICS (Vorbis Comments)
 * - Various other proprietary fields
 */
function extractLyricsFromTags(tags) {
    console.log('Attempting to extract lyrics from tags...');
    console.log('All available tags:', Object.keys(tags));
    
    // ============================================
    // FLAC / OGG / Vorbis Comments format
    // ============================================
    
    // FLAC/OGG commonly use these field names (case-insensitive in Vorbis)
    const vorbisLyricsFields = [
        'LYRICS', 'lyrics', 'Lyrics',
        'UNSYNCEDLYRICS', 'unsyncedlyrics', 'UNSYNCED LYRICS',
        'SYNCEDLYRICS', 'syncedlyrics',
        'LYRIC', 'lyric', 'Lyric'
    ];
    
    for (const field of vorbisLyricsFields) {
        if (tags[field]) {
            console.log(`Found Vorbis lyrics field: ${field}`, typeof tags[field]);
            const value = tags[field];
            if (typeof value === 'string' && value.length > 0) {
                return value;
            }
            if (value && value.data && typeof value.data === 'string') {
                return value.data;
            }
        }
    }
    
    // ============================================
    // M4A / MP4 / iTunes format
    // ============================================
    
    // iTunes/M4A uses ©lyr or various other fields
    const itunesLyricsFields = [
        '©lyr', '\u00A9lyr', 'lyr', 
        '----:com.apple.iTunes:LYRICS',
        '----:com.apple.iTunes:lyrics',
        'aART', // sometimes misused
    ];
    
    for (const field of itunesLyricsFields) {
        if (tags[field]) {
            console.log(`Found iTunes lyrics field: ${field}`, typeof tags[field]);
            const value = tags[field];
            if (typeof value === 'string' && value.length > 0) {
                return value;
            }
            if (value && value.data && typeof value.data === 'string') {
                return value.data;
            }
            if (Array.isArray(value) && value.length > 0) {
                return value[0];
            }
        }
    }
    
    // ============================================
    // MP3 / ID3v2 format
    // ============================================
    
    // Method 1: USLT tag (most common for ID3v2)
    // Can be tags.USLT or tags.USLT as array or object
    if (tags.USLT) {
        console.log('Found USLT tag:', tags.USLT);
        // USLT might be an object with data property
        if (tags.USLT.data && tags.USLT.data.lyrics) {
            return tags.USLT.data.lyrics;
        }
        // Or directly contain lyrics
        if (tags.USLT.lyrics) {
            return tags.USLT.lyrics;
        }
        // Or be a string directly
        if (typeof tags.USLT === 'string') {
            return tags.USLT;
        }
        // Or be an array of USLT frames
        if (Array.isArray(tags.USLT) && tags.USLT.length > 0) {
            const firstLyric = tags.USLT[0];
            if (firstLyric.data && firstLyric.data.lyrics) {
                return firstLyric.data.lyrics;
            }
            if (firstLyric.lyrics) {
                return firstLyric.lyrics;
            }
        }
    }
    
    // Method 2: Generic lyrics field
    if (tags.lyrics) {
        console.log('Found lyrics tag:', tags.lyrics);
        if (typeof tags.lyrics === 'string') {
            return tags.lyrics;
        }
        if (tags.lyrics.lyrics) {
            return tags.lyrics.lyrics;
        }
        if (tags.lyrics.data) {
            return tags.lyrics.data;
        }
    }
    
    // Method 3: SYLT (Synchronized lyrics) - less common but possible
    if (tags.SYLT) {
        console.log('Found SYLT tag:', tags.SYLT);
        // SYLT is usually more complex, try to extract text
        if (tags.SYLT.data && Array.isArray(tags.SYLT.data)) {
            // Convert synchronized lyrics to LRC format
            const lines = tags.SYLT.data.map(item => {
                if (item.text && item.timeStamp !== undefined) {
                    const time = item.timeStamp / 1000; // ms to seconds
                    const mins = Math.floor(time / 60);
                    const secs = (time % 60).toFixed(2);
                    return `[${mins}:${secs.padStart(5, '0')}]${item.text}`;
                }
                return item.text || '';
            });
            return lines.join('\n');
        }
    }
    
    // Method 4: Check for TXXX frames (user-defined text)
    if (tags.TXXX) {
        console.log('Found TXXX tag:', tags.TXXX);
        const txxx = Array.isArray(tags.TXXX) ? tags.TXXX : [tags.TXXX];
        for (const frame of txxx) {
            const desc = (frame.description || frame.id || '').toLowerCase();
            if (desc.includes('lyric') || desc.includes('歌词')) {
                return frame.data || frame.value || frame.text;
            }
        }
    }
    
    // Method 5: Check common alternative field names
    const altFields = ['unsyncedlyrics', 'unsynced lyrics', 'LYRICS', 'Lyrics', 
                       'lyr', 'LYR', 'lyric', 'LYRIC', 'text', 'TEXT'];
    for (const field of altFields) {
        if (tags[field]) {
            console.log(`Found alternative lyrics field: ${field}`, tags[field]);
            if (typeof tags[field] === 'string') {
                return tags[field];
            }
            if (tags[field].data) {
                return tags[field].data;
            }
            if (tags[field].lyrics) {
                return tags[field].lyrics;
            }
        }
    }
    
    // Method 6: Scan all tags for anything that looks like lyrics
    // Extended list of non-lyrics fields to skip
    const skipFields = [
        'title', 'artist', 'album', 'year', 'picture', 'genre', 'comment', 'track',
        'APIC', 'TALB', 'TIT2', 'TPE1', 'TYER', 'TRCK', 'TCON', 'COMM', 'TPOS',
        'TDRC', 'TSSE', 'TXXX', 'PRIV', 'WCOM', 'WOAR', 'WPUB',
        // FLAC/Vorbis common fields
        'ALBUMARTIST', 'TRACKNUMBER', 'DISCNUMBER', 'DATE', 'ENCODER',
        'REPLAYGAIN_TRACK_GAIN', 'REPLAYGAIN_TRACK_PEAK',
        // M4A/iTunes common fields  
        '©nam', '©ART', '©alb', '©day', '©gen', 'covr', 'trkn', 'disk',
        'cpil', 'pgap', '©too', 'tmpo', '©wrt', 'aART'
    ];
    
    for (const key of Object.keys(tags)) {
        const value = tags[key];
        // Skip known non-lyrics fields (case-insensitive check)
        if (skipFields.some(f => f.toLowerCase() === key.toLowerCase())) {
            continue;
        }
        
        // Check if value looks like lyrics (contains timestamps or multiple lines)
        let textContent = null;
        if (typeof value === 'string') {
            textContent = value;
        } else if (value && value.data && typeof value.data === 'string') {
            textContent = value.data;
        } else if (value && value.lyrics && typeof value.lyrics === 'string') {
            textContent = value.lyrics;
        } else if (value && typeof value === 'object') {
            // Try to extract text from nested object
            for (const subKey of ['text', 'value', 'content', 'lyrics', 'data']) {
                if (value[subKey] && typeof value[subKey] === 'string') {
                    textContent = value[subKey];
                    break;
                }
            }
        }
        
        if (textContent && textContent.length > 50) {
            // Check if it looks like LRC format or has multiple lines
            if (textContent.includes('[') && textContent.includes(']') && textContent.includes('\n')) {
                console.log(`Found potential lyrics in field: ${key}`);
                return textContent;
            }
            // Check if it has multiple lines (plain lyrics)
            if ((textContent.match(/\n/g) || []).length >= 5) {
                console.log(`Found potential plain lyrics in field: ${key}`);
                return textContent;
            }
        }
    }
    
    console.log('No lyrics found in any tag');
    return null;
}

function handleAudioUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset all metadata when importing new song
    resetAllMetadata();
    
    elements.audioFileName.textContent = file.name;
    
    const fileExt = file.name.split('.').pop().toLowerCase();
    
    // For WAV files, also try direct metadata extraction as jsmediatags has limited WAV support
    if (fileExt === 'wav' || fileExt === 'wave') {
        console.log('WAV file detected, trying direct metadata extraction...');
        tryExtractWAVMetadata(file);
    }
    
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
            
            // Extract lyrics - try multiple possible tag formats
            const extractedLyrics = extractLyricsFromTags(tags);
            if (extractedLyrics) {
                elements.lyricsInput.value = extractedLyrics;
                updateLyrics();
                console.log('Lyrics extracted successfully');
            } else {
                console.log('No lyrics found in standard tags, trying raw file parsing...');
                // Try raw file parsing as fallback for FLAC/M4A/etc
                tryExtractLyricsFromRawFile(file);
            }
            
            updateDisplayText();
        },
        onError: function(error) {
            console.log('Error reading ID3 tags:', error);
            generateDefaultCover();
            // Still try to extract lyrics from raw file
            tryExtractLyricsFromRawFile(file);
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

/**
 * Try to extract lyrics directly from raw file bytes
 * This is a fallback method for FLAC, M4A, OGG, WAV when jsmediatags doesn't find lyrics
 */
function tryExtractLyricsFromRawFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const buffer = e.target.result;
        const bytes = new Uint8Array(buffer);
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        console.log(`Attempting raw extraction for ${fileExt} file...`);
        
        let lyrics = null;
        let metadata = null;
        
        if (fileExt === 'flac') {
            lyrics = extractLyricsFromFLAC(bytes);
        } else if (fileExt === 'm4a' || fileExt === 'mp4' || fileExt === 'aac') {
            lyrics = extractLyricsFromM4A(bytes);
        } else if (fileExt === 'ogg' || fileExt === 'opus') {
            lyrics = extractLyricsFromOGG(bytes);
        } else if (fileExt === 'wav' || fileExt === 'wave') {
            lyrics = extractLyricsFromWAV(bytes);
            // Also try to extract metadata for WAV
            metadata = extractWAVMetadata(bytes);
        }
        
        // Apply extracted metadata
        if (metadata) {
            if (metadata.title && !elements.trackTitle.value) {
                elements.trackTitle.value = metadata.title;
                updateDisplayText();
            }
            if (metadata.artist && !elements.artistName.value) {
                elements.artistName.value = metadata.artist;
                updateDisplayText();
            }
        }
        
        if (lyrics) {
            console.log('Raw extraction found lyrics!');
            elements.lyricsInput.value = lyrics;
            updateLyrics();
        } else {
            console.log('Raw extraction found no lyrics');
        }
    };
    reader.readAsArrayBuffer(file);
}

/**
 * Try to extract all metadata from WAV files when jsmediatags fails
 * This is called separately for WAV files
 * Handles: title, artist, cover art, lyrics, and non-ASCII characters (Chinese, Japanese, etc.)
 */
function tryExtractWAVMetadata(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const buffer = e.target.result;
        const bytes = new Uint8Array(buffer);
        
        console.log('Extracting WAV metadata (enhanced)...');
        
        // Extract all metadata including cover
        const result = extractWAVAllMetadata(bytes);
        
        if (result.title && !elements.trackTitle.value) {
            elements.trackTitle.value = result.title;
            console.log('WAV Title:', result.title);
        }
        if (result.artist && !elements.artistName.value) {
            elements.artistName.value = result.artist;
            console.log('WAV Artist:', result.artist);
        }
        
        // Set cover image if found
        if (result.coverData && result.coverMimeType) {
            console.log('WAV Cover found, size:', result.coverData.length);
            const coverUrl = `data:${result.coverMimeType};base64,${result.coverData}`;
            setCoverImage(coverUrl);
            elements.coverFileName.textContent = '从WAV提取';
        }
        
        updateDisplayText();
        
        // Also try to get lyrics
        if (result.lyrics && !elements.lyricsInput.value) {
            elements.lyricsInput.value = result.lyrics;
            updateLyrics();
            console.log('WAV Lyrics found');
        } else {
            // Try generic search
            const lyrics = extractLyricsFromWAV(bytes);
            if (lyrics && !elements.lyricsInput.value) {
                elements.lyricsInput.value = lyrics;
                updateLyrics();
            }
        }
    };
    reader.readAsArrayBuffer(file);
}

/**
 * Extract all metadata from WAV file including cover art
 * Supports multiple encodings for non-ASCII characters
 */
function extractWAVAllMetadata(bytes) {
    const result = {
        title: null,
        artist: null,
        album: null,
        lyrics: null,
        coverData: null,
        coverMimeType: null
    };
    
    // WAV files start with "RIFF"
    if (bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46) {
        console.log('Not a valid RIFF/WAV file');
        return result;
    }
    
    console.log('Parsing WAV RIFF structure (enhanced)...');
    
    try {
        // Parse RIFF structure
        let offset = 12; // Skip "RIFF" + size + "WAVE"
        
        while (offset < bytes.length - 8) {
            // Read chunk ID (4 bytes)
            const chunkId = String.fromCharCode(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]);
            // Read chunk size (4 bytes, little-endian)
            const chunkSize = bytes[offset+4] | (bytes[offset+5] << 8) | (bytes[offset+6] << 16) | (bytes[offset+7] << 24);
            
            console.log(`WAV chunk: "${chunkId}", size: ${chunkSize}, offset: ${offset}`);
            
            if (chunkSize <= 0 || chunkSize > bytes.length - offset) {
                console.log('Invalid chunk size, stopping parse');
                break;
            }
            
            if (chunkId === 'LIST') {
                const listType = String.fromCharCode(bytes[offset+8], bytes[offset+9], bytes[offset+10], bytes[offset+11]);
                console.log(`LIST type: ${listType}`);
                
                if (listType === 'INFO') {
                    // Parse INFO sub-chunks with proper encoding
                    parseWAVInfoChunk(bytes, offset + 12, offset + 8 + chunkSize, result);
                }
            } else if (chunkId === 'id3 ' || chunkId === 'ID3 ' || chunkId === 'ID3\x00') {
                // Embedded ID3 tag
                console.log('Found embedded ID3 chunk in WAV');
                parseEmbeddedID3(bytes, offset + 8, chunkSize, result);
            } else if (chunkId === 'data') {
                // Audio data chunk - skip but note its position
                console.log('Found audio data chunk');
            }
            
            // Move to next chunk
            offset += 8 + chunkSize + (chunkSize % 2);
            
            if (offset >= bytes.length) break;
        }
        
        // Also check for ID3v2 tag at the end of file (some WAV files have this)
        const id3v2EndOffset = findID3v2AtEnd(bytes);
        if (id3v2EndOffset > 0) {
            console.log('Found ID3v2 tag at end of WAV file');
            parseEmbeddedID3(bytes, id3v2EndOffset, bytes.length - id3v2EndOffset, result);
        }
        
    } catch (e) {
        console.log('Error parsing WAV metadata:', e);
    }
    
    console.log('WAV metadata result:', result);
    return result;
}

/**
 * Parse WAV INFO chunk with proper encoding support
 */
function parseWAVInfoChunk(bytes, startOffset, endOffset, result) {
    let offset = startOffset;
    
    while (offset < endOffset - 8) {
        const infoId = String.fromCharCode(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3]);
        const infoSize = bytes[offset+4] | (bytes[offset+5] << 8) | (bytes[offset+6] << 16) | (bytes[offset+7] << 24);
        
        if (infoSize <= 0 || infoSize > 10000 || offset + 8 + infoSize > endOffset) {
            break;
        }
        
        // Extract the raw bytes
        const valueBytes = bytes.slice(offset + 8, offset + 8 + infoSize);
        
        // Try to decode with multiple encodings
        let value = decodeTextWithFallback(valueBytes);
        
        console.log(`INFO field "${infoId}": "${value}" (size: ${infoSize})`);
        
        if (value && value.length > 0) {
            if (infoId === 'INAM') result.title = value;
            else if (infoId === 'IART') result.artist = value;
            else if (infoId === 'IPRD') result.album = value;
            else if (infoId === 'ICMT' && value.length > 50) {
                // Comment might contain lyrics
                if (value.includes('[') && value.includes(']')) {
                    result.lyrics = value;
                }
            }
        }
        
        // Move to next sub-chunk (padded to even)
        offset += 8 + infoSize + (infoSize % 2);
    }
}

/**
 * Decode text bytes with multiple encoding fallbacks
 * Tries: UTF-8, UTF-16LE, GBK (Chinese), Shift-JIS (Japanese)
 */
/**
 * Check if decoded text contains valid CJK/Japanese characters
 */
function hasValidCJKChars(text) {
    // Check for Chinese, Japanese, Korean characters
    const cjkPattern = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
    return cjkPattern.test(text);
}

/**
 * Check if text is pure ASCII (basic Latin characters only)
 */
function isPureASCII(text) {
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) > 127) {
            return false;
        }
    }
    return true;
}

/**
 * Check if bytes are valid UTF-8 with high-byte characters
 * Returns true if there are bytes > 127 that form valid UTF-8 sequences
 */
function hasHighBytesInData(bytes) {
    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] > 127) {
            return true;
        }
    }
    return false;
}

/**
 * Check if decoded text looks like valid readable text
 */
function isValidDecodedText(text) {
    if (!text || text.length === 0) return false;
    
    // Count problematic characters (control chars, replacement chars, weird symbols)
    let problemCount = 0;
    let normalCount = 0;
    
    for (const char of text) {
        const code = char.charCodeAt(0);
        
        // Replacement character
        if (code === 0xFFFD) {
            problemCount++;
            continue;
        }
        
        // Private use area (often indicates wrong encoding)
        if (code >= 0xE000 && code <= 0xF8FF) {
            problemCount++;
            continue;
        }
        
        // Control characters (except common ones like newline, tab)
        if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
            problemCount++;
            continue;
        }
        
        // Valid printable character
        if (code >= 32 || code === 9 || code === 10 || code === 13) {
            normalCount++;
        }
    }
    
    // If more than 20% are problematic, consider it invalid
    if (normalCount === 0) return false;
    return (problemCount / (normalCount + problemCount)) < 0.2;
}

/**
 * Score decoded text quality (higher is better)
 * Only gives CJK bonus if the source bytes actually contain high bytes
 */
function scoreDecodedText(text, hasHighBytes = true) {
    if (!text) return 0;
    
    let score = 0;
    
    // Only give CJK bonus if source data has high bytes (non-ASCII)
    // This prevents ASCII text from being "upgraded" to CJK encodings
    if (hasHighBytes && hasValidCJKChars(text)) {
        score += 50;
    }
    
    // Prefer text without replacement characters
    const replacementCount = (text.match(/\uFFFD/g) || []).length;
    score -= replacementCount * 10;
    
    // Prefer text without private use area characters
    const privateUseCount = (text.match(/[\uE000-\uF8FF]/g) || []).length;
    score -= privateUseCount * 5;
    
    // Prefer normal alphanumeric content
    const normalChars = (text.match(/[\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || []).length;
    score += normalChars;
    
    return score;
}

function decodeTextWithFallback(bytes) {
    // Remove trailing null bytes
    let end = bytes.length;
    while (end > 0 && bytes[end - 1] === 0) end--;
    if (end === 0) return '';
    
    const trimmedBytes = bytes.slice(0, end);
    
    // Check if data contains any high bytes (non-ASCII)
    const hasHighBytes = hasHighBytesInData(trimmedBytes);
    
    // Check for BOM (Byte Order Mark)
    if (trimmedBytes.length >= 2) {
        // UTF-16 LE BOM
        if (trimmedBytes[0] === 0xFF && trimmedBytes[1] === 0xFE) {
            try {
                const result = new TextDecoder('utf-16le').decode(trimmedBytes.slice(2));
                if (isValidDecodedText(result)) return result.trim();
            } catch (e) {}
        }
        // UTF-16 BE BOM
        if (trimmedBytes[0] === 0xFE && trimmedBytes[1] === 0xFF) {
            try {
                const result = new TextDecoder('utf-16be').decode(trimmedBytes.slice(2));
                if (isValidDecodedText(result)) return result.trim();
            } catch (e) {}
        }
        // UTF-8 BOM
        if (trimmedBytes.length >= 3 && trimmedBytes[0] === 0xEF && trimmedBytes[1] === 0xBB && trimmedBytes[2] === 0xBF) {
            try {
                const result = new TextDecoder('utf-8').decode(trimmedBytes.slice(3));
                if (isValidDecodedText(result)) return result.trim();
            } catch (e) {}
        }
    }
    
    // If data is pure ASCII (no high bytes), just use UTF-8 directly
    // This prevents ASCII text like "Artist Name" from being mangled by GBK/Shift-JIS
    if (!hasHighBytes) {
        try {
            const result = new TextDecoder('utf-8', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                return result.trim();
            }
        } catch (e) {}
    }
    
    // Try UTF-8 first (strict mode)
    try {
        const result = new TextDecoder('utf-8', { fatal: true }).decode(trimmedBytes);
        if (isValidDecodedText(result)) {
            // If UTF-8 decoded successfully and result is pure ASCII, return immediately
            if (isPureASCII(result)) {
                return result.trim();
            }
            // Otherwise add to candidates
        }
    } catch (e) {
        // UTF-8 strict failed, need to try other encodings
    }
    
    // Collect all candidate decodings with scores
    const candidates = [];
    
    // Try UTF-8 (non-strict for candidates)
    try {
        const result = new TextDecoder('utf-8', { fatal: false }).decode(trimmedBytes);
        if (isValidDecodedText(result) && !result.includes('\uFFFD')) {
            candidates.push({ encoding: 'utf-8', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) + 20 }); // bonus for UTF-8
        }
    } catch (e) {}
    
    // Only try CJK encodings if there are high bytes in the data
    if (hasHighBytes) {
        // Try GBK (Simplified Chinese - common in Chinese music files)
        try {
            const result = new TextDecoder('gbk', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'gbk', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
        
        // Try GB18030 (Extended Chinese)
        try {
            const result = new TextDecoder('gb18030', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'gb18030', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
        
        // Try Big5 (Traditional Chinese)
        try {
            const result = new TextDecoder('big5', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'big5', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
        
        // Try Shift-JIS (Japanese)
        try {
            const result = new TextDecoder('shift-jis', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'shift-jis', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
        
        // Try EUC-JP (Japanese)
        try {
            const result = new TextDecoder('euc-jp', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'euc-jp', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
        
        // Try EUC-KR (Korean)
        try {
            const result = new TextDecoder('euc-kr', { fatal: false }).decode(trimmedBytes);
            if (isValidDecodedText(result)) {
                candidates.push({ encoding: 'euc-kr', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) });
            }
        } catch (e) {}
    }
    
    // Try UTF-16LE (Windows Unicode without BOM)
    if (trimmedBytes.length % 2 === 0 && trimmedBytes.length >= 2) {
        try {
            const result = new TextDecoder('utf-16le', { fatal: false }).decode(trimmedBytes);
            // UTF-16 decoded text should be roughly half the byte length
            if (isValidDecodedText(result) && !result.includes('\u0000')) {
                candidates.push({ encoding: 'utf-16le', text: result.trim(), score: scoreDecodedText(result, hasHighBytes) - 5 }); // slight penalty for guessing UTF-16
            }
        } catch (e) {}
    }
    
    // Sort candidates by score and pick the best
    if (candidates.length > 0) {
        candidates.sort((a, b) => b.score - a.score);
        console.log('Encoding candidates:', candidates.map(c => `${c.encoding}(${c.score})`).join(', '));
        return candidates[0].text;
    }
    
    // Fallback: UTF-8 with replacement characters
    try {
        const result = new TextDecoder('utf-8', { fatal: false }).decode(trimmedBytes);
        return result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
    } catch (e) {
        return '';
    }
}

/**
 * Parse embedded ID3 tag in WAV file
 */
function parseEmbeddedID3(bytes, offset, size, result) {
    try {
        // Check for ID3 header
        if (bytes[offset] !== 0x49 || bytes[offset+1] !== 0x44 || bytes[offset+2] !== 0x33) {
            // Not an ID3 tag, try direct search
            return;
        }
        
        console.log('Parsing embedded ID3v2 tag...');
        
        // ID3v2 header: "ID3" + version (2 bytes) + flags (1 byte) + size (4 bytes syncsafe)
        const version = bytes[offset + 3];
        const revision = bytes[offset + 4];
        console.log(`ID3v2.${version}.${revision}`);
        
        // Parse syncsafe size
        const id3Size = ((bytes[offset + 6] & 0x7F) << 21) |
                       ((bytes[offset + 7] & 0x7F) << 14) |
                       ((bytes[offset + 8] & 0x7F) << 7) |
                       (bytes[offset + 9] & 0x7F);
        
        console.log('ID3 tag size:', id3Size);
        
        // Search for APIC frame (album art)
        const apicOffset = findInBytes(bytes, [0x41, 0x50, 0x49, 0x43], offset, offset + Math.min(size, id3Size + 10));
        if (apicOffset > 0) {
            console.log('Found APIC frame at:', apicOffset);
            extractAPICFrame(bytes, apicOffset, result);
        }
        
        // Search for USLT frame (lyrics)
        const usltOffset = findInBytes(bytes, [0x55, 0x53, 0x4C, 0x54], offset, offset + Math.min(size, id3Size + 10));
        if (usltOffset > 0 && !result.lyrics) {
            console.log('Found USLT frame at:', usltOffset);
            extractUSLTFrame(bytes, usltOffset, result);
        }
        
        // Search for TIT2 (title) if not found yet
        if (!result.title) {
            const tit2Offset = findInBytes(bytes, [0x54, 0x49, 0x54, 0x32], offset, offset + Math.min(size, id3Size + 10));
            if (tit2Offset > 0) {
                extractTextFrame(bytes, tit2Offset, 'title', result);
            }
        }
        
        // Search for TPE1 (artist) if not found yet
        if (!result.artist) {
            const tpe1Offset = findInBytes(bytes, [0x54, 0x50, 0x45, 0x31], offset, offset + Math.min(size, id3Size + 10));
            if (tpe1Offset > 0) {
                extractTextFrame(bytes, tpe1Offset, 'artist', result);
            }
        }
        
    } catch (e) {
        console.log('Error parsing embedded ID3:', e);
    }
}

/**
 * Find byte pattern in array
 */
function findInBytes(bytes, pattern, start, end) {
    end = Math.min(end, bytes.length - pattern.length);
    for (let i = start; i < end; i++) {
        let found = true;
        for (let j = 0; j < pattern.length; j++) {
            if (bytes[i + j] !== pattern[j]) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
}

/**
 * Extract APIC (album art) frame from ID3v2
 */
function extractAPICFrame(bytes, offset, result) {
    try {
        // Frame header: ID (4) + size (4) + flags (2)
        const frameSize = (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | 
                         (bytes[offset + 6] << 8) | bytes[offset + 7];
        
        if (frameSize <= 0 || frameSize > 10 * 1024 * 1024) return; // Max 10MB
        
        let pos = offset + 10; // Skip header
        
        // Text encoding byte
        const encoding = bytes[pos++];
        
        // MIME type (null-terminated)
        let mimeType = '';
        while (pos < bytes.length && bytes[pos] !== 0) {
            mimeType += String.fromCharCode(bytes[pos++]);
        }
        pos++; // Skip null
        
        // Picture type
        const pictureType = bytes[pos++];
        
        // Description (null-terminated, encoding depends on first byte)
        while (pos < bytes.length && bytes[pos] !== 0) {
            pos++;
        }
        pos++; // Skip null
        if (encoding === 1 || encoding === 2) pos++; // UTF-16 has double null
        
        // Image data
        const imageEnd = offset + 10 + frameSize;
        if (pos < imageEnd && imageEnd <= bytes.length) {
            const imageData = bytes.slice(pos, imageEnd);
            
            // Detect image type
            let detectedMime = mimeType;
            if (imageData[0] === 0xFF && imageData[1] === 0xD8) {
                detectedMime = 'image/jpeg';
            } else if (imageData[0] === 0x89 && imageData[1] === 0x50) {
                detectedMime = 'image/png';
            }
            
            // Convert to base64
            let base64 = '';
            for (let i = 0; i < imageData.length; i++) {
                base64 += String.fromCharCode(imageData[i]);
            }
            result.coverData = btoa(base64);
            result.coverMimeType = detectedMime || 'image/jpeg';
            
            console.log('Extracted cover art:', detectedMime, imageData.length, 'bytes');
        }
    } catch (e) {
        console.log('Error extracting APIC frame:', e);
    }
}

/**
 * Extract USLT (lyrics) frame from ID3v2
 */
function extractUSLTFrame(bytes, offset, result) {
    try {
        const frameSize = (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | 
                         (bytes[offset + 6] << 8) | bytes[offset + 7];
        
        if (frameSize <= 0 || frameSize > 1024 * 1024) return;
        
        let pos = offset + 10;
        const encoding = bytes[pos++];
        
        // Language (3 bytes)
        pos += 3;
        
        // Content descriptor (null-terminated)
        while (pos < bytes.length && bytes[pos] !== 0) pos++;
        pos++;
        if (encoding === 1 || encoding === 2) {
            while (pos < bytes.length && bytes[pos] !== 0) pos++;
            pos++;
        }
        
        // Lyrics
        const lyricsEnd = offset + 10 + frameSize;
        if (pos < lyricsEnd) {
            const lyricsBytes = bytes.slice(pos, lyricsEnd);
            result.lyrics = decodeID3Text(lyricsBytes, encoding);
            console.log('Extracted lyrics, length:', result.lyrics.length);
        }
    } catch (e) {
        console.log('Error extracting USLT frame:', e);
    }
}

/**
 * Extract text frame (TIT2, TPE1, etc.) from ID3v2
 */
function extractTextFrame(bytes, offset, field, result) {
    try {
        const frameSize = (bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | 
                         (bytes[offset + 6] << 8) | bytes[offset + 7];
        
        if (frameSize <= 0 || frameSize > 10000) return;
        
        let pos = offset + 10;
        const encoding = bytes[pos++];
        
        const textBytes = bytes.slice(pos, offset + 10 + frameSize);
        const text = decodeID3Text(textBytes, encoding);
        
        if (text) {
            result[field] = text;
            console.log(`Extracted ${field}:`, text);
        }
    } catch (e) {
        console.log('Error extracting text frame:', e);
    }
}

/**
 * Decode ID3v2 text based on encoding byte
 */
function decodeID3Text(bytes, encoding) {
    try {
        let decoder;
        switch (encoding) {
            case 0: // ISO-8859-1
                decoder = new TextDecoder('iso-8859-1');
                break;
            case 1: // UTF-16 with BOM
                if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
                    decoder = new TextDecoder('utf-16le');
                    bytes = bytes.slice(2);
                } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
                    decoder = new TextDecoder('utf-16be');
                    bytes = bytes.slice(2);
                } else {
                    decoder = new TextDecoder('utf-16le');
                }
                break;
            case 2: // UTF-16BE
                decoder = new TextDecoder('utf-16be');
                break;
            case 3: // UTF-8
                decoder = new TextDecoder('utf-8');
                break;
            default:
                decoder = new TextDecoder('utf-8', { fatal: false });
        }
        return decoder.decode(bytes).replace(/\0+$/, '').trim();
    } catch (e) {
        return new TextDecoder('utf-8', { fatal: false }).decode(bytes).replace(/\0+$/, '').trim();
    }
}

/**
 * Find ID3v2 tag at end of file
 */
function findID3v2AtEnd(bytes) {
    // Some WAV files have ID3v2 appended at the end
    // Search backwards for "ID3" marker
    const searchStart = Math.max(0, bytes.length - 1024 * 1024); // Last 1MB
    for (let i = bytes.length - 10; i >= searchStart; i--) {
        if (bytes[i] === 0x49 && bytes[i+1] === 0x44 && bytes[i+2] === 0x33) {
            return i;
        }
    }
    return -1;
}

/**
 * Extract lyrics from FLAC file (Vorbis Comments)
 */
function extractLyricsFromFLAC(bytes) {
    // FLAC files start with "fLaC" magic number
    if (bytes[0] !== 0x66 || bytes[1] !== 0x4C || bytes[2] !== 0x61 || bytes[3] !== 0x43) {
        console.log('Not a valid FLAC file');
        return null;
    }
    
    // Search for LYRICS or UNSYNCEDLYRICS in Vorbis comment block
    const searchPatterns = [
        'LYRICS=', 'lyrics=', 'Lyrics=',
        'UNSYNCEDLYRICS=', 'unsyncedlyrics=',
        'UNSYNCED LYRICS=', 'unsynced lyrics='
    ];
    
    return searchForLyricsPattern(bytes, searchPatterns);
}

/**
 * Extract lyrics from M4A/MP4 file (iTunes tags)
 */
function extractLyricsFromM4A(bytes) {
    // Search for ©lyr atom or lyrics in the file
    const searchPatterns = [
        '\u00A9lyr', '©lyr', 'lyr\0',
        'LYRICS=', 'lyrics='
    ];
    
    return searchForLyricsPattern(bytes, searchPatterns);
}

/**
 * Extract lyrics from OGG file (Vorbis Comments)
 */
function extractLyricsFromOGG(bytes) {
    // OGG files start with "OggS"
    if (bytes[0] !== 0x4F || bytes[1] !== 0x67 || bytes[2] !== 0x67 || bytes[3] !== 0x53) {
        console.log('Not a valid OGG file');
        return null;
    }
    
    const searchPatterns = [
        'LYRICS=', 'lyrics=', 'Lyrics=',
        'UNSYNCEDLYRICS=', 'unsyncedlyrics='
    ];
    
    return searchForLyricsPattern(bytes, searchPatterns);
}

/**
 * Extract lyrics from WAV file
 * WAV files can contain metadata in:
 * - LIST/INFO chunks (RIFF format)
 * - ID3 tags (embedded at the end)
 * - RIFF INFO fields
 */
function extractLyricsFromWAV(bytes) {
    // WAV files start with "RIFF"
    if (bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46) {
        console.log('Not a valid WAV/RIFF file');
        return null;
    }
    
    // Search for lyrics in various possible locations
    const searchPatterns = [
        'LYRICS=', 'lyrics=', 'Lyrics=',
        'ILYRICS', // RIFF INFO lyrics tag
        'USLT', // ID3 tag that might be embedded
        'UNSYNCEDLYRICS=', 'unsyncedlyrics='
    ];
    
    return searchForLyricsPattern(bytes, searchPatterns);
}

/**
 * Extract all metadata from WAV file (title, artist, etc.)
 * Returns an object with metadata fields
 * 
 * WAV/RIFF INFO chunk tags:
 * - INAM: Title/Name
 * - IART: Artist
 * - IPRD: Album/Product
/**
 * Search for lyrics patterns in raw bytes
 */
function searchForLyricsPattern(bytes, patterns) {
    // Convert bytes to string for searching (handle UTF-8)
    // We search in chunks to avoid memory issues with large files
    const chunkSize = 1024 * 1024; // 1MB chunks
    const maxSearchSize = Math.min(bytes.length, 10 * 1024 * 1024); // Limit to first 10MB
    
    for (let offset = 0; offset < maxSearchSize; offset += chunkSize) {
        const end = Math.min(offset + chunkSize + 1000, maxSearchSize); // Overlap to catch split patterns
        const chunk = bytes.slice(offset, end);
        
        // Try to decode as UTF-8
        let text;
        try {
            text = new TextDecoder('utf-8', { fatal: false }).decode(chunk);
        } catch (e) {
            continue;
        }
        
        for (const pattern of patterns) {
            const patternIndex = text.indexOf(pattern);
            if (patternIndex !== -1) {
                console.log(`Found lyrics pattern: ${pattern} at position ${offset + patternIndex}`);
                
                // Extract lyrics content after the pattern
                const startIndex = patternIndex + pattern.length;
                let lyrics = '';
                
                // For Vorbis comments, find the end (null byte or next field)
                // Lyrics can be quite long, search for reasonable end markers
                const remaining = text.substring(startIndex);
                
                // Find end of lyrics - look for common terminators
                let endIndex = remaining.length;
                
                // Check for null byte
                const nullIndex = remaining.indexOf('\0');
                if (nullIndex > 0 && nullIndex < endIndex) {
                    endIndex = nullIndex;
                }
                
                // Check for next Vorbis field (FIELDNAME=)
                const nextFieldMatch = remaining.match(/\n[A-Z][A-Z0-9_]*=/);
                if (nextFieldMatch && nextFieldMatch.index < endIndex) {
                    endIndex = nextFieldMatch.index;
                }
                
                lyrics = remaining.substring(0, endIndex).trim();
                
                // Validate it looks like lyrics
                if (lyrics.length > 20 && 
                    (lyrics.includes('\n') || lyrics.includes('[') || lyrics.length > 100)) {
                    // Clean up any binary garbage at the end
                    lyrics = lyrics.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
                    return lyrics;
                }
            }
        }
    }
    
    return null;
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
    
    // Sync to vertical mode
    const vAlbumArt = document.getElementById('vAlbumArt');
    if (vAlbumArt) vAlbumArt.src = url;
    
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
    
    // Sync to vertical mode
    const vTitle = document.getElementById('vDisplayTitle');
    const vArtist = document.getElementById('vDisplayArtist');
    if (vTitle) vTitle.textContent = title;
    if (vArtist) vArtist.textContent = artist;
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
    
    // Always sync to vertical mode (so it's ready when switching)
    syncVerticalLyrics();
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
    
    // Also center vertical mode lyrics
    centerVerticalLyric(centerOffset);
}

function centerVerticalLyric(horizontalOffset) {
    const vContainer = document.getElementById('vLyricsContainer');
    const vPanel = document.getElementById('vLyricsPanel');
    if (!vContainer || !vPanel) return;
    
    const currentLine = vContainer.querySelector('.current-line');
    if (!currentLine) {
        // Use horizontal offset if no current line found yet
        vContainer.style.transform = `translateY(${-horizontalOffset}px)`;
        return;
    }
    
    // Get panel height for vertical mode
    const panelHeight = vPanel.clientHeight;
    
    // Calculate offset to center current lyric
    const currentLineTop = currentLine.offsetTop;
    const currentLineHeight = currentLine.offsetHeight;
    const centerOffset = currentLineTop - (panelHeight / 2) + (currentLineHeight / 2);
    
    vContainer.style.transform = `translateY(${-centerOffset}px)`;
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

/**
 * Detect the script/language type of a character
 * Returns: 'hiragana', 'katakana', 'cjk', 'latin', 'other'
 */
function getCharType(char) {
    const code = char.charCodeAt(0);
    // Hiragana: U+3040 - U+309F
    if (code >= 0x3040 && code <= 0x309F) return 'hiragana';
    // Katakana: U+30A0 - U+30FF
    if (code >= 0x30A0 && code <= 0x30FF) return 'katakana';
    // Katakana extended: U+31F0 - U+31FF
    if (code >= 0x31F0 && code <= 0x31FF) return 'katakana';
    // Half-width Katakana: U+FF65 - U+FF9F
    if (code >= 0xFF65 && code <= 0xFF9F) return 'katakana';
    // CJK Unified Ideographs (Chinese/Japanese Kanji/Korean Hanja)
    if (code >= 0x4E00 && code <= 0x9FFF) return 'cjk';
    // CJK Extension A
    if (code >= 0x3400 && code <= 0x4DBF) return 'cjk';
    // Korean Hangul
    if (code >= 0xAC00 && code <= 0xD7AF) return 'korean';
    // Korean Jamo
    if (code >= 0x1100 && code <= 0x11FF) return 'korean';
    // Latin letters (basic + extended)
    if ((code >= 0x0041 && code <= 0x005A) || // A-Z
        (code >= 0x0061 && code <= 0x007A) || // a-z
        (code >= 0x00C0 && code <= 0x00FF) || // Latin Extended
        (code >= 0x0100 && code <= 0x017F)) { // Latin Extended-A
        return 'latin';
    }
    // Space
    if (char === ' ' || char === '　') return 'space';
    // Numbers
    if (code >= 0x0030 && code <= 0x0039) return 'number';
    // Full-width numbers
    if (code >= 0xFF10 && code <= 0xFF19) return 'number';
    
    return 'other';
}

/**
 * Analyze the dominant script type of a text segment
 */
function analyzeTextScript(text) {
    const counts = { hiragana: 0, katakana: 0, cjk: 0, latin: 0, korean: 0 };
    for (const char of text) {
        const type = getCharType(char);
        if (counts.hasOwnProperty(type)) {
            counts[type]++;
        }
    }
    
    // Japanese: has hiragana or katakana
    const hasJapanese = counts.hiragana > 0 || counts.katakana > 0;
    // Pure CJK (Chinese): only CJK characters, no kana
    const isPureChinese = counts.cjk > 0 && !hasJapanese && counts.korean === 0;
    // Has Latin
    const hasLatin = counts.latin > 0;
    // Korean
    const hasKorean = counts.korean > 0;
    
    return {
        hasJapanese,
        isPureChinese,
        hasLatin,
        hasKorean,
        counts
    };
}

/**
 * Try to find the split point between original lyrics and translation
 * based on script type changes
 */
function findScriptSplitPoint(text) {
    if (!text || text.length < 4) return -1;
    
    const chars = [...text]; // Handle multi-byte characters correctly
    const types = chars.map(c => getCharType(c));
    
    // Look for transition points where the script type changes significantly
    // Common patterns:
    // - Japanese (kana + kanji) -> Chinese (pure kanji)
    // - Japanese/Chinese -> Latin (romaji)
    // - Latin -> Chinese/Japanese
    
    let lastNonSpaceType = null;
    let lastNonSpaceIndex = -1;
    let potentialSplitPoints = [];
    
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type === 'space' || type === 'other' || type === 'number') continue;
        
        if (lastNonSpaceType !== null && lastNonSpaceType !== type) {
            // Check if this is a significant transition
            const isSignificantTransition = 
                // Kana to pure CJK (Japanese -> Chinese translation)
                ((lastNonSpaceType === 'hiragana' || lastNonSpaceType === 'katakana') && type === 'cjk') ||
                // CJK to Kana might indicate mixed, check previous context
                (lastNonSpaceType === 'cjk' && (type === 'hiragana' || type === 'katakana')) ||
                // Latin to CJK (English -> Chinese/Japanese)
                (lastNonSpaceType === 'latin' && (type === 'cjk' || type === 'hiragana' || type === 'katakana')) ||
                // CJK/Kana to Latin (for romaji translations)
                ((lastNonSpaceType === 'cjk' || lastNonSpaceType === 'hiragana' || lastNonSpaceType === 'katakana') && type === 'latin') ||
                // Korean transitions
                (lastNonSpaceType === 'korean' && type !== 'korean') ||
                (lastNonSpaceType !== 'korean' && type === 'korean');
            
            if (isSignificantTransition) {
                // Find the space before this transition
                for (let j = i - 1; j >= lastNonSpaceIndex; j--) {
                    if (types[j] === 'space') {
                        potentialSplitPoints.push({
                            index: j,
                            from: lastNonSpaceType,
                            to: type
                        });
                        break;
                    }
                }
            }
        }
        
        lastNonSpaceType = type;
        lastNonSpaceIndex = i;
    }
    
    if (potentialSplitPoints.length === 0) return -1;
    
    // Prefer splits that are more likely to be translation boundaries
    // Prioritize: Japanese->Chinese, English->Chinese, Japanese->Latin
    for (const point of potentialSplitPoints) {
        const { from, to } = point;
        // Japanese (kana) followed by pure CJK section likely means Chinese translation
        if ((from === 'hiragana' || from === 'katakana') && to === 'cjk') {
            // Verify the rest is mostly CJK (Chinese translation)
            const restText = text.substring(point.index + 1);
            const restAnalysis = analyzeTextScript(restText);
            if (restAnalysis.isPureChinese) {
                return point.index;
            }
        }
        // Latin to CJK
        if (from === 'latin' && to === 'cjk') {
            return point.index;
        }
    }
    
    // If no clear pattern, use the first significant split point
    // But only if both parts have reasonable length
    for (const point of potentialSplitPoints) {
        const beforeLen = text.substring(0, point.index).trim().length;
        const afterLen = text.substring(point.index + 1).trim().length;
        if (beforeLen >= 2 && afterLen >= 2) {
            return point.index;
        }
    }
    
    return -1;
}

/**
 * Split lyric text into original and translation
 * Supports multiple formats:
 * - "原文/翻译" or "原文//翻译"
 * - "原文｜翻译" or "原文|翻译"
 * - "原文（翻译）" or "原文(翻译)"
 * - "原文「翻译」"
 * - "原文【翻译】"
 * - Smart detection: "日本語歌詞 中文翻译" (space-separated, different scripts)
 */
function splitLyricAndTranslation(text) {
    if (!text) return { original: '', translation: '' };
    
    // Pattern 1: Separated by // or /
    // Use // first to avoid splitting on single / in lyrics
    if (text.includes('//')) {
        const parts = text.split('//');
        if (parts.length >= 2) {
            return { 
                original: parts[0].trim(), 
                translation: parts.slice(1).join('//').trim() 
            };
        }
    }
    
    // Pattern 2: Separated by | or ｜ (fullwidth)
    const pipeMatch = text.match(/^(.+?)[|｜](.+)$/);
    if (pipeMatch) {
        return { 
            original: pipeMatch[1].trim(), 
            translation: pipeMatch[2].trim() 
        };
    }
    
    // Pattern 3: Translation in parentheses at the end （）or ()
    // Match Chinese parentheses
    const cnParenMatch = text.match(/^(.+?)（([^）]+)）\s*$/);
    if (cnParenMatch) {
        return { 
            original: cnParenMatch[1].trim(), 
            translation: cnParenMatch[2].trim() 
        };
    }
    // Match English parentheses at end
    const enParenMatch = text.match(/^(.+?)\(([^)]+)\)\s*$/);
    if (enParenMatch) {
        // Check if the content in parentheses looks like translation (contains CJK or is longer)
        const parenContent = enParenMatch[2].trim();
        const mainContent = enParenMatch[1].trim();
        // If parentheses content contains Chinese/Japanese/Korean, it's likely translation
        if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(parenContent) ||
            /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(mainContent)) {
            return { 
                original: mainContent, 
                translation: parenContent 
            };
        }
    }
    
    // Pattern 4: Translation in 「」
    const jpBracketMatch = text.match(/^(.+?)「([^」]+)」\s*$/);
    if (jpBracketMatch) {
        return { 
            original: jpBracketMatch[1].trim(), 
            translation: jpBracketMatch[2].trim() 
        };
    }
    
    // Pattern 5: Translation in 【】
    const cnBracketMatch = text.match(/^(.+?)【([^】]+)】\s*$/);
    if (cnBracketMatch) {
        return { 
            original: cnBracketMatch[1].trim(), 
            translation: cnBracketMatch[2].trim() 
        };
    }
    
    // Pattern 6: Single / separator (be careful with this one)
    // Only use if the text doesn't look like a path and has substantial content on both sides
    const slashParts = text.split('/');
    if (slashParts.length === 2) {
        const left = slashParts[0].trim();
        const right = slashParts[1].trim();
        // Both parts should have some content and one should contain CJK characters
        if (left.length >= 2 && right.length >= 2 &&
            (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(left) ||
             /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(right))) {
            return { original: left, translation: right };
        }
    }
    
    // Pattern 7: Smart script-based detection for space-separated lyrics
    // e.g., "きみのことが好きだよ 我喜欢你" or "I love you 我爱你"
    const splitIndex = findScriptSplitPoint(text);
    if (splitIndex > 0) {
        const original = text.substring(0, splitIndex).trim();
        const translation = text.substring(splitIndex + 1).trim();
        if (original.length >= 2 && translation.length >= 2) {
            return { original, translation };
        }
    }
    
    // No translation found
    return { original: text, translation: '' };
}

/**
 * Parse lyrics with improved translation detection
 * Logic:
 * 1. First detect if the file uses "dual-line" mode (same timestamp for original + translation)
 * 2. If dual-line mode is detected, ALL single lines are treated as original only (no splitting)
 * 3. If no dual-line pairs found, try to split single lines by delimiter/script detection
 */
function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    
    // First pass: collect all timestamped lines with their raw text
    const timestampedLines = [];
    
    for (const line of lines) {
        const timeMatch = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/);
        
        if (timeMatch) {
            const minutes = parseInt(timeMatch[1]);
            const seconds = parseInt(timeMatch[2]);
            const ms = timeMatch[3] ? parseInt(timeMatch[3].padEnd(3, '0')) : 0;
            const time = minutes * 60 + seconds + ms / 1000;
            const rawText = timeMatch[4].trim();
            
            if (rawText) {
                timestampedLines.push({ time, rawText, used: false });
            }
        }
    }
    
    // Detect if file uses dual-line mode (check for any same-timestamp pairs)
    let hasDualLineMode = false;
    for (let i = 0; i < timestampedLines.length - 1; i++) {
        const current = timestampedLines[i];
        const next = timestampedLines[i + 1];
        if (Math.abs(next.time - current.time) < 0.5) {
            hasDualLineMode = true;
            console.log('Detected dual-line lyrics mode (same timestamp pairs found)');
            break;
        }
    }
    
    // Second pass: group same-timestamp lines and build lyrics array
    const lyrics = [];
    
    for (let i = 0; i < timestampedLines.length; i++) {
        const current = timestampedLines[i];
        if (current.used) continue;
        
        // Check if next line has same timestamp (within 0.5 seconds)
        const next = timestampedLines[i + 1];
        
        if (next && !next.used && Math.abs(next.time - current.time) < 0.5) {
            // Same timestamp - first is original, second is translation
            current.used = true;
            next.used = true;
            
            lyrics.push({
                time: current.time,
                text: current.rawText,
                translation: next.rawText
            });
        } else {
            // Single line
            current.used = true;
            
            if (hasDualLineMode) {
                // Dual-line mode detected: don't split, treat as original only
                lyrics.push({
                    time: current.time,
                    text: current.rawText,
                    translation: ''
                });
            } else {
                // No dual-line mode: try to split by delimiter/script
                const { original, translation } = splitLyricAndTranslation(current.rawText);
                lyrics.push({
                    time: current.time,
                    text: original,
                    translation: translation
                });
            }
        }
    }
    
    // Third pass: check for non-timestamped lines as translations (only if not in dual-line mode)
    if (!hasDualLineMode) {
        let lyricIndex = 0;
        for (const line of lines) {
            const timeMatch = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/);
            
            if (timeMatch) {
                // Find corresponding lyric entry
                const minutes = parseInt(timeMatch[1]);
                const seconds = parseInt(timeMatch[2]);
                const ms = timeMatch[3] ? parseInt(timeMatch[3].padEnd(3, '0')) : 0;
                const time = minutes * 60 + seconds + ms / 1000;
                
                // Find the lyric with this time
                for (let j = lyricIndex; j < lyrics.length; j++) {
                    if (Math.abs(lyrics[j].time - time) < 0.5) {
                        lyricIndex = j;
                        break;
                    }
                }
            } else if (line.trim() && lyricIndex < lyrics.length) {
                // Non-timestamped line - might be translation for previous lyric
                const currentLyric = lyrics[lyricIndex];
                if (currentLyric && !currentLyric.translation) {
                    currentLyric.translation = line.trim();
                }
            }
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

/**
 * Handle Tab key in review textarea to insert spaces instead of switching focus
 */
function handleReviewTextareaKeydown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const spaces = '    '; // 4 spaces for indent
        
        // Insert spaces at cursor position
        textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
        
        // Move cursor after the inserted spaces
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
        
        // Trigger input event to update display
        updateReviewDisplay();
    }
}

function updateReviewDisplay() {
    const content = elements.reviewContent.value || '在这里输入您对这首歌曲的评价...';
    const author = elements.reviewAuthor.value || '署名';
    const date = elements.reviewDate.value || new Date().toLocaleDateString('zh-CN').replace(/\//g, '.');
    
    elements.displayReviewContent.textContent = content;
    elements.displayReviewAuthor.textContent = author;
    elements.displayReviewDate.textContent = date;
    
    // Sync to vertical review module
    const vReviewContent = document.getElementById('vDisplayReviewContent');
    const vReviewAuthor = document.getElementById('vDisplayReviewAuthor');
    const vReviewDate = document.getElementById('vDisplayReviewDate');
    if (vReviewContent) vReviewContent.textContent = content;
    if (vReviewAuthor) vReviewAuthor.textContent = author;
    if (vReviewDate) vReviewDate.textContent = date;
}

/**
 * Initialize time inputs with default values
 */
function initializeTimeInputs() {
    // Parse total time from input field
    const totalTimeStr = elements.totalTimeInput.value || '3:25';
    totalDuration = parseTimeToSeconds(totalTimeStr);
    
    // Set current time based on slider position
    const progress = elements.progressSlider.value / 100;
    const currentSeconds = Math.floor(progress * totalDuration);
    elements.currentTimeInput.value = formatTime(currentSeconds);
    
    updateTimeDisplay();
}

/**
 * Parse time string (m:ss or mm:ss) to seconds
 */
function parseTimeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.trim().split(':');
    if (parts.length === 2) {
        const mins = parseInt(parts[0], 10) || 0;
        const secs = parseInt(parts[1], 10) || 0;
        return mins * 60 + secs;
    } else if (parts.length === 1) {
        // Just seconds
        return parseInt(parts[0], 10) || 0;
    }
    return 0;
}

/**
 * Handle total time input change
 */
function handleTotalTimeInput() {
    const timeStr = elements.totalTimeInput.value;
    const seconds = parseTimeToSeconds(timeStr);
    if (seconds > 0) {
        totalDuration = seconds;
        // Recalculate current time input based on slider
        const progress = elements.progressSlider.value / 100;
        const currentSeconds = Math.floor(progress * totalDuration);
        elements.currentTimeInput.value = formatTime(currentSeconds);
        updateTimeDisplay();
        updateLyrics();
    }
}

/**
 * Handle current time input change
 */
function handleCurrentTimeInput() {
    const timeStr = elements.currentTimeInput.value;
    const currentSeconds = parseTimeToSeconds(timeStr);
    if (totalDuration > 0) {
        // Calculate progress percentage
        const progress = Math.min(100, Math.max(0, (currentSeconds / totalDuration) * 100));
        elements.progressSlider.value = progress;
        updateProgress();
    }
}

function updateProgress() {
    const progress = elements.progressSlider.value;
    
    // Update progress bar
    elements.progressBarFill.style.width = `${progress}%`;
    
    // Sync to vertical mode
    const vProgressFill = document.getElementById('vProgressBarFill');
    if (vProgressFill) vProgressFill.style.width = `${progress}%`;
    
    // Update time display and current time input
    updateTimeDisplay();
    
    // Update current time input field
    const currentSeconds = Math.floor((progress / 100) * totalDuration);
    elements.currentTimeInput.value = formatTime(currentSeconds);
    
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
    
    // Sync to vertical mode
    const vCurrentTime = document.getElementById('vDisplayCurrentTime');
    const vTotalTime = document.getElementById('vDisplayTotalTime');
    if (vCurrentTime) vCurrentTime.textContent = currentFormatted;
    if (vTotalTime) vTotalTime.textContent = totalFormatted;
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
    elements.lyricsWidthValue.textContent = elements.lyricsWidth.value;
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
    
    // Sync font sizes to vertical review module
    const vReviewContentEl = document.getElementById('vDisplayReviewContent');
    const vReviewAuthorEl = document.getElementById('vDisplayReviewAuthor');
    const vReviewDateEl = document.getElementById('vDisplayReviewDate');
    if (vReviewContentEl) {
        vReviewContentEl.style.fontSize = reviewFontSize;
        if (vReviewAuthorEl) vReviewAuthorEl.style.fontSize = reviewMetaFontSize;
        if (vReviewDateEl) vReviewDateEl.style.fontSize = reviewMetaFontSize;
    }
    
    // Apply lyrics height
    const lyricsHeight = elements.lyricsHeight.value + '%';
    elements.lyricsPanel.style.flex = `0 0 ${lyricsHeight}`;
    
    // Apply lyrics width (for both horizontal and vertical modes)
    const lyricsWidth = elements.lyricsWidth.value + '%';
    elements.lyricsContainer.style.width = lyricsWidth;
    elements.lyricsContainer.style.margin = '0 auto';
    
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
    // Also apply to the image itself for html2canvas compatibility
    elements.albumArt.style.borderRadius = borderRadius;
    
    // Apply progress bar height
    const progressBarHeight = elements.progressBarHeight.value + 'px';
    document.querySelector('.progress-bar-bg').style.height = progressBarHeight;
    document.querySelector('.progress-bar-fill').style.height = progressBarHeight;
    document.querySelector('.progress-bar-bg').style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    document.querySelector('.progress-bar-fill').style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    
    // Apply progress time font size
    const progressTimeFontSize = elements.progressTimeFontSize.value + 'px';
    document.querySelector('.progress-time').style.fontSize = progressTimeFontSize;
    
    // Apply blur strength (only for dark theme)
    const blurStrength = elements.blurStrength.value + 'px';
    elements.dynamicBg.style.filter = `blur(${blurStrength})`;
    if (currentTheme === 'dark') {
        elements.overlayLayer.style.backdropFilter = `blur(${parseInt(blurStrength) * 0.75}px)`;
        elements.overlayLayer.style.background = 'var(--overlay-color)';
    } else {
        elements.overlayLayer.style.backdropFilter = 'none';
        elements.overlayLayer.style.background = 'transparent';
    }
    
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
    
    // Sync styles to vertical review module
    const vReviewContentColor = document.getElementById('vDisplayReviewContent');
    if (vReviewContentColor) {
        vReviewContentColor.style.color = `rgb(${reviewGray}, ${reviewGray}, ${reviewGray})`;
    }
    
    // Sync all styles to vertical mode if active
    if (currentLayout === 'vertical') {
        syncVerticalStyles();
    }
}

// Sync styles to vertical mode elements
function syncVerticalStyles() {
    // Sync cover size
    const coverSize = elements.coverSize.value + 'px';
    const vAlbumArt = document.getElementById('vAlbumArt');
    const vAlbumArtContainer = document.querySelector('.cover-module .v-album-art-container');
    if (vAlbumArtContainer) {
        vAlbumArtContainer.style.width = coverSize;
        vAlbumArtContainer.style.height = coverSize;
    }
    if (vAlbumArt) {
        vAlbumArt.style.borderRadius = elements.borderRadius.value + 'px';
    }
    
    // Sync title/artist styles
    const vTitle = document.getElementById('vDisplayTitle');
    const vArtist = document.getElementById('vDisplayArtist');
    const vMetadataPanel = document.querySelector('.cover-module .v-metadata-panel');
    if (vTitle) {
        vTitle.style.fontSize = elements.titleFontSize.value + 'px';
        vTitle.style.color = `rgb(${elements.titleGray.value}, ${elements.titleGray.value}, ${elements.titleGray.value})`;
        vTitle.style.marginBottom = elements.titleArtistGap.value + 'px';
        vTitle.style.fontFamily = `"${elements.titleFont.value}", sans-serif`;
    }
    if (vArtist) {
        vArtist.style.fontSize = elements.artistFontSize.value + 'px';
        vArtist.style.color = `rgb(${elements.artistGray.value}, ${elements.artistGray.value}, ${elements.artistGray.value})`;
        vArtist.style.fontFamily = `"${elements.artistFont.value}", sans-serif`;
    }
    
    // Sync gap between metadata and cover (using module content gap)
    const vModuleContent = document.querySelector('.cover-module .module-content');
    if (vModuleContent) {
        vModuleContent.style.gap = elements.metadataCoverGap.value + 'px';
    }
    
    // Sync progress bar styles
    const vProgressBg = document.querySelector('.lyrics-module .progress-bar-bg');
    const vProgressFill = document.getElementById('vProgressBarFill');
    const vProgressTime = document.querySelector('.lyrics-module .progress-time');
    const progressBarHeight = elements.progressBarHeight.value + 'px';
    const progressTimeFontSize = elements.progressTimeFontSize.value + 'px';
    
    if (vProgressBg) {
        vProgressBg.style.height = progressBarHeight;
        vProgressBg.style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    }
    if (vProgressFill) {
        vProgressFill.style.height = progressBarHeight;
        vProgressFill.style.borderRadius = (parseInt(elements.progressBarHeight.value) / 2) + 'px';
    }
    if (vProgressTime) {
        vProgressTime.style.fontSize = progressTimeFontSize;
    }
    
    // Sync lyrics fade effect using mask-image (same as horizontal mode)
    const vLyricsPanel = document.getElementById('vLyricsPanel');
    if (vLyricsPanel) {
        const lyricsFade = parseInt(elements.lyricsFade.value);
        const fadeEnd = 100 - lyricsFade;
        const maskImage = `linear-gradient(to bottom, transparent 0%, black ${lyricsFade}%, black ${fadeEnd}%, transparent 100%)`;
        vLyricsPanel.style.maskImage = maskImage;
        vLyricsPanel.style.webkitMaskImage = maskImage;
        
        // Sync alignment
        const lyricsAlign = elements.lyricsAlign.value;
        vLyricsPanel.classList.remove('align-left', 'align-center');
        vLyricsPanel.classList.add(`align-${lyricsAlign}`);
    }
    
    // Sync lyrics styles
    syncVerticalLyrics();
    
    // Sync review styles
    const vReviewPanel = document.querySelector('.review-module .v-review-panel');
    const vReviewContent = document.getElementById('vDisplayReviewContent');
    const vReviewAuthor = document.getElementById('vDisplayReviewAuthor');
    const vReviewDate = document.getElementById('vDisplayReviewDate');
    
    if (vReviewPanel) {
        const reviewBgOpacity = elements.reviewBgOpacity.value / 100;
        if (currentTheme === 'dark') {
            vReviewPanel.style.background = `rgba(0, 0, 0, ${reviewBgOpacity})`;
        } else {
            vReviewPanel.style.background = `rgba(255, 255, 255, ${0.3 + reviewBgOpacity * 0.7})`;
        }
        vReviewPanel.style.width = elements.reviewBoxWidth.value + '%';
        vReviewPanel.style.minHeight = elements.reviewBoxHeight.value + 'px';
    }
    if (vReviewContent) {
        vReviewContent.style.fontSize = elements.reviewFontSize.value + 'px';
        vReviewContent.style.color = `rgb(${elements.reviewGray.value}, ${elements.reviewGray.value}, ${elements.reviewGray.value})`;
        vReviewContent.style.fontFamily = `"${elements.reviewFont.value}", sans-serif`;
    }
    if (vReviewAuthor) {
        vReviewAuthor.style.fontSize = elements.reviewMetaFontSize.value + 'px';
    }
    if (vReviewDate) {
        vReviewDate.style.fontSize = elements.reviewMetaFontSize.value + 'px';
    }
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
    
    // Apply position transforms to individual elements (horizontal mode)
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
    
    // Apply position transforms to vertical mode elements
    if (currentLayout === 'vertical') {
        const vMetadataPanel = document.querySelector('.cover-module .v-metadata-panel');
        const vAlbumArtContainer = document.querySelector('.cover-module .v-album-art-container');
        const vLyricsPanel = document.getElementById('vLyricsPanel');
        const vProgressPanel = document.getElementById('vProgressPanel');
        const vReviewPanel = document.querySelector('.review-module .v-review-panel');
        
        if (vMetadataPanel) {
            vMetadataPanel.style.transform = `translate(${metadataX}px, ${metadataY}px)`;
        }
        if (vAlbumArtContainer) {
            vAlbumArtContainer.style.transform = `translate(${coverX}px, ${coverY}px)`;
        }
        if (vLyricsPanel) {
            vLyricsPanel.style.transform = `translate(${lyricsX}px, ${lyricsY}px)`;
        }
        if (vProgressPanel) {
            vProgressPanel.style.transform = `translate(${progressX}px, ${progressY}px)`;
        }
        if (vReviewPanel) {
            vReviewPanel.style.transform = `translate(${reviewX}px, ${reviewY}px)`;
        }
    }
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
    
    // Sync alignment to vertical mode
    if (currentLayout === 'vertical') {
        const vMetadataPanel = document.querySelector('.cover-module .v-metadata-panel');
        const vLyricsPanel = document.getElementById('vLyricsPanel');
        const vLyricsContainer = document.getElementById('vLyricsContainer');
        
        if (vMetadataPanel) {
            vMetadataPanel.style.textAlign = metadataAlign;
        }
        if (vLyricsPanel) {
            vLyricsPanel.classList.remove('align-left', 'align-center');
            vLyricsPanel.classList.add(`align-${lyricsAlign}`);
        }
        if (vLyricsContainer) {
            vLyricsContainer.style.textAlign = lyricsAlign;
        }
    }
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
    
    // Sync fonts to vertical mode
    if (currentLayout === 'vertical') {
        const vTitle = document.getElementById('vDisplayTitle');
        const vArtist = document.getElementById('vDisplayArtist');
        const vReviewContent = document.getElementById('vDisplayReviewContent');
        
        if (vTitle) vTitle.style.fontFamily = `"${titleFont}", sans-serif`;
        if (vArtist) vArtist.style.fontFamily = `"${artistFont}", sans-serif`;
        if (vReviewContent) vReviewContent.style.fontFamily = `"${reviewFont}", serif`;
        
        syncVerticalLyrics();
    }
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
    
    // Get dimensions based on layout mode
    const { width: targetWidth, height: targetHeight } = getExportDimensions();
    
    // Calculate scale to fit into available space
    const scaleX = availableWidth / targetWidth;
    const scaleY = availableHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    container.style.transform = `scale(${scale})`;
    elements.scaleValue.textContent = `${Math.round(scale * 100)}%`;
}

// ============================================
// Layout Mode Management
// ============================================
function setLayoutMode(layout) {
    // Save current layout settings before switching
    if (currentLayout !== layout) {
        saveSettings();
    }
    
    currentLayout = layout;
    const container = elements.previewContainer;
    const verticalOptions = document.getElementById('verticalOptions');
    const resolutionInfo = document.getElementById('resolutionInfo');
    
    // Load settings for the new layout mode
    loadLayoutSettings();
    
    if (layout === 'vertical') {
        container.classList.add('vertical-mode');
        verticalOptions.style.display = 'block';
        
        // Initialize with default modules
        updateVerticalModules();
        updateVerticalTitlePosition();
        syncVerticalContent();
    } else {
        container.classList.remove('vertical-mode', 'with-lyrics', 'with-review', 'title-above');
        verticalOptions.style.display = 'none';
        resolutionInfo.innerHTML = '<span>输出分辨率: 3840 × 2160</span>';
    }
    
    updatePreviewScale();
}

function updateVerticalModules() {
    const container = elements.previewContainer;
    const showLyrics = document.getElementById('showLyricsModule').checked;
    const showReview = document.getElementById('showReviewModule').checked;
    
    // Update classes
    container.classList.toggle('with-lyrics', showLyrics);
    container.classList.toggle('with-review', showReview);
    
    updateResolutionDisplay();
    updatePreviewScale();
}

function updateVerticalTitlePosition() {
    const container = elements.previewContainer;
    const position = document.getElementById('verticalTitlePosition').value;
    
    if (position === 'above') {
        container.classList.add('title-above');
    } else {
        container.classList.remove('title-above');
    }
}

function updateResolutionDisplay() {
    if (currentLayout !== 'vertical') return;
    
    const showLyrics = document.getElementById('showLyricsModule').checked;
    const showReview = document.getElementById('showReviewModule').checked;
    const resolutionInfo = document.getElementById('resolutionInfo');
    
    let height = 2400; // Base: cover module
    let modules = ['封面+标题 2400'];
    
    if (showLyrics) {
        height += 960;
        modules.push('歌词+进度 960');
    }
    if (showReview) {
        height += 960;
        modules.push('评价 960');
    }
    
    resolutionInfo.innerHTML = `<span>输出分辨率: 2160 × ${height}</span><br><small>(${modules.join(' + ')})</small>`;
}

// Sync content from horizontal to vertical modules
function syncVerticalContent() {
    // Sync title and artist
    const vTitle = document.getElementById('vDisplayTitle');
    const vArtist = document.getElementById('vDisplayArtist');
    if (vTitle) vTitle.textContent = elements.displayTitle.textContent;
    if (vArtist) vArtist.textContent = elements.displayArtist.textContent;
    
    // Sync album art
    const vAlbumArt = document.getElementById('vAlbumArt');
    if (vAlbumArt && elements.albumArt.src) {
        vAlbumArt.src = elements.albumArt.src;
    }
    
    // Sync progress bar
    const vProgressFill = document.getElementById('vProgressBarFill');
    const vCurrentTime = document.getElementById('vDisplayCurrentTime');
    const vTotalTime = document.getElementById('vDisplayTotalTime');
    if (vProgressFill) {
        vProgressFill.style.width = elements.progressBarFill.style.width;
    }
    if (vCurrentTime) vCurrentTime.textContent = document.getElementById('displayCurrentTime').textContent;
    if (vTotalTime) vTotalTime.textContent = document.getElementById('displayTotalTime').textContent;
    
    // Sync lyrics
    syncVerticalLyrics();
    
    // Sync review
    const vReviewContent = document.getElementById('vDisplayReviewContent');
    const vReviewAuthor = document.getElementById('vDisplayReviewAuthor');
    const vReviewDate = document.getElementById('vDisplayReviewDate');
    if (vReviewContent) vReviewContent.textContent = elements.displayReviewContent.textContent;
    if (vReviewAuthor) vReviewAuthor.textContent = elements.displayReviewAuthor.textContent;
    if (vReviewDate) vReviewDate.textContent = elements.displayReviewDate.textContent;
}

function syncVerticalLyrics() {
    const vLyricsContainer = document.getElementById('vLyricsContainer');
    const vLyricsPanel = document.getElementById('vLyricsPanel');
    if (!vLyricsContainer) return;
    
    // Clone lyrics from horizontal mode
    const horizontalLyrics = elements.lyricsContainer.innerHTML;
    vLyricsContainer.innerHTML = horizontalLyrics;
    
    // Apply same styles
    const lyricsFontSize = elements.lyricsFontSize.value + 'px';
    const translationFontSize = elements.translationFontSize.value + 'px';
    const lyricsGray = elements.lyricsGray.value;
    const translationGray = elements.translationGray.value;
    const lyricsFont = elements.lyricsFont.value;
    const translationFont = elements.translationFont.value;
    const lyricsLineGap = elements.lyricsLineGap.value + 'px';
    const lyricsWidth = elements.lyricsWidth.value + '%';
    
    // Apply width and center
    vLyricsContainer.style.width = lyricsWidth;
    vLyricsContainer.style.margin = '0 auto';
    vLyricsContainer.style.gap = lyricsLineGap;
    vLyricsContainer.style.padding = '150px 0';
    
    vLyricsContainer.querySelectorAll('.lyric-text').forEach(el => {
        el.style.fontSize = lyricsFontSize;
        el.style.color = `rgb(${lyricsGray}, ${lyricsGray}, ${lyricsGray})`;
        el.style.fontFamily = `"${lyricsFont}", sans-serif`;
    });
    
    vLyricsContainer.querySelectorAll('.lyric-translation').forEach(el => {
        el.style.fontSize = translationFontSize;
        el.style.color = `rgb(${translationGray}, ${translationGray}, ${translationGray})`;
        el.style.fontFamily = `"${translationFont}", sans-serif`;
    });
}

// Get current export dimensions based on layout mode
function getExportDimensions() {
    if (currentLayout === 'vertical') {
        const showLyrics = document.getElementById('showLyricsModule').checked;
        const showReview = document.getElementById('showReviewModule').checked;
        
        let height = 2400;
        if (showLyrics) height += 960;
        if (showReview) height += 960;
        
        return {
            width: 2160,
            height: height
        };
    }
    return {
        width: 3840,
        height: 2160
    };
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
        const size = Math.floor(Math.random() * 30) + 40;
        const opacity = (Math.random() * 0.15 + 0.18).toFixed(2);
        
        gradients.push(
            `radial-gradient(circle at ${posX}% ${posY}%, rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity}) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) ${size}%)`
        );
    }
    
    // Generate haze layers
    for (let i = 0; i < hazeLayers; i++) {
        const color = brightPalette[i % brightPalette.length];
        const posX = Math.floor(Math.random() * 100);
        const posY = Math.floor(Math.random() * 100);
        const size = Math.floor(Math.random() * 50) + 80;
        const opacity = (Math.random() * 0.08 + 0.06).toFixed(2);
        
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
    
    const container = elements.previewContainer;
    const originalTransform = container.style.transform;
    const { width, height } = getExportDimensions();
    
    try {
        // Remove transform for 100% scale capture
        container.style.transform = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Use dom-to-image-more for better CSS support
        const dataUrl = await domtoimage.toPng(container, {
            width: width,
            height: height,
            style: {
                transform: 'none'
            },
            filter: (node) => {
                // Include all nodes
                return true;
            }
        });
        
        // Restore original transform
        container.style.transform = originalTransform;
        
        // Create download
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const title = elements.trackTitle.value || 'music_summary';
        const layoutSuffix = currentLayout === 'vertical' ? '_vertical' : '_horizontal';
        link.download = `${title}${layoutSuffix}_${timestamp}.png`;
        link.href = dataUrl;
        link.click();
        
        btn.textContent = '导出成功!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Export failed:', error);
        // Always restore transform even on error
        container.style.transform = originalTransform;
        btn.textContent = '导出失败';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

// ============================================
// Copy to Clipboard
// ============================================
async function copyToClipboard() {
    const btn = document.getElementById('copyBtn');
    const originalText = btn.textContent;
    btn.textContent = '正在复制...';
    btn.disabled = true;
    
    const container = elements.previewContainer;
    const originalTransform = container.style.transform;
    const { width, height } = getExportDimensions();
    
    try {
        // Remove transform for 100% scale capture
        container.style.transform = 'none';
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Use dom-to-image-more to get blob
        const blob = await domtoimage.toBlob(container, {
            width: width,
            height: height,
            style: {
                transform: 'none'
            }
        });
        
        // Restore original transform
        container.style.transform = originalTransform;
        
        // Copy to clipboard
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);
        
        btn.textContent = '已复制!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Copy failed:', error);
        // Always restore transform even on error
        container.style.transform = originalTransform;
        btn.textContent = '复制失败';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

// ============================================
// Section Toggle (Collapsible)
// ============================================
function toggleSection(titleElement) {
    const section = titleElement.closest('.config-section');
    if (section) {
        section.classList.toggle('collapsed');
    }
}

// ============================================
// Scroll Navigation
// ============================================
function initializeScrollNav() {
    const sidebarContent = document.getElementById('sidebarContent');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            sidebarContent.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            sidebarContent.scrollTo({ top: sidebarContent.scrollHeight, behavior: 'smooth' });
        });
    }
}

// ============================================
// Settings Persistence
// ============================================
function getSettingsStorageKey() {
    return currentLayout === 'vertical' ? 'musicSummarySettings_vertical' : 'musicSummarySettings_horizontal';
}

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
        reviewMetaFontSize: elements.reviewMetaFontSize.value,
        lyricsLineGap: elements.lyricsLineGap.value,
        lyricsHeight: elements.lyricsHeight.value,
        lyricsWidth: elements.lyricsWidth.value,
        lyricsFade: elements.lyricsFade.value,
        reviewBoxWidth: elements.reviewBoxWidth.value,
        reviewBoxHeight: elements.reviewBoxHeight.value,
        reviewBgOpacity: elements.reviewBgOpacity.value,
        borderRadius: elements.borderRadius.value,
        progressBarHeight: elements.progressBarHeight.value,
        progressTimeFontSize: elements.progressTimeFontSize.value,
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
    
    // Save to layout-specific key
    localStorage.setItem(getSettingsStorageKey(), JSON.stringify(settings));
    
    // Also save layout mode and theme to common settings
    const commonSettings = {
        currentLayout: currentLayout,
        theme: currentTheme
    };
    localStorage.setItem('musicSummarySettings_common', JSON.stringify(commonSettings));
}

// Default settings for different modes
function getDefaultSettings(layout, theme) {
    if (layout === 'horizontal') {
        const base = {
            coverSize: '1200',
            titleArtistGap: '32',
            metadataCoverGap: '70',
            coverProgressGap: '150',
            titleFontSize: '72',
            artistFontSize: '60',
            lyricsFontSize: '72',
            translationFontSize: '48',
            reviewFontSize: '54',
            reviewMetaFontSize: '28',
            lyricsLineGap: '50',
            lyricsHeight: '55',
            lyricsWidth: '100',
            lyricsFade: '50',
            reviewBoxWidth: '95',
            reviewBoxHeight: '600',
            reviewBgOpacity: '15',
            borderRadius: '48',
            progressBarHeight: '12',
            progressTimeFontSize: '32',
            blurStrength: '90',
            metadataAlign: 'center',
            lyricsAlign: 'left',
            metadataX: '0',
            metadataY: '110',
            coverX: '0',
            coverY: '130',
            progressX: '0',
            progressY: '130',
            lyricsX: '0',
            lyricsY: '40',
            reviewX: '0',
            reviewY: '40',
            titleFont: 'Microsoft YaHei',
            artistFont: 'Microsoft YaHei',
            lyricsFont: 'Microsoft YaHei',
            translationFont: 'Microsoft YaHei',
            reviewFont: 'Ma Shan Zheng'
        };
        if (theme === 'light') {
            return { ...base,
                titleGray: '50',
                artistGray: '90',
                lyricsGray: '10',
                translationGray: '90',
                reviewGray: '50'
            };
        } else {
            return { ...base,
                titleGray: '255',
                artistGray: '180',
                lyricsGray: '255',
                translationGray: '180',
                reviewGray: '220'
            };
        }
    } else {
        // Vertical mode
        const base = {
            coverSize: '1600',
            titleArtistGap: '32',
            metadataCoverGap: '120',
            coverProgressGap: '150',
            titleFontSize: '100',
            artistFontSize: '80',
            lyricsFontSize: '72',
            translationFontSize: '48',
            reviewFontSize: '54',
            reviewMetaFontSize: '28',
            lyricsLineGap: '40',
            lyricsHeight: '60',
            lyricsWidth: '100',
            lyricsFade: '50',
            reviewBoxWidth: '85',
            reviewBoxHeight: '700',
            reviewBgOpacity: '15',
            borderRadius: '48',
            progressBarHeight: '24',
            progressTimeFontSize: '40',
            blurStrength: '90',
            metadataAlign: 'center',
            lyricsAlign: 'center',
            metadataX: '0',
            metadataY: '30',
            coverX: '0',
            coverY: '30',
            progressX: '0',
            progressY: '-130',
            lyricsX: '0',
            lyricsY: '-220',
            reviewX: '0',
            reviewY: '-60',
            titleFont: 'Microsoft YaHei',
            artistFont: 'Microsoft YaHei',
            lyricsFont: 'Microsoft YaHei',
            translationFont: 'Microsoft YaHei',
            reviewFont: 'Ma Shan Zheng',
            titleGray: '255',
            artistGray: '180',
            lyricsGray: '255',
            translationGray: '180',
            reviewGray: '220'
        };
        if (theme === 'light') {
            return { ...base,
                titleGray: '50',
                artistGray: '90',
                lyricsGray: '10',
                translationGray: '90',
                reviewGray: '50'
            };
        } else {
            return base;
        }
    }
}

function loadSettings() {
    // First load common settings (layout and theme)
    const commonSaved = localStorage.getItem('musicSummarySettings_common');
    if (commonSaved) {
        try {
            const commonSettings = JSON.parse(commonSaved);
            if (commonSettings.currentLayout) {
                currentLayout = commonSettings.currentLayout;
            }
            if (commonSettings.theme) {
                currentTheme = commonSettings.theme;
            }
        } catch (e) {
            console.log('Error loading common settings:', e);
        }
    }
    
    // Then load layout-specific settings
    loadLayoutSettings();
}

function loadLayoutSettings() {
    const saved = localStorage.getItem(getSettingsStorageKey());
    
    // Use default settings if no saved settings exist
    const defaults = getDefaultSettings(currentLayout, currentTheme);
    const settings = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    
    try {
        
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
        if (settings.lyricsWidth) elements.lyricsWidth.value = settings.lyricsWidth;
        if (settings.lyricsFade) elements.lyricsFade.value = settings.lyricsFade;
        if (settings.reviewBoxWidth) elements.reviewBoxWidth.value = settings.reviewBoxWidth;
        if (settings.reviewBoxHeight) elements.reviewBoxHeight.value = settings.reviewBoxHeight;
        if (settings.reviewBgOpacity) elements.reviewBgOpacity.value = settings.reviewBgOpacity;
        if (settings.borderRadius) elements.borderRadius.value = settings.borderRadius;
        if (settings.blurStrength) elements.blurStrength.value = settings.blurStrength;
        if (settings.progressBarHeight) elements.progressBarHeight.value = settings.progressBarHeight;
        if (settings.progressTimeFontSize) elements.progressTimeFontSize.value = settings.progressTimeFontSize;
        if (settings.reviewMetaFontSize) elements.reviewMetaFontSize.value = settings.reviewMetaFontSize;
        
        // Gray scale settings - always use current theme's default values
        // This ensures gray scale is correctly applied when switching layouts
        const themeDefaults = getDefaultSettings(currentLayout, currentTheme);
        elements.titleGray.value = themeDefaults.titleGray;
        elements.artistGray.value = themeDefaults.artistGray;
        elements.lyricsGray.value = themeDefaults.lyricsGray;
        elements.translationGray.value = themeDefaults.translationGray;
        elements.reviewGray.value = themeDefaults.reviewGray;
        
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
        
        // Update displays
        updateStyles();
        updateFonts();
        updateVisibility();
        updateElementPositions();
        updateAlignment();
        
    } catch (e) {
        console.log('Error loading layout settings:', e);
    }
}

// Save settings on window close
window.addEventListener('beforeunload', saveSettings);
