// bookSearch.js
export function initBookSearch() {
    const searchButton = document.getElementById("searchButton");
    const searchResultsModalElement = document.getElementById("searchResultsModal");

    if (!searchResultsModalElement) {
        console.error("モーダル要素が見つかりません。");
        return;
    }


    // モーダルの初期化時にオプションを追加してみる
    const searchResultsModal = new bootstrap.Modal(searchResultsModalElement, {
        backdrop: 'static', // 'static', true, or false
        keyboard: true,
        focus: true
    });

    // const searchResultsModal = new bootstrap.Modal(document.getElementById("searchResultsModal"));
    // const searchResultsModal = new bootstrap.Modal(searchResultsModalElement);
    const searchResultsContainer = document.getElementById("searchResults");
    const coverImageInput = document.getElementById("cover-image-url");
    const coverPreviewImg = document.getElementById("cover-preview-img");
    const titleInput = document.getElementById("id_title");
    const authorInput = document.getElementById("id_author");
    const publisherInput = document.getElementById("id_publisher");
    const summaryInput = document.getElementById("id_summary");

    searchButton.addEventListener("click", function () {
        const title = titleInput.value;
        if (title) {
            fetch(`/search_books/?title=${encodeURIComponent(title)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        displaySearchResults(data);
                        searchResultsModal.show();
                    }
                })
                .catch(error => console.error("Error fetching data:", error));
        } else {
            alert("タイトルを入力してください。");
        }
    });

    function displaySearchResults(data) {
        searchResultsContainer.innerHTML = ""; // 前回の検索結果をクリア
        if (data.totalItems === 0) {
            searchResultsContainer.innerHTML = "<p>検索結果がありません。</p>";
            return;
        }

        const books = data.items;
        books.forEach(book => {
            const title = book.volumeInfo.title || "No title available";
            const description = book.volumeInfo.description || "No description available";
            const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown author";
            const publisher = book.volumeInfo.publisher || "Unknown publisher";
            const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/128x192.png?text=No+Image";

            const bookInfo = `
                <div class="book-info mb-3">
                    <div class="d-flex">
                        <img src="${thumbnail}" alt="${title}" class="img-thumbnail me-3" style="width: 128px; height: 192px;">
                        <div>
                            <h5>${title} <button class="btn btn-link btn-sm copy-button" data-copy="${title}">コピー</button><span class="copy-message" style="display: none;"></span></h5>
                            <p><strong>著者:</strong> ${authors} <button class="btn btn-link btn-sm copy-button" data-copy="${authors}">コピー</button><span class="copy-message" style="display: none;"></span></p>
                            <p><strong>出版社:</strong> ${publisher} <button class="btn btn-link btn-sm copy-button" data-copy="${publisher}">コピー</button><span class="copy-message" style="display: none;"></span></p>
                            <p><strong>概要:</strong> ${description} <button class="btn btn-link btn-sm copy-button" data-copy="${description}">コピー</button><span class="copy-message" style="display: none;"></span></p>
                            <button class="btn btn-success btn-sm register-button" data-title="${title}" data-authors="${authors}" data-publisher="${publisher}" data-description="${description}">登録</button>
                            <button class="btn btn-outline-secondary btn-sm select-thumbnail" data-thumbnail="${thumbnail}">カバー画像に設定</button>
                        </div>
                    </div>
                    <hr>
                </div>
            `;
            searchResultsContainer.innerHTML += bookInfo;
        });

        // コピーや登録、サムネイル選択のイベントリスナーを追加する処理をここに追加
        // すべてのコピー ボタンにイベント リスナーを追加
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', function () {
                const textToCopy = this.getAttribute('data-copy');
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const messageSpan = this.nextElementSibling;
                    messageSpan.textContent = 'コピーしました!';
                    messageSpan.style.display = 'inline-block';

                    // メッセージを2秒後に消去
                    setTimeout(() => {
                        messageSpan.style.display = 'none';
                    }, 2000);
                }).catch(err => {
                    console.error('コピーに失敗しました', err);
                });
            });
        });

        // すべての登録 ボタンにイベント リスナーを追加
        document.querySelectorAll('.register-button').forEach(button => {
            button.addEventListener('click', function () {
                const titleToCopy = this.getAttribute('data-title');
                const authorsToCopy = this.getAttribute('data-authors');
                const publisherToCopy = this.getAttribute('data-publisher');
                const descriptionToCopy = this.getAttribute('data-description');
                titleInput.value = titleToCopy; // タイトルを登録
                authorInput.value = authorsToCopy; // 著者を登録
                publisherInput.value = publisherToCopy; // 出版社を登録
                summaryInput.value = descriptionToCopy; // 概要を登録
                // searchResultsModal.hide(); // モーダルを閉じる
            });
        });

        // サムネイル画像をカバー画像に設定するボタンにイベントリスナーを追加
        document.querySelectorAll('.select-thumbnail').forEach(button => {
            button.addEventListener('click', function () {
                const thumbnailUrl = this.getAttribute('data-thumbnail');
                coverImageInput.value = thumbnailUrl; // カバー画像のhidden inputにURLを設定
                coverPreviewImg.src = thumbnailUrl;  // プレビュー画像のソースを設定
                coverPreviewImg.style.display = 'block';  // プレビュー画像を表示
            });
        });
    }
}
