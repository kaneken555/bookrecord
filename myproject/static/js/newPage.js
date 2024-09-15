// newPage.js
import { initTagManager } from './tagManager.js';
import { initBookSearch } from './bookSearch.js';

document.addEventListener('DOMContentLoaded', function() {
    initTagManager();
    initBookSearch();
});
