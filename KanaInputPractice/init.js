/** 
 * 初始化界面、数据等相关信息
 */

/** 键盘映射。记录按键上面有哪些内容需要展示。
 * key 是 KeyBordEvent.code 的值，便于后续索引啦。
 * 
 * @type {{
*   [key: string]: {
*     hira: string, // 平假名
*     kata?: string, // 片假名，标点符号按键不存在
*     littleHira?: string, // 平假名小写，不存在则为空
*     text?: string, // 按键对应的文字，只有标点符号按键才有
*   }
* }}
*/
const KanaKeyMap = {
    // #region 数字行
    'Backquote': { hira: 'ろ', kata: 'ロ', text: '`' },
    'Digit1': { hira: 'ぬ', kata: 'ヌ' },
    'Digit2': { hira: 'ふ', kata: 'フ' },
    'Digit3': { hira: 'あ', kata: 'ア', littleHira: 'ぁ' },
    'Digit4': { hira: 'う', kata: 'ウ', littleHira: 'ぅ' },
    'Digit5': { hira: 'え', kata: 'エ', littleHira: 'ぇ' },
    'Digit6': { hira: 'お', kata: 'オ', littleHira: 'ぉ' },
    'Digit7': { hira: 'や', kata: 'ヤ', littleHira: 'ゃ' },
    'Digit8': { hira: 'ゆ', kata: 'ユ', littleHira: 'ゅ' },
    'Digit9': { hira: 'よ', kata: 'ヨ', littleHira: 'ょ' },
    'Digit0': { hira: 'わ', kata: 'ワ', littleHira: 'を' },
    'Minus': { hira: 'ほ', kata: 'ホ', text: '-' },
    'Equal': { hira: 'へ', kata: 'ヘ', text: '=' },
    // #endregion

    // #region qwe行
    'KeyQ': { hira: 'た', kata: 'タ' },
    'KeyW': { hira: 'て', kata: 'テ' },
    'KeyE': { hira: 'い', kata: 'イ', littleHira: 'ぃ' },
    'KeyR': { hira: 'す', kata: 'ス' },
    'KeyT': { hira: 'か', kata: 'カ' },
    'KeyY': { hira: 'ん', kata: 'ン' },
    'KeyU': { hira: 'な', kata: 'ナ' },
    'KeyI': { hira: 'に', kata: 'ニ' },
    'KeyO': { hira: 'ら', kata: 'ラ' },
    'KeyP': { hira: 'せ', kata: 'セ' },
    'BracketLeft': { hira: '゛', text: '[' },
    'BracketRight': { hira: '゜', text: ']' },
    'Backslash': { hira: 'む', kata: 'ム', text: '\\' },
    // #endregion

    // #region asd行
    'KeyA': { hira: 'ち', kata: 'チ' },
    'KeyS': { hira: 'と', kata: 'ト' },
    'KeyD': { hira: 'し', kata: 'シ' },
    'KeyF': { hira: 'は', kata: 'ハ' },
    'KeyG': { hira: 'き', kata: 'キ' },
    'KeyH': { hira: 'く', kata: 'ク' },
    'KeyJ': { hira: 'ま', kata: 'マ' },
    'KeyK': { hira: 'の', kata: 'ノ' },
    'KeyL': { hira: 'り', kata: 'リ' },
    'Semicolon': { hira: 'れ', kata: 'レ', text: ';' },
    'Quote': { hira: 'け', kata: 'ケ', text: "'" },
    // #endregion asd行

    // #region zxc行
    'KeyZ': { hira: 'つ', kata: 'ツ', littleHira: 'っ', },
    'KeyX': { hira: 'さ', kata: 'サ' },
    'KeyC': { hira: 'そ', kata: 'ソ' },
    'KeyV': { hira: 'ひ', kata: 'ヒ' },
    'KeyB': { hira: 'こ', kata: 'コ' },
    'KeyN': { hira: 'み', kata: 'ミ' },
    'KeyM': { hira: 'も', kata: 'モ' },
    'Comma': { hira: 'ね', kata: 'ネ', text: ',' },
    'Period': { hira: 'る', kata: 'ル', text: '.' },
    'Slash': { hira: 'め', kata: 'メ', text: '/' },
    // #endregion
};

/** 假名映射。记录某个假名需要按哪个键。
 * 
 * 普通的平假名、片假名对应一个键。比如 `あ` 对应 `Digit1`。
 * 
 * 小写的平假名需要按两个键。比如 `ぁ` 对应 `shift+Digit1`。
 * 
 * 浊音等，需要按两个键。比如 `ぎ` 对应 `KeyG+BracketLeft`。
 * 
 * 存储时，使用数组存储需要按顺序的按键，比如 `['KeyG', '+BracketLeft']`。
 * @type {{[key: string]: [string, string|undefined]}}
 */
const KanaToKey = (() => {
    // 从 KanaKeyMap 中提取出所有假名，并记录对应的按键咯
    const map = {};
    for (const key in KanaKeyMap) {
        const { hira, kata, littleHira } = KanaKeyMap[key];
        map[hira] = [key];
        kata && (map[kata] = [key]);
        // 默认按左侧的 shift 键，其实右侧的也可以
        littleHira && (map[littleHira] = ['ShiftLeft', key]);
    }

    // 正常假名与浊音对应，方便后续批量添加按键映射
    const ka = {
        'か': ['が'],
        'き': ['ぎ'],
        'く': ['ぐ'],
        'け': ['げ'],
        'こ': ['ご'],
    };
    const sa = {
        'さ': ['ざ'],
        'し': ['じ'],
        'す': ['ず'],
        'せ': ['ぜ'],
        'そ': ['ぞ'],
    }
    const ta = {
        'た': ['だ'],
        'ち': ['ぢ'],
        'つ': ['づ'],
        'て': ['で'],
        'と': ['ど'],
    };
    const hu = {
        'は': ['ば', 'ぱ'],
        'ひ': ['び', 'ぴ'],
        'ふ': ['ぶ', 'ぷ'],
        'へ': ['べ', 'ぺ'],
        'ほ': ['ぼ', 'ぽ'],
    };

    function addKana(row) {
        for (const key in row) {
            // 先获取假名本身对应的按键
            const raw = map[key];
            // 浊音
            const k1 = row[key][0];
            map[k1] = [...raw, 'BracketLeft'];
            // 半浊音
            const k2 = row[key][1];
            k2 && (map[k2] = [...raw, 'BracketRight']);
        }
    }

    addKana(ka);
    addKana(sa);
    addKana(ta);
    addKana(hu);

    return map;
})();

/** 保存所有假名，包括平假名、片假名、小假名、浊音等等 */
const Kanas = Object.keys(KanaToKey);

/** 展示假名的区域 */
const WaittedKanaPanel = document.querySelector('#waitted');
/** 已经输入了假名的区域 */
const InputtedKanaPanel = document.querySelector('#inputted');

// #tag 界面初始化
(function initPage() {
    /** 数字行有哪些按键 */
    const nums_row = '`1234567890-=';
    /** qwe行有哪些按键 */
    const qwe_row = 'QWEERTYUIOP[]\\';
    /** asd行有哪些按键 */
    const asd_row = 'ASDFGHJKL;\'';
    /** zxc行有哪些按键 */
    const zxc_row = 'ZXCVBNM,./';

    /** 渲染键盘 */
    function renderKeyboard() {
        renderKanaKey();
        renderNormalKey();
    }

    /** 渲染假名所在的按键 */
    function renderKanaKey() {
        /** #tag  键盘按键的HTML结构
         <div class="keyboard-key">
            左上角是英文键盘上的字符
            <span class="text">1</span>
            右下角是片假名
            <span class="kata">ロ</span>
            左下角是平假名
            <span class="hira">ろ</span>
            右上角是小写的假名 ，如果有的话
            <span class="littleHira">ぽ</span>
        </div>
        */
        for (const key in KanaKeyMap) {
            const keyElem = document.createElement('div');
            keyElem.className = 'keyboard-key';
            keyElem.id = `key-${key}`;

            const { hira, kata, littleHira, text } = KanaKeyMap[key];
            // 记录这个按键的字符，用于后续找出它位于哪一行
            // 如果 text 为空，则它的值为 Digit1、KeyQ 等的情况哟，取最后一个字符就行
            const keyText = text ? text : key[key.length - 1];
            keyElem.appendChild(createCharElem('text', keyText));
            keyElem.appendChild(createCharElem('hira', hira));
            kata && keyElem.appendChild(createCharElem('kata', kata))
            littleHira && keyElem.appendChild(createCharElem('littleHira', littleHira));

            // 根据字符所在的行数选择最终要添加到哪个元素中
            let target_selector = "";
            if (nums_row.includes(keyText)) { target_selector = '#nums-row'; }
            else if (qwe_row.includes(keyText)) { target_selector = '#qwe-row'; }
            else if (asd_row.includes(keyText)) { target_selector = '#asd-row'; }
            else if (zxc_row.includes(keyText)) { target_selector = '#zxc-row'; }
            else { console.error(`${key} is unknown.`); continue; }

            document.querySelector(target_selector).appendChild(keyElem);
        }
    }

    /** 渲染一些非假名键，比如 shift 等等 */
    function renderNormalKey() {
        // #tag 加上backspace键
        const backspace = createNormalKey('key-Backspace', 'Backspace');
        document.querySelector('#nums-row').appendChild(backspace);

        // #tag 加上shift键
        const shiftKeyLeft = createNormalKey('key-ShiftLeft', 'Shift');
        // 插入到 zxc-row 的开头
        document.querySelector('#zxc-row').insertBefore(shiftKeyLeft, document.querySelector('#zxc-row').firstChild);
        const shiftKeyRight = createNormalKey('key-ShiftRight', 'Shift');
        document.querySelector('#zxc-row').appendChild(shiftKeyRight);

        // #tag 加上tab键
        const tab = createNormalKey('key-Tab', 'Tab');
        document.querySelector('#qwe-row').insertBefore(tab, document.querySelector('#qwe-row').firstChild);

        // #tag 加上capslock键
        const capslock = createNormalKey('key-CapsLock', 'CapsLock');
        document.querySelector('#asd-row').insertBefore(capslock, document.querySelector('#asd-row').firstChild);

        // #tag 加上enter键
        const enter = createNormalKey('key-Enter', 'Enter');
        document.querySelector('#asd-row').appendChild(enter);
    }

    /** 抽取出来的、重复的逻辑，创建特定内容的 span 标签 */
    function createCharElem(className, text) {
        const charElem = document.createElement('span');
        charElem.className = className;
        charElem.textContent = text;
        return charElem;
    }

    /** 创建其余非假名的键，比如 shift 键等等，并返回一个 div 哟 */
    function createNormalKey(idName, text) {
        const key = document.createElement('div');
        key.className = 'keyboard-key normal-key';
        key.id = idName;
        key.textContent = text;
        return key;
    }

    /** 让键盘跟随窗口大小进行缩放 */
    function autoResize() {
        // 目标：保持让键盘占据整个屏幕宽度的 80%
        const keyboard = document.querySelector('#keyboard');
        /** 记录键盘渲染之后的、第一次的宽度，用于后面 zoom 进行对比、缩放 */
        let rawWidth;

        function resizeKeyboard() {
            if (!rawWidth) return;
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
            const wantedWidth = windowWidth * 0.8;
            const scale = wantedWidth / rawWidth;
            keyboard.style.zoom = scale;
        }

        // 防止频繁触发 resizeKeyboard
        let tid = 0;
        window.addEventListener('resize', () => {
            clearTimeout(tid);
            tid = setTimeout(resizeKeyboard, 200);
        });

        window.addEventListener('DOMContentLoaded', () => {
            rawWidth = keyboard.getBoundingClientRect().width;
            resizeKeyboard();
        });
    }

    autoResize();
    renderKeyboard();
})();

/** 在测试正确时，将输入正确的假名加入到表示已经输入的元素中，即高亮显示。
 * 
 * 什么时候测试正确呢？当想要获取下一个假名时，就说明测试正确啦。
 */
function moveToInputtedPanel() {
    // 拿出第一个假名，加入到 inputtedPanel 中即可
    const raw = WaittedKanaPanel.textContent;
    WaittedKanaPanel.textContent = raw.slice(1);
    InputtedKanaPanel.textContent += raw[0];
}

/** 给定一个 keyCode，在键盘上显示需要按下的键，返回 true 表示高亮成功 */
function highlightOneKey(keyCode) {
    const selector = `#key-${keyCode}`;
    const key = document.querySelector(selector);
    if (key) {
        key.classList.toggle('hint-key');
        return true;
    }
    return false;
}

/** 给定一个假名 kana，在键盘上显示需要按下的键，并返回这些键。返回空则表示没有找到 */
function highlightKanaForInput(kana) {
    // 如果是浊音，则是需要两个按键哟，则拆分出来
    const keys = KanaToKey[kana];
    let isOk = true;

    if (keys === undefined) isOk = false;
    else if (!highlightOneKey(keys[0]) ||
        (keys[1] && !highlightOneKey(keys[1]))) {
        isOk = false;
    }
    if (!isOk) {
        console.warn(`找不到假名 ${kana} 对应的键来高亮显示 ${keys}`);
        return [];
    }

    return [...keys]; // 应该返回一个副本！！！
}

/** 普通的假名发射器，返回一个假名 */
class NormalKanaGenerator {

    /** 生成一个假名，高亮它所在的键，同时返回按哪些键 */
    getKanakey() {
        const kana = Kanas[Math.floor(Math.random() * Kanas.length)];
        WaittedKanaPanel.textContent = kana; // 渲染到页面上
        return highlightKanaForInput(kana);
    }
}

/** 单词版本的发射器，返回一个单词等信息 */
class WordGenerator {
    constructor() {
        /** 记录还有哪些假名等待输入哟，因为一个单词需要输入假名啦。
         * 在这个队列没有空之前，不会返回生成的单词
         */
        this.waitted = [];
        this.index = 0; // 记录当前在 waitted 数组的索引
    }
    /** 获取一个单词，并且展示到页面上 */
    getKanaWord() {
        this.clearWaitted();
        const words = KanaWords[Math.floor(Math.random() * KanaWords.length)];
        const { rawjp, spell, trans } = words;

        // 渲染到页面上
        WaittedKanaPanel.textContent = rawjp;
        document.querySelector('#spell').textContent = spell;
        document.querySelector('#trans').textContent = trans;

        this.waitted = words.rawjp.split('');
        // console.log("update waitted kana:", words);
    }
    /** 生成一个假名，高亮它所在的键，同时返回按哪些键 */
    getKanakey() {
        if (this.waitted.length == this.index) {
            this.getKanaWord();
        }
        // 表示已经输入正确，所以需要移动假名啦
        if (this.index >= 1) {
            moveToInputtedPanel();
        }
        const kana = this.waitted[this.index++];
        const r = highlightKanaForInput(kana);
        // 没有找到假名对应的按键，通常是一些符号啦，比如 ～ 符号
        // 此时就直接跳过，输入下一个假名咯
        if (r.length == 0) { return this.getKanakey(); }
        return r;
    }
    /** 当切换模式时，需要清空等待队列，以及已经输入的区域 */
    clearWaitted() {
        this.waitted = [];
        this.index = 0;
        InputtedKanaPanel.textContent = '';
    }
}

const kanaGenerator = new NormalKanaGenerator();
const wordGenerator = new WordGenerator();