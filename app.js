// ローカルストレージのキー
const STORAGE_KEY = 'split-sizes';
const VISIBILITY_KEY = 'right-panel-visible';

// ローカルストレージから保存されたサイズを取得
function getSavedSizes() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('ローカルストレージの読み込みエラー:', e);
        }
    }
    return [50, 50]; // デフォルト値
}

// ローカルストレージにサイズを保存
function saveSizes(sizes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
    } catch (e) {
        console.error('ローカルストレージの保存エラー:', e);
    }
}

// Split.jsインスタンス生成
const split = Split(['#left', '#right'], {
    sizes: getSavedSizes(), // 保存された位置を復元
    gutterSize: 10,
    onDrag: function() {
        // スプリッター移動時にSiemaを更新
        if (mySiema) {
            mySiema.resizeHandler();
        }
    },
    onDragEnd: function(sizes) {
        // ドラッグ終了時に位置を保存
        saveSizes(sizes);
    }
});

// Siemaインスタンス生成
const mySiema = new Siema({
    loop: true,
});

// トグルボタンの機能
const toggleButton = document.getElementById('toggleButton');
const rightArea = document.getElementById('right');

/**
 * 右側領域とスプリッターを表示・非表示します。
 */
function updateVisibility() {
    // スプリッター（gutter）要素を取得
    let gutterElements = document.querySelectorAll('.gutter');
    
    if (rightArea.style.display === 'none') {
        // 非表示の場合 → 表示する
        rightArea.style.display = '';
        
        // スプリッターも表示
        gutterElements.forEach(function(gutter) {
            gutter.style.display = '';
        });
        
        // 保存されたサイズを復元
        let savedSizes = getSavedSizes();
        if (savedSizes && typeof split.setSizes === 'function') {
            try {
                split.setSizes(savedSizes);
            } catch (e) {
                // setSizesが未サポートでも続行
            }
        }
    }
    else {
        // 表示の場合 → 非表示にする
        rightArea.style.display = 'none';
        
        // スプリッターも非表示
        gutterElements.forEach(function(gutter) {
            gutter.style.display = 'none';
        });
        
        
        // left領域を全幅にする
        let leftArea = document.getElementById('left');
        if (leftArea) {
            leftArea.style.width = '100%';
        }
    }
}

// ボタンクリック時の処理
toggleButton.addEventListener('click', function() {
    updateVisibility();
});