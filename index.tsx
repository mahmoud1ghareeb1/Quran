/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { tafsirData } from './tafsir_data';

// --- Constants ---
const QURAN_API_BASE_URL = 'https://api.quran.com/api/v4';
const QURAN_TOTAL_PAGES = 604;
const PRELOAD_PAGE_COUNT = 2; // Number of pages to preload ahead
const JUZ_DATA = [
    { number: 1, startPage: 1 }, { number: 2, startPage: 22 }, { number: 3, startPage: 42 },
    { number: 4, startPage: 62 }, { number: 5, startPage: 82 }, { number: 6, startPage: 102 },
    { number: 7, startPage: 121 }, { number: 8, startPage: 128 }, { number: 9, startPage: 142 },
    { number: 10, startPage: 162 }, { number: 11, startPage: 182 }, { number: 12, startPage: 202 },
    { number: 13, startPage: 222 }, { number: 14, startPage: 242 }, { number: 15, startPage: 262 },
    { number: 16, startPage: 282 }, { number: 17, startPage: 302 }, { number: 18, startPage: 322 },
    { number: 19, startPage: 342 }, { number: 20, startPage: 362 }, { number: 21, startPage: 382 },
    { number: 22, startPage: 402 }, { number: 23, startPage: 422 }, { number: 24, startPage: 442 },
    { number: 25, startPage: 462 }, { number: 26, startPage: 482 }, { number: 27, startPage: 502 },
    { number: 28, startPage: 522 }, { number: 29, startPage: 542 }, { number: 30, startPage: 562 }
];
const RECITERS = [
    { id: 7, name: 'مشاري العفاسي', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('مشاري العفاسي')}&background=0D8ABC&color=fff` },
    { id: 4, name: 'محمود خليل الحصري', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('محمود الحصري')}&background=1E8449&color=fff` },
    { id: 2, name: 'سعود الشريم', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('سعود الشريم')}&background=D35400&color=fff` },
    { id: 1, name: 'عبدالرحمن السديس', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('عبدالرحمن السديس')}&background=8E44AD&color=fff` },
    { id: 10, name: 'ماهر المعيقلي', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('ماهر المعيقلي')}&background=2C3E50&color=fff` },
    { id: 11, name: 'سعد الغامدي', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('سعد الغامدي')}&background=C0392B&color=fff` },
    { id: 12, name: 'أبو بكر الشاطري', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('أبو بكر الشاطري')}&background=7D3C98&color=fff` },
    { id: 13, name: 'محمد صديق المنشاوي (مجود)', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('محمد المنشاوي')}&background=16A085&color=fff` },
    { id: 14, name: 'علي جابر', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('علي جابر')}&background=27AE60&color=fff` },
    { id: 15, name: 'ياسر الدوسري', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('ياسر الدوسري')}&background=2980B9&color=fff` },
    { id: 16, name: 'ناصر القطامي', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('ناصر القطامي')}&background=F1C40F&color=fff` },
    { id: 17, name: 'صلاح بوخاطر', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('صلاح بوخاطر')}&background=E67E22&color=fff` },
    { id: 18, name: 'أحمد بن علي العجمي', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('أحمد العجمي')}&background=3498DB&color=fff` },
    { id: 19, name: 'فارس عباد', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('فارس عباد')}&background=9B59B6&color=fff` },
    { id: 20, name: 'إبراهيم الأخضر', imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent('إبراهيم الأخضر')}&background=34495E&color=fff` },
];
const TAFSIRS = [
    { id: 1, name: 'التفسير الميسر' },
    { id: 17, name: 'تفسير السعدي' },
    { id: 13, name: 'تفسير ابن كثير' },
    { id: 16, name: 'التفسير الوجيز' },
];
const RECITER_EVERYAYAH_MAP: Record<number, string> = {
    7: 'Alafasy_128kbps',
    4: 'Husary_64kbps',
    2: 'Saood_ash-Shuraym_128kbps',
    1: 'Abdurrahmaan_As-Sudais_128kbps',
    10: 'Maher_AlMuaiqly_128kbps',
    11: 'Ghamadi_192kbps',
    12: 'Shatri_128kbps',
    13: 'Minshawy_Mujawwad_128kbps',
    14: 'Ali_Jaber_64kbps',
    15: 'Yasser_Ad-Dussary_128kbps',
    16: 'Nasser_Alqatami_128kbps',
    17: 'Salah_Bukhatir_128kbps',
    18: 'Ajamy_128kbps',
    19: 'Fares_Abbad_128kbps',
    20: 'Ibrahim_Akhdar_64kbps',
};

// --- Types ---
type AppView = 'reader' | 'index' | 'settings' | 'search';
type IndexView = 'surah' | 'juz' | 'bookmarks' | 'notes' | 'help';
type Theme = 'light' | 'dark';

interface Surah {
    id: number; name_arabic: string; revelation_place: 'makkah' | 'madinah'; verses_count: number; pages: [number, number];
}
interface Bookmark {
    page: number; surahName: string; juz: number;
}
interface PageVerse {
    id: number; verse_key: string; text_uthmani: string;
}
interface QuranVerse {
    verse_key: string; text_imlaei_simple: string;
}
interface SearchResult {
    verse_key: string; text: string; highlighted_text: string;
}
interface AppSettings {
    theme: Theme; fontSize: number; currentReciterId: number; currentTafsirId: number;
}
interface AppState {
    currentView: AppView; currentIndexView: IndexView; currentPage: number; settings: AppSettings;
    allSurahs: Surah[]; isLoading: boolean; isNavigating: boolean; bookmarks: Bookmark[];
    searchResults: SearchResult[]; searchQuery: string; totalSearchResults: number; notes: Record<string, string>;
    selectedVerseKey: string | null; isPlayerVisible: boolean; isPlaying: boolean; audioQueue: PageVerse[];
    currentAudioIndex: number; isSinglePlayMode: boolean; quranText: QuranVerse[];
}
type PageData = { verses: PageVerse[] };
const pageCache: Record<number, PageData> = {};

// --- App State ---
const appState: AppState = {
  currentView: 'reader', currentIndexView: 'surah', currentPage: 1,
  settings: { theme: 'light', fontSize: 2.5, currentReciterId: 7, currentTafsirId: 1 },
  allSurahs: [], isLoading: false, isNavigating: false, bookmarks: [],
  searchResults: [], searchQuery: '', totalSearchResults: 0, notes: {},
  selectedVerseKey: null, isPlayerVisible: false, isPlaying: false, audioQueue: [], currentAudioIndex: -1, isSinglePlayMode: false,
  quranText: [],
};

// --- DOM Elements ---
const DOMElements = {
  body: document.body,
  themeMeta: document.getElementById('theme-color-meta'),
  loadingIndicator: document.getElementById('loading-indicator'),
  views: { reader: document.getElementById('reader-view'), index: document.getElementById('index-view'), settings: document.getElementById('settings-view'), search: document.getElementById('search-view') },
  reader: {
    contentWrapper: document.getElementById('reader-content-wrapper'),
    content: document.getElementById('reader-content'),
    contentTransition: document.getElementById('reader-content-transition'),
    title: document.getElementById('surah-title'),
    pageNumberFooter: document.getElementById('page-number-footer'),
    juzNumberFooter: document.getElementById('juz-number-footer'),
  },
  index: { content: document.getElementById('index-content'), surahTab: document.getElementById('surah-tab-btn'), juzTab: document.getElementById('juz-tab-btn'), bookmarksTab: document.getElementById('bookmarks-tab-btn'), notesTab: document.getElementById('notes-tab-btn'), helpTab: document.getElementById('help-tab-btn') },
  search: { input: document.getElementById('search-input') as HTMLInputElement, resultsContainer: document.getElementById('search-results-container'), meta: document.getElementById('search-results-meta') },
  settings: { darkModeToggle: document.getElementById('dark-mode-toggle') as HTMLInputElement, fontSizeSlider: document.getElementById('font-size-slider') as HTMLInputElement },
  buttons: { toIndex: document.getElementById('index-btn'), toSettings: document.getElementById('settings-btn'), toSearch: document.getElementById('search-btn'), closeIndex: document.getElementById('close-index-btn'), closeSettings: document.getElementById('close-settings-btn'), closeSearch: document.getElementById('close-search-btn'), bookmark: document.getElementById('bookmark-btn'), play: document.getElementById('play-btn') },
  audio: {
    player: document.getElementById('audio-player'),
    audioElement: document.getElementById('audio-element') as HTMLAudioElement,
    playPauseContainer: document.getElementById('play-pause-container'),
    playPauseBtn: document.getElementById('audio-play-pause-btn'),
    nextBtn: document.getElementById('audio-next-btn'),
    prevBtn: document.getElementById('audio-prev-btn'),
    info: document.getElementById('audio-info'),
    reciterSelect: document.getElementById('reciter-select') as HTMLSelectElement,
    reciterImage: document.getElementById('reciter-image') as HTMLImageElement,
  },
  ayahActions: {
      menu: document.getElementById('ayah-action-menu'),
      play: document.getElementById('ayah-action-play'),
      tafsir: document.getElementById('ayah-action-tafsir'),
      note: document.getElementById('ayah-action-note'),
      copy: document.getElementById('ayah-action-copy'),
      share: document.getElementById('ayah-action-share'),
  },
  modals: {
      tafsir: document.getElementById('tafsir-modal'),
      tafsirBody: document.getElementById('tafsir-body'),
      tafsirSelect: document.getElementById('tafsir-select') as HTMLSelectElement,
      tafsirText: document.getElementById('tafsir-text'),
      closeTafsir: document.getElementById('close-tafsir-modal'),
      note: document.getElementById('note-modal'),
      noteTextarea: document.getElementById('note-textarea') as HTMLTextAreaElement,
      saveNote: document.getElementById('save-note-btn'),
      closeNote: document.getElementById('close-note-modal'),
  }
};
let currentContentElement = DOMElements.reader.content;
let transitionContentElement = DOMElements.reader.contentTransition;

// --- API Functions ---
async function fetchApi<T>(url: string, showLoading = true): Promise<T> {
    if (showLoading) setLoading(true);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return null;
    } finally {
        if (showLoading) setLoading(false);
    }
}

async function fetchPageData(pageNumber: number): Promise<PageData> {
    if (pageCache[pageNumber]) return Promise.resolve(pageCache[pageNumber]);
    const data = await fetchApi<PageData>(`${QURAN_API_BASE_URL}/verses/by_page/${pageNumber}?language=ar&words=false&fields=text_uthmani,verse_key`);
    if (data && data.verses) pageCache[pageNumber] = data;
    return data;
}

let isPreloading = false;
async function preloadNextPages(basePage: number) {
    if (isPreloading) return;
    isPreloading = true;
    for (let i = 1; i <= PRELOAD_PAGE_COUNT; i++) {
        const pageToLoad = basePage + i;
        if (pageToLoad > QURAN_TOTAL_PAGES || pageCache[pageToLoad]) continue;
        try {
            const data = await fetchApi<PageData>(`${QURAN_API_BASE_URL}/verses/by_page/${pageToLoad}?language=ar&words=false&fields=text_uthmani,verse_key`, false);
            if (data && data.verses) pageCache[pageToLoad] = data;
        } catch (e) {
            console.error(`Failed to preload page ${pageToLoad}`, e);
        }
    }
    isPreloading = false;
}

// --- Helper Functions ---
function setLoading(isLoading: boolean) { appState.isLoading = isLoading; DOMElements.loadingIndicator.classList.toggle('show', isLoading); }
function getJuzFromPage(page: number): number {
    for (let i = JUZ_DATA.length - 1; i >= 0; i--) {
        if (page >= JUZ_DATA[i].startPage) return JUZ_DATA[i].number;
    }
    return 1;
}
function pad(num: number, size: number): string {
    let s = String(num);
    while (s.length < size) { s = "0" + s; }
    return s;
}
function removeDiacritics(text: string): string {
    text = text.replace(/[أإآ]/g, 'ا');
    text = text.replace(/ى/g, 'ي');
    text = text.replace(/ة/g, 'ه');
    text = text.replace(/[\u064B-\u0652\u0670]/g, '');
    text = text.replace(/\u0640/g, ''); // Tatweel
    return text;
}

// --- Rendering Functions ---
function updateReaderUIAfterRender(pageData: PageData) {
    appState.audioQueue = pageData.verses;
    const firstSurahOnPage = appState.allSurahs.find(s => s.id === parseInt(pageData.verses[0].verse_key.split(':')[0]));
    DOMElements.reader.title.textContent = firstSurahOnPage?.name_arabic.replace('سُورَةُ', 'سورة') || 'القرآن الكريم';
    DOMElements.reader.pageNumberFooter.textContent = `صفحة ${appState.currentPage.toLocaleString('ar-EG')}`;
    DOMElements.reader.juzNumberFooter.textContent = `الجزء ${getJuzFromPage(appState.currentPage).toLocaleString('ar-EG')}`;
    updateBookmarkIcon();
    applySettings();
    updatePlayerUI();
}

async function renderPageIntoElement(element: HTMLElement, pageNumber: number, highlightVerseKey: string | null = null): Promise<PageData> {
    const data = await fetchPageData(pageNumber);

    if (!data || !data.verses || data.verses.length === 0) {
        element.innerHTML = `<p>لا يمكن تحميل بيانات الصفحة.</p>`;
        return null;
    }

    let contentHTML = '';
    const firstVerseKey = data.verses[0].verse_key;
    const [firstSurahNum] = firstVerseKey.split(':');

    if (pageNumber === 1 || parseInt(firstSurahNum) === 1) {
        const surahInfo = appState.allSurahs.find(s => s.id === 1);
        if (surahInfo) contentHTML += `<div class="surah-header"><h2 class="surah-name">${surahInfo.name_arabic}</h2></div>`;
    }

    data.verses.forEach(verse => {
        const [surahNumStr, ayahNumStr] = verse.verse_key.split(':');
        const ayahNumber = parseInt(ayahNumStr);
        if (ayahNumber === 1 && verse.verse_key !== '1:1') {
            const surahInfo = appState.allSurahs.find(s => s.id === parseInt(surahNumStr));
            if (surahInfo) {
                contentHTML += `<div class="surah-header"><h2 class="surah-name">${surahInfo.name_arabic}</h2></div>`;
                if (surahInfo.id !== 9) contentHTML += `<div class="bismillah">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>`;
            }
        }
        contentHTML += `<span class="verse" data-verse-key="${verse.verse_key}"><span class="verse-text">${verse.text_uthmani}</span><span class="verse-number">${ayahNumber.toLocaleString('ar-EG')}</span></span> `;
    });

    element.innerHTML = contentHTML;
    element.scrollTop = 0;

    if (highlightVerseKey) {
        setTimeout(() => {
            const verseEl = element.querySelector(`[data-verse-key="${highlightVerseKey}"]`) as HTMLElement;
            if (verseEl) {
                verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                verseEl.classList.add('search-highlight-temp');
                setTimeout(() => verseEl.classList.remove('search-highlight-temp'), 3000);
            }
        }, 100);
    }
    return data;
}

function renderSurahIndex() {
    DOMElements.index.content.innerHTML = appState.allSurahs.map(surah => `
        <div class="surah-list-item" data-start-page="${surah.pages[0]}">
            <div class="surah-number-container">${surah.id.toLocaleString('ar-EG')}</div>
            <div class="surah-info"><div class="surah-name-main">${surah.name_arabic}</div><div class="surah-details">${surah.revelation_place === 'makkah' ? 'مكية' : 'مدنية'} - ${surah.verses_count} آيات</div></div>
            <div class="surah-page-number">${surah.pages[0].toLocaleString('ar-EG')}</div>
        </div>`).join('');
    document.querySelectorAll('.surah-list-item').forEach(item => item.addEventListener('click', () => navigateTo('reader', parseInt((item as HTMLElement).dataset.startPage))));
}

function renderJuzIndex() {
    DOMElements.index.content.innerHTML = JUZ_DATA.map(juz => `
        <div class="juz-list-item" data-start-page="${juz.startPage}">
            <div class="juz-number-container">${juz.number.toLocaleString('ar-EG')}</div>
            <div class="juz-info"><div class="juz-name-main">الجزء ${juz.number.toLocaleString('ar-EG')}</div></div>
            <div class="juz-page-number">${juz.startPage.toLocaleString('ar-EG')}</div>
        </div>`).join('');
    document.querySelectorAll('.juz-list-item').forEach(item => item.addEventListener('click', () => navigateTo('reader', parseInt((item as HTMLElement).dataset.startPage))));
}

function renderBookmarksIndex() {
    if (appState.bookmarks.length === 0) {
        DOMElements.index.content.innerHTML = `<div class="search-placeholder" style="height: auto; padding: 40px;"><span class="material-symbols-outlined">bookmark</span><p>لم تقم بإضافة أي علامات مرجعية بعد.</p></div>`; return;
    }
    DOMElements.index.content.innerHTML = appState.bookmarks.map(bookmark => `
        <div class="bookmark-list-item" data-page="${bookmark.page}">
            <div class="bookmark-icon-container"><span class="material-symbols-outlined">book</span></div>
            <div class="bookmark-info"><div class="bookmark-name-main">${bookmark.surahName}</div><div class="bookmark-details">الجزء ${bookmark.juz.toLocaleString('ar-EG')}</div></div>
            <div class="bookmark-page-number">صفحة ${bookmark.page.toLocaleString('ar-EG')}</div>
        </div>`).join('');
    document.querySelectorAll('.bookmark-list-item').forEach(item => item.addEventListener('click', () => navigateTo('reader', parseInt((item as HTMLElement).dataset.page))));
}

function renderNotesIndex() {
    const container = DOMElements.index.content;
    const notesEntries = Object.entries(appState.notes).filter(([, noteText]) => noteText.trim() !== '');

    if (notesEntries.length === 0) {
        container.innerHTML = `<div class="search-placeholder" style="height: auto; padding: 40px;"><span class="material-symbols-outlined">edit_note</span><p>لم تقم بإضافة أي ملاحظات بعد.</p></div>`;
        return;
    }

    container.innerHTML = notesEntries.map(([verseKey, noteText]) => {
        const [surahNum, verseNum] = verseKey.split(':');
        const surah = appState.allSurahs.find(s => s.id === parseInt(surahNum));
        const surahName = surah ? surah.name_arabic : `سورة ${surahNum}`;
        
        return `
            <div class="note-list-item" data-verse-key="${verseKey}">
                <div class="note-info">
                    <div class="note-verse-ref">${surahName} - الآية ${parseInt(verseNum).toLocaleString('ar-EG')}</div>
                    <p class="note-text-preview">${noteText}</p>
                </div>
                <span class="material-symbols-outlined">chevron_left</span>
            </div>`;
    }).join('');

    container.querySelectorAll('.note-list-item').forEach(item => {
        item.addEventListener('click', () => handleSearchResultClick((item as HTMLElement).dataset.verseKey));
    });
}

function renderHelpIndex() {
    DOMElements.index.content.innerHTML = `
        <div class="help-content">
            <h3>مرحباً بك في تطبيق القرآن الكريم</h3>
            <p>هذا الدليل لمساعدتك على استخدام جميع ميزات التطبيق.</p>

            <h4><span class="material-symbols-outlined">swipe</span> القراءة والتنقل</h4>
            <ul>
                <li><strong>التنقل بين الصفحات:</strong> اسحب لليسار للانتقال إلى الصفحة التالية، واسحب لليمين للعودة للصفحة السابقة.</li>
                <li><strong>التفاعل مع الآيات:</strong> اضغط على أي آية لإظهار قائمة الإجراءات السريعة.</li>
            </ul>

            <h4><span class="material-symbols-outlined">menu</span> الفهرس والوصول السريع</h4>
            <p>اضغط على أيقونة القائمة <span class="material-symbols-outlined icon-example">menu</span> في الشريط العلوي للوصول إلى:</p>
            <ul>
                <li><strong>السور:</strong> تصفح قائمة السور وانتقل مباشرة إلى أي سورة.</li>
                <li><strong>الأجزاء:</strong> انتقل بسرعة إلى بداية أي جزء.</li>
                <li><strong>العلامات المرجعية:</strong> شاهد الصفحات التي قمت بحفظها.</li>
                <li><strong>الملاحظات:</strong> اعرض جميع ملاحظاتك على الآيات.</li>
            </ul>

            <h4><span class="material-symbols-outlined">touch_app</span> قائمة إجراءات الآية</h4>
            <p>بعد الضغط على آية، ستظهر لك الخيارات التالية:</p>
            <ul>
                <li><span class="material-symbols-outlined icon-example">play_arrow</span><strong>تشغيل:</strong> استمع لتلاوة الآية المحددة.</li>
                <li><span class="material-symbols-outlined icon-example">menu_book</span><strong>تفسير:</strong> اقرأ تفسير الآية. يمكنك تغيير كتاب التفسير من نفس النافذة.</li>
                <li><span class="material-symbols-outlined icon-example">edit_note</span><strong>ملاحظة:</strong> اكتب واحفظ ملاحظاتك الخاصة على الآية.</li>
                <li><span class="material-symbols-outlined icon-example">content_copy</span><strong>نسخ:</strong> انسخ نص الآية إلى الحافظة.</li>
                <li><span class="material-symbols-outlined icon-example">share</span><strong>مشاركة:</strong> شارك نص الآية عبر التطبيقات الأخرى.</li>
            </ul>
            
            <h4><span class="material-symbols-outlined">volume_up</span> مشغل الصوت</h4>
            <ul>
                <li><strong>إظهار/إخفاء المشغل:</strong> اضغط على أيقونة <span class="material-symbols-outlined icon-example">play_circle</span> في الشريط العلوي.</li>
                <li><strong>اختيار القارئ:</strong> اضغط على صورة القارئ لفتح قائمة بجميع القراء المتاحين.</li>
                <li><strong>التحكم بالصوت:</strong> استخدم أزرار التشغيل/الإيقاف، والتالي، والسابق للتحكم في التلاوة.</li>
            </ul>

            <h4><span class="material-symbols-outlined">settings</span> الإعدادات</h4>
            <p>اضغط على أيقونة <span class="material-symbols-outlined icon-example">settings</span> للوصول إلى الإعدادات:</p>
            <ul>
                <li><strong>القراءة الليلية:</strong> قم بالتبديل بين المظهر الفاتح والداكن.</li>
                <li><strong>حجم الخط:</strong> قم بتكبير أو تصغير حجم خط القرآن لتسهيل القراءة.</li>
            </ul>
        </div>
    `;
}

async function handleSearchResultClick(verseKey: string) {
    setLoading(true);
    try {
        const data = await fetchApi<{ verse: { page_number: number } }>(`${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?fields=page_number`, false);
        if (data && data.verse) {
            navigateTo('reader', data.verse.page_number, verseKey);
        } else {
            alert("لا يمكن العثور على الصفحة لهذه الآية.");
        }
    } finally {
        setLoading(false);
    }
}

function renderSearchResults() {
    const container = DOMElements.search.resultsContainer;
    const metaContainer = DOMElements.search.meta;
    
    if (appState.quranText.length === 0 && appState.currentView === 'search') {
        container.innerHTML = `<div class="search-placeholder"><div class="spinner"></div><p style="margin-top: 16px;">جاري تحضير محرك البحث لأول مرة...</p></div>`;
        metaContainer.classList.add('hidden');
        return;
    }

    if (appState.searchQuery.length < 1) {
       container.innerHTML = `<div class="search-placeholder"><span class="material-symbols-outlined">search</span><p>ابحث عن كلمات أو آيات في القرآن الكريم.</p></div>`;
       metaContainer.classList.add('hidden');
       return;
    }

    if (appState.totalSearchResults === 0) {
        container.innerHTML = `<div class="search-placeholder"><span class="material-symbols-outlined">search_off</span><p>لا توجد نتائج للبحث عن "${appState.searchQuery}"</p></div>`;
        metaContainer.classList.add('hidden');
        return;
    }
    
    if (appState.totalSearchResults > 0) {
        metaContainer.innerHTML = `تم العثور على <strong>${appState.totalSearchResults.toLocaleString('ar-EG')}</strong> نتيجة للبحث عن: "<strong>${appState.searchQuery}</strong>"`;
        metaContainer.classList.remove('hidden');
    } else {
         metaContainer.classList.add('hidden');
    }

    container.innerHTML = appState.searchResults.map(result => {
        const [surahNum, verseNum] = result.verse_key.split(':');
        const surah = appState.allSurahs.find(s => s.id === parseInt(surahNum));
        
        return `
            <div class="search-result-item" data-verse-key="${result.verse_key}">
                <div class="search-result-header">${surah?.name_arabic || ''} - الآية ${parseInt(verseNum).toLocaleString('ar-EG')}</div>
                <p class="search-result-text">${result.highlighted_text}</p>
            </div>`;
    }).join('');
    container.querySelectorAll('.search-result-item').forEach(item => item.addEventListener('click', () => handleSearchResultClick((item as HTMLElement).dataset.verseKey)));
}

// --- Navigation ---
async function navigateToPage(targetPage: number, highlightVerseKey: string | null = null) {
    if (appState.isNavigating || targetPage === appState.currentPage || targetPage < 1 || targetPage > QURAN_TOTAL_PAGES) return;
    appState.isNavigating = true;

    const direction = targetPage > appState.currentPage ? 'next' : 'prev';
    setLoading(true);
    const pageData = await renderPageIntoElement(transitionContentElement, targetPage, highlightVerseKey);
    setLoading(false);
    
    if (!pageData) {
        appState.isNavigating = false;
        return;
    }

    currentContentElement.className = `reader-content page-out-${direction}`;
    transitionContentElement.className = `reader-content page-in-${direction}`;
    transitionContentElement.classList.remove('hidden');

    transitionContentElement.addEventListener('animationend', () => {
        currentContentElement.className = 'reader-content hidden';
        transitionContentElement.className = 'reader-content';
        
        appState.currentPage = targetPage;
        updateReaderUIAfterRender(pageData);

        // Swap elements for the next transition
        [currentContentElement, transitionContentElement] = [transitionContentElement, currentContentElement];
        
        appState.isNavigating = false;
        preloadNextPages(targetPage);
    }, { once: true });
}

async function navigateTo(viewName: AppView, page?: number, highlightVerseKey: string | null = null) {
    if (viewName === 'reader' && page && page !== appState.currentPage) {
        await navigateToPage(page, highlightVerseKey);
    }

    appState.currentView = viewName;
    Object.values(DOMElements.views).forEach(view => view.classList.add('hidden'));
    DOMElements.views[viewName].classList.remove('hidden');

    hideAyahActionMenu();
    if (viewName === 'index') {
      switchIndexTab(appState.currentIndexView);
    } else if (viewName === 'search') {
      renderSearchResults();
      DOMElements.search.input.focus();
    }
}

// --- Settings & Storage ---
function applySettings() {
  DOMElements.body.classList.toggle('dark-mode', appState.settings.theme === 'dark');
  DOMElements.themeMeta.setAttribute('content', appState.settings.theme === 'dark' ? '#161B22' : '#F8F5E9');
  [DOMElements.reader.content, DOMElements.reader.contentTransition].forEach(el => {
      if(el) el.style.fontSize = `${appState.settings.fontSize}rem`;
  });
}

function loadData() {
  const settings = localStorage.getItem('quranAppSettings');
  if (settings) Object.assign(appState.settings, JSON.parse(settings));
  const bookmarks = localStorage.getItem('quranAppBookmarks');
  if (bookmarks) appState.bookmarks = JSON.parse(bookmarks);
  const notes = localStorage.getItem('quranAppNotes');
  if (notes) appState.notes = JSON.parse(notes);

  DOMElements.settings.darkModeToggle.checked = appState.settings.theme === 'dark';
  DOMElements.settings.fontSizeSlider.value = String(appState.settings.fontSize);
  DOMElements.audio.reciterSelect.value = String(appState.settings.currentReciterId);
  updateReciterImage(appState.settings.currentReciterId);
  DOMElements.modals.tafsirSelect.value = String(appState.settings.currentTafsirId);
}

function saveSettings() { localStorage.setItem('quranAppSettings', JSON.stringify(appState.settings)); }
function saveBookmarks() { localStorage.setItem('quranAppBookmarks', JSON.stringify(appState.bookmarks)); }
function saveNotes() { localStorage.setItem('quranAppNotes', JSON.stringify(appState.notes)); }

// --- Bookmarks Logic ---
function toggleBookmark() {
    const page = appState.currentPage;
    const bookmarkIndex = appState.bookmarks.findIndex(b => b.page === page);
    if (bookmarkIndex > -1) {
        appState.bookmarks.splice(bookmarkIndex, 1);
    } else {
        appState.bookmarks.push({ page, surahName: DOMElements.reader.title.textContent, juz: getJuzFromPage(page) });
        appState.bookmarks.sort((a, b) => a.page - b.page);
    }
    saveBookmarks();
    updateBookmarkIcon();
}
function updateBookmarkIcon() {
    const isBookmarked = appState.bookmarks.some(b => b.page === appState.currentPage);
    DOMElements.buttons.bookmark.classList.toggle('bookmarked', isBookmarked);
}

// --- Search Logic ---
let searchTimeout: number;

function handleSearchInput() {
    clearTimeout(searchTimeout);

    const query = DOMElements.search.input.value.trim();
    appState.searchQuery = query;

    if (appState.quranText.length === 0 && query.length > 0) {
        renderSearchResults();
        return;
    }
    
    searchTimeout = window.setTimeout(() => {
        const cleanQuery = removeDiacritics(query);

        if (cleanQuery.length < 1) {
            appState.searchResults = [];
            appState.totalSearchResults = 0;
            renderSearchResults();
            return;
        }

        const searchResults = appState.quranText
            .filter(verse => removeDiacritics(verse.text_imlaei_simple).includes(cleanQuery))
            .map(verse => {
                try {
                    const diacritics = '[\u064B-\u0652\u0670\u0640]*';
                    const pattern = cleanQuery
                        .split('')
                        .map(char => {
                            if (char === 'ا') return '[أإآا]';
                            if (char === 'ي') return '[ىي]';
                            if (char === 'ه') return '[ةه]';
                            return char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        })
                        .join(diacritics);
                    
                    const regex = new RegExp(pattern, 'gi');
                    const highlighted_text = verse.text_imlaei_simple.replace(regex, match => `<mark>${match}</mark>`);
                    
                    return {
                        verse_key: verse.verse_key,
                        text: verse.text_imlaei_simple,
                        highlighted_text: highlighted_text
                    };
                } catch (e) {
                     return {
                        verse_key: verse.verse_key,
                        text: verse.text_imlaei_simple,
                        highlighted_text: verse.text_imlaei_simple,
                    };
                }
            });
        
        appState.searchResults = searchResults;
        appState.totalSearchResults = searchResults.length;
        
        renderSearchResults();

    }, 250); // Debounce search for 250ms
}


// --- Index Logic ---
function switchIndexTab(tab: IndexView) {
    appState.currentIndexView = tab;
    [DOMElements.index.surahTab, DOMElements.index.juzTab, DOMElements.index.bookmarksTab, DOMElements.index.notesTab, DOMElements.index.helpTab].forEach(t => t.classList.remove('active'));
    if (tab === 'surah') { DOMElements.index.surahTab.classList.add('active'); renderSurahIndex(); }
    else if (tab === 'juz') { DOMElements.index.juzTab.classList.add('active'); renderJuzIndex(); }
    else if (tab === 'bookmarks') { DOMElements.index.bookmarksTab.classList.add('active'); renderBookmarksIndex(); }
    else if (tab === 'notes') { DOMElements.index.notesTab.classList.add('active'); renderNotesIndex(); }
    else if (tab === 'help') { DOMElements.index.helpTab.classList.add('active'); renderHelpIndex(); }
}

// --- Ayah Actions Logic ---
function hideAyahActionMenu() {
    DOMElements.ayahActions.menu.classList.add('hidden');
    const currentActive = DOMElements.reader.content.querySelector('.verse.active');
    if (currentActive) currentActive.classList.remove('active');
    appState.selectedVerseKey = null;
}

function positionAyahMenu(verseEl: HTMLElement) {
    const menu = DOMElements.ayahActions.menu;
    const readerRect = currentContentElement.getBoundingClientRect();
    const verseRect = verseEl.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    menu.style.left = '0px';
    menu.style.top = '0px';

    let left = verseEl.offsetLeft + (verseEl.offsetWidth / 2) - (menu.offsetWidth / 2);
    let top = verseEl.offsetTop - menu.offsetHeight - 8 - currentContentElement.scrollTop; 

    if (left < 0) left = 4;
    if (left + menu.offsetWidth > currentContentElement.clientWidth) {
        left = currentContentElement.clientWidth - menu.offsetWidth - 4;
    }
    if (top < 0) { 
        top = verseEl.offsetTop + verseEl.offsetHeight + 8 - currentContentElement.scrollTop;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}

function handleAyahClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const verseEl = target.closest('.verse') as HTMLElement;
    if (!verseEl) return;
    
    const verseKey = verseEl.dataset.verseKey;
    if (appState.selectedVerseKey === verseKey) {
        hideAyahActionMenu();
        return;
    }
    
    hideAyahActionMenu();
    appState.selectedVerseKey = verseKey;
    verseEl.classList.add('active');
    
    const menu = DOMElements.ayahActions.menu;
    menu.classList.remove('hidden');
    positionAyahMenu(verseEl);
}

function loadAndDisplayTafsir(tafsirId: number) {
    if (!appState.selectedVerseKey) return;
    
    const { tafsirText } = DOMElements.modals;
    const tafsirContent = tafsirData[tafsirId]?.[appState.selectedVerseKey];
    
    if (tafsirContent) {
        tafsirText.innerHTML = tafsirContent;
    } else {
        tafsirText.innerHTML = "عفواً، لا يوجد تفسير متاح لهذه الآية حالياً.";
    }
}

function showTafsirModal() {
    if (!appState.selectedVerseKey) return;
    DOMElements.modals.tafsir.classList.remove('hidden');
    loadAndDisplayTafsir(appState.settings.currentTafsirId);
    hideAyahActionMenu();
}

function clearVerseSelection() {
    hideAyahActionMenu();
}

function handleNote() {
    if (!appState.selectedVerseKey) return;
    DOMElements.modals.noteTextarea.value = appState.notes[appState.selectedVerseKey] || '';
    DOMElements.modals.note.classList.remove('hidden');
    DOMElements.modals.noteTextarea.focus();
}
function handleSaveNote() {
    if (!appState.selectedVerseKey) return;
    const noteText = DOMElements.modals.noteTextarea.value.trim();
    if(noteText) {
        appState.notes[appState.selectedVerseKey] = noteText;
    } else {
        delete appState.notes[appState.selectedVerseKey];
    }
    saveNotes();
    DOMElements.modals.note.classList.add('hidden');
    clearVerseSelection();
}
async function handleCopy() {
    if (!appState.selectedVerseKey) return;
    const verse = appState.audioQueue.find(v => v.verse_key === appState.selectedVerseKey);
    if (!verse) return;
    try {
        await navigator.clipboard.writeText(verse.text_uthmani);
        alert('تم نسخ الآية');
    } catch (err) {
        alert('فشل النسخ');
    }
    hideAyahActionMenu();
}
async function handleShare() {
    if (!appState.selectedVerseKey) return;
    const verse = appState.audioQueue.find(v => v.verse_key === appState.selectedVerseKey);
    if (!verse || !navigator.share) return;
    try {
        await navigator.share({ title: `القرآن الكريم - ${verse.verse_key}`, text: verse.text_uthmani });
    } catch (err) {
        if ((err as DOMException).name !== 'AbortError') {
             console.error('Share failed:', err);
        }
    }
    hideAyahActionMenu();
}

// --- Audio Player Logic ---

function togglePlayerVisibility() {
    appState.isPlayerVisible = !appState.isPlayerVisible;
    DOMElements.audio.player.classList.toggle('show', appState.isPlayerVisible);
}

function updateReciterImage(reciterId: number) {
    const reciter = RECITERS.find(r => r.id === reciterId);
    if (reciter && DOMElements.audio.reciterImage) {
        DOMElements.audio.reciterImage.src = reciter.imageUrl;
        DOMElements.audio.reciterImage.alt = `صورة القارئ ${reciter.name}`;
    }
}

function updatePlayerUI() {
    const isPlaying = appState.isPlaying;

    DOMElements.audio.playPauseContainer.classList.remove('loading');
    (DOMElements.audio.playPauseBtn as HTMLButtonElement).disabled = false;

    const playIcon = DOMElements.audio.playPauseBtn.querySelector('.material-symbols-outlined');
    playIcon.textContent = isPlaying ? 'pause_circle' : 'play_circle';
    
    document.querySelectorAll('.verse.playing').forEach(v => v.classList.remove('playing'));
    
    if (appState.currentAudioIndex > -1 && appState.audioQueue.length > appState.currentAudioIndex) {
        const verseKey = appState.audioQueue[appState.currentAudioIndex].verse_key;
        if(appState.isPlaying) {
          const verseEl = document.querySelector(`[data-verse-key="${verseKey}"]`);
          if (verseEl) verseEl.classList.add('playing');
        }
        
        const [surahNum, verseNum] = verseKey.split(':');
        const surah = appState.allSurahs.find(s => s.id === parseInt(surahNum));
        DOMElements.audio.info.textContent = `${surah?.name_arabic.replace('سُورَةُ ', '')}: ${parseInt(verseNum).toLocaleString('ar-EG')}`;
    } else {
        DOMElements.audio.info.textContent = 'اختر قارئًا للبدء';
    }
}

async function playAudio(verseIndex: number) {
    if (verseIndex < 0 || verseIndex >= appState.audioQueue.length) {
        appState.isPlaying = false;
        appState.currentAudioIndex = -1;
        DOMElements.audio.audioElement.pause();
        DOMElements.audio.audioElement.src = '';
        updatePlayerUI();
        return;
    }

    appState.isPlaying = true;
    appState.currentAudioIndex = verseIndex;
    updatePlayerUI();

    const verse = appState.audioQueue[verseIndex];
    const [surahNumStr, ayahNumStr] = verse.verse_key.split(':');
    const reciterId = appState.settings.currentReciterId;
    const reciterIdentifier = RECITER_EVERYAYAH_MAP[reciterId];

    if (!reciterIdentifier) {
        console.error(`Reciter ID ${reciterId} not mapped for everyayah.com`);
        alert('عفواً، الملف الصوتي غير متوفر لهذا القارئ حالياً.');
        appState.isPlaying = false;
        updatePlayerUI();
        return;
    }

    const audioUrl = `https://everyayah.com/data/${reciterIdentifier}/${pad(parseInt(surahNumStr), 3)}${pad(parseInt(ayahNumStr), 3)}.mp3`;
    const audioEl = DOMElements.audio.audioElement;
    
    audioEl.src = audioUrl;
    try {
        await audioEl.play();
    } catch (e) {
        console.error("Audio play failed:", e);
        const error = e as DOMException;
        if (error.name === 'AbortError') {
            appState.isPlaying = false;
            updatePlayerUI();
            return;
        }
        if (error.name === 'NotSupportedError') {
             alert('فشل تحميل الملف الصوتي. قد يكون الرابط غير صحيح أو الملف غير متوفر لهذا القارئ.');
        } else {
             alert('فشل تشغيل الملف الصوتي لهذه الآية.');
        }
        
        appState.isPlaying = false;
        updatePlayerUI();
    }
}

function handlePlayPause() {
    appState.isSinglePlayMode = false;
    const audioEl = DOMElements.audio.audioElement;
    if (audioEl.paused) {
        const indexToPlay = appState.currentAudioIndex > -1 ? appState.currentAudioIndex : 0;
        if (appState.audioQueue.length > 0) {
            playAudio(indexToPlay);
        }
    } else {
        audioEl.pause();
    }
}

function playNext() { playAudio(appState.currentAudioIndex + 1); }
function playPrev() { playAudio(appState.currentAudioIndex - 1); }
function playSpecificVerse(verseKey: string) {
    appState.isSinglePlayMode = true;
    const index = appState.audioQueue.findIndex(v => v.verse_key === verseKey);
    if (index > -1) {
        if (!appState.isPlayerVisible) togglePlayerVisibility();
        playAudio(index);
    }
    hideAyahActionMenu();
}


// --- Swipe Navigation ---
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum distance for a swipe

function handleTouchStart(e: TouchEvent) {
    if (appState.isNavigating) return;
    touchStartX = e.changedTouches[0].screenX;
}
function handleTouchEnd(e: TouchEvent) {
    if (appState.isNavigating) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > swipeThreshold) {
        // RTL-style Swipe: Swipe Left -> Next Page, Swipe Right -> Previous Page
        if (deltaX < 0) {
             navigateToPage(appState.currentPage + 1);
        } else {
             navigateToPage(appState.currentPage - 1);
        }
    }
}

// --- Event Listeners ---
function setupEventListeners() {
  DOMElements.buttons.toIndex.addEventListener('click', () => navigateTo('index'));
  DOMElements.buttons.toSettings.addEventListener('click', () => navigateTo('settings'));
  DOMElements.buttons.toSearch.addEventListener('click', () => navigateTo('search'));
  DOMElements.buttons.closeIndex.addEventListener('click', () => navigateTo('reader'));
  DOMElements.buttons.closeSettings.addEventListener('click', () => navigateTo('reader'));
  DOMElements.buttons.closeSearch.addEventListener('click', () => navigateTo('reader'));
  DOMElements.buttons.bookmark.addEventListener('click', toggleBookmark);
  DOMElements.buttons.play.addEventListener('click', togglePlayerVisibility);
  DOMElements.index.surahTab.addEventListener('click', () => switchIndexTab('surah'));
  DOMElements.index.juzTab.addEventListener('click', () => switchIndexTab('juz'));
  DOMElements.index.bookmarksTab.addEventListener('click', () => switchIndexTab('bookmarks'));
  DOMElements.index.notesTab.addEventListener('click', () => switchIndexTab('notes'));
  DOMElements.index.helpTab.addEventListener('click', () => switchIndexTab('help'));
  DOMElements.search.input.addEventListener('input', handleSearchInput);
  
  // Settings
  DOMElements.settings.darkModeToggle.addEventListener('change', e => { appState.settings.theme = (e.target as HTMLInputElement).checked ? 'dark' : 'light'; applySettings(); saveSettings(); });
  DOMElements.settings.fontSizeSlider.addEventListener('input', e => { appState.settings.fontSize = parseFloat((e.target as HTMLInputElement).value); applySettings(); });
  DOMElements.settings.fontSizeSlider.addEventListener('change', saveSettings);

  // Ayah Actions
  [DOMElements.reader.content, DOMElements.reader.contentTransition].forEach(el => {
    el.addEventListener('click', handleAyahClick);
  });
  document.body.addEventListener('click', (e) => { 
      if (!(e.target as HTMLElement).closest('#ayah-action-menu, .verse, .modal-overlay')) {
          hideAyahActionMenu();
      } 
  });
  DOMElements.ayahActions.tafsir.addEventListener('click', showTafsirModal);
  DOMElements.ayahActions.note.addEventListener('click', handleNote);
  DOMElements.ayahActions.copy.addEventListener('click', handleCopy);
  DOMElements.ayahActions.share.addEventListener('click', handleShare);
  DOMElements.ayahActions.play.addEventListener('click', () => playSpecificVerse(appState.selectedVerseKey));
  
  // Modals
  DOMElements.modals.closeTafsir.addEventListener('click', () => DOMElements.modals.tafsir.classList.add('hidden'));
  DOMElements.modals.tafsirSelect.addEventListener('change', (e) => {
      const newTafsirId = parseInt((e.target as HTMLSelectElement).value);
      appState.settings.currentTafsirId = newTafsirId;
      saveSettings();
      loadAndDisplayTafsir(newTafsirId);
  });
  DOMElements.modals.closeNote.addEventListener('click', () => { DOMElements.modals.note.classList.add('hidden'); clearVerseSelection(); });
  DOMElements.modals.saveNote.addEventListener('click', handleSaveNote);
  
  // Audio Player
  DOMElements.audio.playPauseBtn.addEventListener('click', handlePlayPause);
  DOMElements.audio.nextBtn.addEventListener('click', playNext);
  DOMElements.audio.prevBtn.addEventListener('click', playPrev);
  DOMElements.audio.audioElement.addEventListener('play', () => { appState.isPlaying = true; updatePlayerUI(); });
  DOMElements.audio.audioElement.addEventListener('pause', () => { appState.isPlaying = false; updatePlayerUI(); });
  DOMElements.audio.audioElement.addEventListener('ended', () => {
      if (!appState.isSinglePlayMode) {
          playNext();
      } else {
          appState.isPlaying = false;
          updatePlayerUI();
      }
  });
  DOMElements.audio.reciterSelect.addEventListener('change', (e) => {
      const newReciterId = parseInt((e.target as HTMLSelectElement).value);
      appState.settings.currentReciterId = newReciterId;
      saveSettings();
      updateReciterImage(newReciterId);
      if(appState.currentAudioIndex > -1) {
          playAudio(appState.currentAudioIndex);
      }
  });

  // Swipe Navigation
  DOMElements.reader.contentWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
  DOMElements.reader.contentWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// --- Initialization ---
async function loadFullQuranText() {
    console.log("Loading full Quran text for local search...");
    try {
        const data = await fetchApi<{ verses: { id: number; verse_key: string; text_imlaei_simple: string }[] }>(`${QURAN_API_BASE_URL}/quran/verses/imlaei_simple`, false);
        if (data && data.verses) {
            appState.quranText = data.verses.map(v => ({ verse_key: v.verse_key, text_imlaei_simple: v.text_imlaei_simple }));
            console.log(`Full Quran text loaded. ${appState.quranText.length} verses.`);
            if (appState.currentView === 'search') renderSearchResults();
        } else {
            console.error("Failed to load full Quran text. Search will be disabled.");
        }
    } catch(e) {
        console.error("Error fetching full Quran text:", e);
    }
}

async function init() {
  DOMElements.audio.reciterSelect.innerHTML = RECITERS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
  DOMElements.modals.tafsirSelect.innerHTML = TAFSIRS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  
  loadData();
  applySettings();
  setupEventListeners();

  setLoading(true);
  const surahDataPromise = fetchApi<{ chapters: Surah[] }>(`${QURAN_API_BASE_URL}/chapters?language=ar`, false);
  const quranTextPromise = loadFullQuranText();

  const surahData = await surahDataPromise;
  if (surahData) appState.allSurahs = surahData.chapters;
  
  const initialPageData = await renderPageIntoElement(currentContentElement, 1);
  if (initialPageData) {
      updateReaderUIAfterRender(initialPageData);
      preloadNextPages(1);
  }
  
  navigateTo('reader');
  setLoading(false);

  await quranTextPromise;
}

// PWA Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully with scope: ', registration.scope);
        })
        .catch(err => {
          console.log('Service Worker registration failed: ', err);
        });
    });
  }
}

// Run the app
init();
registerServiceWorker();
