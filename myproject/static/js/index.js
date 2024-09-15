// index.js
import { openNav, closeNav } from './sidebar.js';
import { initTagManager } from './tagManager.js';
import { initBookSearch } from './bookSearch.js';
import { initDeleteModalManager, initRegisterModalManager } from './modalManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // サイドバーのイベントリスナー
    // document.getElementById('openNavButton').addEventListener('click', openNav);
    // document.getElementById('closeNavButton').addEventListener('click', closeNav);

    // 各モジュールの初期化
    // initTagManager();
    // initBookSearch();
    initDeleteModalManager();
    initRegisterModalManager();
});