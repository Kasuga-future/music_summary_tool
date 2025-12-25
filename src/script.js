/**
 * Music Summary - Main Script
 * 音乐总结工具核心逻辑
 * 支持 3840x2160 (4K) 输出
 */

// ============================================
// Global Variables & State
// ============================================
let currentMode = 'player'; // player, review, artist
let currentTheme = 'dark';
let currentCoverUrl = null;
let totalDuration = 225; // 默认 3:45
let currentPalette = [];
let audioContext = null;

// DOM Element References
const elements = {};

// Default Settings
const defaultSettings = {
    coverSize: 1100,
    lyricsFontSize: 48,
    borderRadius: 24,
    blurStrength: 80,
    showLyrics: true,
    showTranslation: true,
    showAlbumArt: true,
    showProgressBar: true,
    showControls: true,
    showMetadata: true
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    loadSettings();
    setMode('player');
    setTheme('dark');
    updatePreviewScale();
    generateDefaultCover();
    renderInkBackground();
    
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
    elements.albumName = document.getElementById('albumName');
    elements.lyricsInput = document.getElementById('lyricsInput');
    
    elements.showLyrics = document.getElementById('showLyrics');
    elements.showTranslation = document.getElementById('showTranslation');
    elements.showAlbumArt = document.getElementById('showAlbumArt');
    elements.showProgressBar = document.getElementById('showProgressBar');
    elements.showControls = document.getElementById('showControls');
    elements.showMetadata = document.getElementById('showMetadata');
    
    elements.progressSlider = document.getElementById('progressSlider');
    elements.currentTime = document.getElementById('currentTime');
    elements.totalTime = document.getElementById('totalTime');
    
    elements.reviewTitle = document.getElementById('reviewTitle');
    elements.reviewContent = document.getElementById('reviewContent');
    elements.reviewAuthor = document.getElementById('reviewAuthor');
    elements.reviewSection = document.getElementById('reviewSection');
    
    elements.coverSize = document.getElementById('coverSize');
    elements.lyricsFontSize = document.getElementById('lyricsFontSize');
    elements.borderRadius = document.getElementById('borderRadius');
    elements.blurStrength = document.getElementById('blurStrength');
    
    elements.coverSizeValue = document.getElementById('coverSizeValue');
    elements.lyricsFontSizeValue = document.getElementById('lyricsFontSizeValue');
    elements.borderRadiusValue = document.getElementById('borderRadiusValue');
    elements.blurStrengthValue = document.getElementById('blurStrengthValue');
    
    elements.exportBtn = document.getElementById('exportBtn');
    elements.refreshBgBtn = document.getElementById('refreshBgBtn');
    
    // Preview elements
    elements.previewContainer = document.getElementById('previewContainer');
    elements.bgLayer = document.getElementById('bgLayer');
    elements.dynamicBg = document.getElementById('dynamicBg');
    elements.overlayLayer = document.getElementById('overlayLayer');
    
    elements.playerContent = document.getElementById('playerContent');
    elements.reviewContent_el = document.getElementById('reviewContent');
    elements.artistContent = document.getElementById('artistContent');
    
    elements.albumArt = document.getElementById('albumArt');
    elements.albumArtReview = document.getElementById('albumArtReview');
    elements.artistImage = document.getElementById('artistImage');
    
    elements.albumArtContainer = document.getElementById('albumArtContainer');
    elements.albumArtContainerReview = document.getElementById('albumArtContainerReview');
    elements.artistImageContainer = document.getElementById('artistImageContainer');
    
    elements.displayTitle = document.getElementById('displayTitle');
    elements.displayArtist = document.getElementById('displayArtist');
    elements.displayTitleReview = document.getElementById('displayTitleReview');
    elements.displayArtistReview = document.getElementById('displayArtistReview');
    elements.displayArtistTitle = document.getElementById('displayArtistTitle');
    elements.displayArtistSubtitle = document.getElementById('displayArtistSubtitle');
    
    elements.lyricsContainer = document.getElementById('lyricsContainer');
    elements.lyricsContainerReview = document.getElementById('lyricsContainerReview');
    elements.lyricsPanel = document.getElementById('lyricsPanel');
    elements.lyricsPanelReview = document.getElementById('lyricsPanelReview');
    
    elements.progressBarFill = document.getElementById('progressBarFill');
    elements.displayCurrentTime = document.getElementById('displayCurrentTime');
    elements.displayTotalTime = document.getElementById('displayTotalTime');
    elements.progressPanel = document.getElementById('progressPanel');
    elements.controlsPanel = document.getElementById('controlsPanel');
    elements.metadataPanel = document.getElementById('metadataPanel');
    elements.metadataPanelReview = document.getElementById('metadataPanelReview');
    
    elements.reviewPanel = document.getElementById('reviewPanel');
    elements.displayReviewTitle = document.getElementById('displayReviewTitle');
    elements.displayReviewContent = document.getElementById('displayReviewContent');
    elements.displayReviewAuthor = document.getElementById('displayReviewAuthor');
    
    elements.artistReviewPanel = document.getElementById('artistReviewPanel');
    elements.displayArtistReview = document.getElementById('displayArtistReview');
    
    elements.scaleValue = document.getElementById('scaleValue');
}

function initializeEventListeners() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setMode(btn.dataset.mode);
        });
    });
    
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
    elements.albumName.addEventListener('input', updateDisplayText);
    elements.lyricsInput.addEventListener('input', updateLyrics);
    
    elements.reviewTitle.addEventListener('input', updateReviewDisplay);
    elements.reviewContent.addEventListener('input', updateReviewDisplay);
    elements.reviewAuthor.addEventListener('input', updateReviewDisplay);
    
    // Checkbox inputs
    elements.showLyrics.addEventListener('change', updateVisibility);
    elements.showTranslation.addEventListener('change', updateLyrics);
    elements.showAlbumArt.addEventListener('change', updateVisibility);
    elements.showProgressBar.addEventListener('change', updateVisibility);
    elements.showControls.addEventListener('change', updateVisibility);
    elements.showMetadata.addEventListener('change', updateVisibility);
    
    // Progress slider
    elements.progressSlider.addEventListener('input', updateProgress);
    
    // Style sliders
    elements.coverSize.addEventListener('input', updateStyles);
    elements.lyricsFontSize.addEventListener('input', updateStyles);
    elements.borderRadius.addEventListener('input', updateStyles);
    elements.blurStrength.addEventListener('input', updateStyles);
    
    // Export and refresh buttons
    elements.exportBtn.addEventListener('click', exportScreenshot);
    elements.refreshBgBtn.addEventListener('click', () => {
        if (currentTheme === 'light') {
            refreshInkColors();
        } else {
            renderInkBackground();
        }
    });
}

// ============================================
// Mode & Theme Management
// ============================================
function setMode(mode) {
    currentMode = mode;
    
    // Hide all content
    document.getElementById('playerContent').classList.add('hidden');
    document.getElementById('reviewContent').classList.add('hidden');
    document.getElementById('artistContent').classList.add('hidden');
    
    // Show selected mode
    switch(mode) {
        case 'player':
            document.getElementById('playerContent').classList.remove('hidden');
            elements.reviewSection.style.display = 'none';
            break;
        case 'review':
            document.getElementById('reviewContent').classList.remove('hidden');
            elements.reviewSection.style.display = 'block';
            break;
        case 'artist':
            document.getElementById('artistContent').classList.remove('hidden');
            elements.reviewSection.style.display = 'block';
            break;
    }
    
    updateDisplayText();
    updateLyrics();
    updateReviewDisplay();
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
        renderInkBackground();
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
function handleAudioUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    elements.audioFileName.textContent = file.name;
    
    // Parse ID3 tags using jsmediatags
    jsmediatags.read(file, {
        onSuccess: function(tag) {
            const tags = tag.tags;
            
            // Set title
            if (tags.title) {
                elements.trackTitle.value = tags.title;
            }
            
            // Set artist
            if (tags.artist) {
                elements.artistName.value = tags.artist;
            }
            
            // Set album
            if (tags.album) {
                elements.albumName.value = tags.album;
            }
            
            // Extract cover if available and no cover uploaded
            if (tags.picture && !currentCoverUrl) {
                const picture = tags.picture;
                const base64String = arrayBufferToBase64(picture.data);
                const imageUrl = `data:${picture.format};base64,${base64String}`;
                setCoverImage(imageUrl);
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
    
    // Set cover for all modes
    elements.albumArt.src = url;
    elements.albumArtReview.src = url;
    elements.artistImage.src = url;
    
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
            
            if (currentTheme === 'light') {
                renderInkBackground(palette);
            }
        } catch (e) {
            console.log('Error extracting colors:', e);
        }
    };
    img.src = url;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
    
    // Add music note icon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎵', 400, 400);
    
    const url = canvas.toDataURL();
    setCoverImage(url);
}

// ============================================
// Display Updates
// ============================================
function updateDisplayText() {
    const title = elements.trackTitle.value || '歌曲名称';
    const artist = elements.artistName.value || '艺术家';
    const album = elements.albumName.value || '';
    
    // Player mode
    elements.displayTitle.textContent = title;
    elements.displayArtist.textContent = artist;
    
    // Review mode
    elements.displayTitleReview.textContent = title;
    elements.displayArtistReview.textContent = artist;
    
    // Artist mode
    elements.displayArtistTitle.textContent = artist;
    elements.displayArtistSubtitle.textContent = album || title;
}

function updateLyrics() {
    const lyricsText = elements.lyricsInput.value;
    const showTranslation = elements.showTranslation.checked;
    const progress = elements.progressSlider.value / 100;
    const currentTimeSeconds = progress * totalDuration;
    
    const parsedLyrics = parseLyrics(lyricsText);
    const html = renderLyricsHTML(parsedLyrics, currentTimeSeconds, showTranslation);
    
    elements.lyricsContainer.innerHTML = html;
    elements.lyricsContainerReview.innerHTML = html;
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
    
    // Find current lyric index
    let currentIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime) {
            currentIndex = i;
        }
    }
    
    // Show lyrics around current position
    const startIndex = Math.max(0, currentIndex - 1);
    const endIndex = Math.min(lyrics.length, currentIndex + 5);
    
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
    const title = elements.reviewTitle.value || '评价标题';
    const content = elements.reviewContent.value || '在这里输入您对这首歌曲的评价...';
    const author = elements.reviewAuthor.value || '署名';
    
    elements.displayReviewTitle.textContent = title;
    elements.displayReviewContent.textContent = content;
    elements.displayReviewAuthor.textContent = `— ${author}`;
    elements.displayArtistReview.textContent = content;
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
    elements.lyricsPanelReview.style.display = showLyrics ? '' : 'none';
    
    // Album art
    const showAlbumArt = elements.showAlbumArt.checked;
    elements.albumArtContainer.style.display = showAlbumArt ? '' : 'none';
    elements.albumArtContainerReview.style.display = showAlbumArt ? '' : 'none';
    elements.artistImageContainer.style.display = showAlbumArt ? '' : 'none';
    
    // Progress bar
    const showProgressBar = elements.showProgressBar.checked;
    elements.progressPanel.style.display = showProgressBar ? '' : 'none';
    
    // Controls
    const showControls = elements.showControls.checked;
    elements.controlsPanel.style.display = showControls ? '' : 'none';
    
    // Metadata
    const showMetadata = elements.showMetadata.checked;
    elements.metadataPanel.style.display = showMetadata ? '' : 'none';
    elements.metadataPanelReview.style.display = showMetadata ? '' : 'none';
}

function updateStyles() {
    // Update value displays
    elements.coverSizeValue.textContent = elements.coverSize.value;
    elements.lyricsFontSizeValue.textContent = elements.lyricsFontSize.value;
    elements.borderRadiusValue.textContent = elements.borderRadius.value;
    elements.blurStrengthValue.textContent = elements.blurStrength.value;
    
    // Apply cover size
    const coverSize = elements.coverSize.value + 'px';
    elements.albumArtContainer.style.width = coverSize;
    elements.albumArtContainer.style.height = coverSize;
    elements.albumArtContainerReview.style.width = coverSize;
    elements.albumArtContainerReview.style.height = coverSize;
    elements.artistImageContainer.style.width = coverSize;
    elements.artistImageContainer.style.height = coverSize;
    
    // Apply lyrics font size
    const lyricsFontSize = elements.lyricsFontSize.value + 'px';
    document.querySelectorAll('.lyric-text').forEach(el => {
        el.style.fontSize = lyricsFontSize;
    });
    
    // Apply border radius
    const borderRadius = elements.borderRadius.value + 'px';
    elements.albumArtContainer.style.borderRadius = borderRadius;
    elements.albumArtContainerReview.style.borderRadius = borderRadius;
    
    // Apply blur strength
    const blurStrength = elements.blurStrength.value + 'px';
    elements.dynamicBg.style.filter = `blur(${blurStrength})`;
    elements.overlayLayer.style.backdropFilter = `blur(${parseInt(blurStrength) * 0.75}px)`;
}

// ============================================
// Preview Scaling
// ============================================
function updatePreviewScale() {
    const container = elements.previewContainer;
    const parent = container.parentElement;
    
    const parentWidth = parent.clientWidth - 40; // padding
    const parentHeight = parent.clientHeight - 40;
    
    const scaleX = parentWidth / 3840;
    const scaleY = parentHeight / 2160;
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
    const newL = Math.max(0.45, Math.min(0.82, l));
    const newS = Math.min(1, s * 1.25);
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
    
    elements.bgLayer.style.backgroundColor = '#ffffff';
    elements.bgLayer.style.backgroundImage = gradients.join(', ');
    elements.bgLayer.style.backgroundSize = '100% 100%';
}

function refreshInkColors() {
    const randomPalette = pickRandomInkPalette(5);
    renderInkBackground(randomPalette);
}

function refreshInkPositions() {
    renderInkBackground(currentPalette, { alreadyBright: true });
}

// ============================================
// Export Screenshot
// ============================================
async function exportScreenshot() {
    const btn = elements.exportBtn;
    const originalText = btn.textContent;
    btn.textContent = '⏳ 正在生成...';
    btn.disabled = true;
    
    try {
        // Store original transform and remove for capture
        const container = elements.previewContainer;
        const originalTransform = container.style.transform;
        container.style.transform = 'none';
        
        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture with html2canvas
        const canvas = await html2canvas(container, {
            width: 3840,
            height: 2160,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false
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
        
        btn.textContent = '✅ 导出成功！';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Export failed:', error);
        btn.textContent = '❌ 导出失败';
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
        lyricsFontSize: elements.lyricsFontSize.value,
        borderRadius: elements.borderRadius.value,
        blurStrength: elements.blurStrength.value,
        showLyrics: elements.showLyrics.checked,
        showTranslation: elements.showTranslation.checked,
        showAlbumArt: elements.showAlbumArt.checked,
        showProgressBar: elements.showProgressBar.checked,
        showControls: elements.showControls.checked,
        showMetadata: elements.showMetadata.checked,
        theme: currentTheme,
        mode: currentMode
    };
    
    localStorage.setItem('musicSummarySettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('musicSummarySettings');
    if (!saved) return;
    
    try {
        const settings = JSON.parse(saved);
        
        // Apply slider values
        if (settings.coverSize) {
            elements.coverSize.value = settings.coverSize;
        }
        if (settings.lyricsFontSize) {
            elements.lyricsFontSize.value = settings.lyricsFontSize;
        }
        if (settings.borderRadius) {
            elements.borderRadius.value = settings.borderRadius;
        }
        if (settings.blurStrength) {
            elements.blurStrength.value = settings.blurStrength;
        }
        
        // Apply checkbox values
        if (settings.showLyrics !== undefined) {
            elements.showLyrics.checked = settings.showLyrics;
        }
        if (settings.showTranslation !== undefined) {
            elements.showTranslation.checked = settings.showTranslation;
        }
        if (settings.showAlbumArt !== undefined) {
            elements.showAlbumArt.checked = settings.showAlbumArt;
        }
        if (settings.showProgressBar !== undefined) {
            elements.showProgressBar.checked = settings.showProgressBar;
        }
        if (settings.showControls !== undefined) {
            elements.showControls.checked = settings.showControls;
        }
        if (settings.showMetadata !== undefined) {
            elements.showMetadata.checked = settings.showMetadata;
        }
        
        // Apply theme and mode
        if (settings.theme) {
            currentTheme = settings.theme;
        }
        if (settings.mode) {
            currentMode = settings.mode;
        }
        
        // Update displays
        updateStyles();
        updateVisibility();
        
    } catch (e) {
        console.log('Error loading settings:', e);
    }
}

// Save settings on window close
window.addEventListener('beforeunload', saveSettings);
