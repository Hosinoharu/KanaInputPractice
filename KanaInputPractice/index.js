/**
 * 处理键盘输入
 */

let isShiftDown = false;
/** 记录当前假名需要按下哪些键 */
let kanaKeyForInput = [];
/** 记录当前的模式 */
let currMode = '';

// #tag keyup事件
// 按键显示、按键判断等等
document.addEventListener('keyup', (event) => {
    const key = event.code;
    const isShiftKey = (key === 'ShiftLeft' || key === 'ShiftRight');
    // #tag shift-keyup
    if (isShiftDown && isShiftKey) {
        isShiftDown = false;
        toggleHighlightlittleHiraKey(key);
    }

    // #tag 按键样式 添加样式表示触发按键，且一段时间后移除样式
    const elem = document.querySelector(`#key-${key}`);
    if (!elem) return;

    elem.classList.toggle('keyup');
    setTimeout(() => { elem.classList.toggle('keyup'); }, 100);

    // #tag 判断按键是否正确
    // 首先，如果预定输入 shift 键，则本次即便相等也不处理，必须按住 shift 键再按下一个键才处理
    if (key === kanaKeyForInput[0] && !isShiftKey && !event.shiftKey) {
        // 原本这个键是采用提示高亮的样式，现在既然答对了，那就取消提示高亮
        elem.classList.toggle('hint-key');
        kanaKeyForInput.shift(); // 去掉已经按下的键咯
    }
    // 这说明当前输入的是一个小假名
    else if (kanaKeyForInput[0] === 'ShiftLeft' && event.shiftKey
        && key === kanaKeyForInput[1]
    ) {
        elem.classList.toggle('hint-key');
        // 取消 shift 键的高亮
        const shiftLeft = document.querySelector('#key-ShiftLeft');
        if (shiftLeft) shiftLeft.classList.toggle('hint-key', false);
        const shiftRight = document.querySelector('#key-ShiftRight');
        if (shiftRight) shiftRight.classList.toggle('hint-key', false);
        kanaKeyForInput = [];
    }

    // #tag 更新假名显示
    if (kanaKeyForInput.length === 0) {
        if (currMode === 'kanaMode') {
            kanaKeyForInput = kanaGenerator.getKanakey();
        } else if (currMode === 'wordMode') {
            kanaKeyForInput = wordGenerator.getKanakey();
        }
    }
});


// #tag keydown事件
// 主要处理 shift 按键时高亮小假名键
document.addEventListener('keydown', (event) => {
    const key = event.code;
    key === 'Tab' && event.preventDefault();

    // #tag shift-keydown
    if (!isShiftDown && (key === 'ShiftLeft' || key === 'ShiftRight')) {
        isShiftDown = true;
        toggleHighlightlittleHiraKey(key);
    }
});

// 每次调用 toggleHighlightlittleHiraKey() 时都要查找大量 div，所以先单独建立索引啦
const noLittleKeys = document.querySelectorAll(`.keyboard-key:not(:has(.littleHira))`);
/** 给不具备小假名的 key 都变暗，同时高亮对应的 shift 键（分左右两个嘛）*/
function toggleHighlightlittleHiraKey(shift) {
    noLittleKeys.forEach(elem => {
        elem.classList.toggle('key-no-littleHira');
    });
    const elem = document.querySelector('#key-' + shift);
    if (elem) elem.classList.toggle('key-shift-down');
}

/** 当模式切换时调用 */
function whenChangeMode() {
    currMode = '';
    kanaKeyForInput = [];
    // 取消原本的高亮按键
    document.querySelectorAll(`.hint-key`).forEach(elem => {
        elem.classList.remove('hint-key');
    });
}

// #tag 假名模式
document.querySelector('#kanaMode').addEventListener('change', (e) => {
    whenChangeMode();
    if (e.target.checked) {
        currMode = 'kanaMode';
        // 隐藏多余的信息
        document.querySelector('#elseinfo').style.display = 'none';
        kanaKeyForInput = kanaGenerator.getKanakey();
    }
});

// #tag 单词模式
document.querySelector('#wordMode').addEventListener('change', async (e) => {
    whenChangeMode();
    if (e.target.checked) {
        currMode = 'wordMode';
        document.querySelector('#elseinfo').style.display = 'block';
        wordGenerator.clearWaitted();
        kanaKeyForInput = wordGenerator.getKanakey();
    }
});
