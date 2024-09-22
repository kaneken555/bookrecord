function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-tag-button').addEventListener('click', function() {
        var tagList = document.getElementById('tag-list');
        var newTag = document.createElement('div');
        newTag.className = 'input-group mb-3';
        newTag.innerHTML = `
            <input type="text" name="tags" class="form-control" placeholder="Tag">
            <div class="input-group-append">
                <button class="btn btn-outline-danger remove-tag-button" type="button"><i class="fas fa-minus"></i></button>
            </div>
        `;
        tagList.appendChild(newTag);
        
        var removeButtons = document.querySelectorAll('.remove-tag-button');
        removeButtons[removeButtons.length - 1].addEventListener('click', function() {
            this.closest('.input-group').remove();
        });
    });
});

   
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchResultsModal = new bootstrap.Modal(document.getElementById("searchResultsModal"));
    const searchResultsContainer = document.getElementById("searchResults");
    const coverImageInput = document.getElementById("cover-image-url"); // カバー画像のURLを格納するhidden input
    const coverPreviewImg = document.getElementById("cover-preview-img"); // プレビュー画像の要素
    const titleInput = document.getElementById("id_title"); // タイトルの入力フィールドを取得
    const authorInput = document.getElementById("id_author"); // 著者の入力フィールドを取得
    const publisherInput = document.getElementById("id_publisher"); // 出版社の入力フィールドを取得
    const summaryInput = document.getElementById("id_summary"); // 概要の入力フィールドを取得

    searchButton.addEventListener("click", function () {
        const titleInput = document.getElementById("id_title");
        const title = titleInput.value;

        if (title) {
            // サーバーサイドのエンドポイントを使用して検索
            fetch(`/search_books/?title=${encodeURIComponent(title)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        displaySearchResults(data);
                        searchResultsModal.show();  // モーダルを表示
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
});


// モーダル表示・非表示の処理
document.addEventListener('DOMContentLoaded', function() {
    let itemIdToDelete = null;
    let deleteType = null; // 'reading_note' か 'satisfaction_level' を格納

    const modal = new bootstrap.Modal(document.getElementById('myModal')); // Bootstrapのモーダル初期化
    // const openModalBtn = document.getElementById("open-modal");
    const closeModal = document.getElementsByClassName("close")[0];
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");


    // モーダルを開く - Reading Notesの削除
    document.querySelectorAll(".delete-reading-note").forEach(button => {
        button.onclick = function() {
            itemIdToDelete = this.getAttribute("data-note-id")
            deleteType = 'reading_note'; // 削除タイプを設定

            // ボタンからReading Noteの詳細を取得してモーダルにセット
            const noteImpression = this.closest(".list-group-item").querySelector(".note-impression").textContent;
            const noteLearning = this.closest(".list-group-item").querySelector(".note-learning").textContent;
            const noteDate = this.closest(".list-group-item").querySelector(".note-date").textContent;

            document.getElementById("note-impression").textContent = noteImpression;
            document.getElementById("note-learning").textContent = noteLearning;
            document.getElementById("note-date").textContent = noteDate;
            document.getElementById("modal-message").textContent = "Reading Noteを削除しますか？";

            // Reading Noteの詳細を表示し、Satisfaction Levelの詳細を隠す
            document.getElementById("reading-note-details").style.display = 'block';
            document.getElementById("satisfaction-level-details").style.display = 'none';

            modal.show();
        }
    });

    // モーダルを開く - Satisfaction Levelの削除
    document.querySelectorAll(".delete-satisfaction-level").forEach(button => {
        button.onclick = function() {
            itemIdToDelete = this.getAttribute("data-summary-id");
            deleteType = 'satisfaction_level'; // 削除タイプを設定

            // データをモーダルにセット
            const satisfactionLevel = this.closest(".list-group-item").querySelector(".satisfaction-level").textContent;
            const summaryDate = this.closest(".list-group-item").querySelector(".summary-date").textContent;

            document.getElementById("satisfaction-level").textContent = satisfactionLevel;
            document.getElementById("summary-date").textContent = summaryDate;
            document.getElementById("modal-message").textContent = "Satisfaction Levelを削除しますか？";

            // Satisfaction Levelの詳細を表示し、Reading Noteの詳細を隠す
            document.getElementById("satisfaction-level-details").style.display = 'block';
            document.getElementById("reading-note-details").style.display = 'none';

            modal.show();
        }
    });

    // モーダルを閉じる
    closeModal.onclick = function() {
        modal.hide(); // モーダルを閉じる
    }

    // OKボタンを押した場合の処理
    confirmDeleteButton.addEventListener("click", function () {
        if (itemIdToDelete && deleteType) {
            let url = '';
            if (deleteType === 'reading_note') {
                url = `/delete_reading_note/${itemIdToDelete}/`;
            } else if (deleteType === 'satisfaction_level') {
                url = `/delete_post_reading_summary/${itemIdToDelete}/`;
            }
            // Fetchを使って削除リクエストを送信
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // CSRFトークンを送信
                },
            }).then(response => {
                if (response.ok) {
                    // ページをリロードして削除後の状態を表示
                    window.location.reload();
                } else {
                    console.error('削除に失敗しました。');
                }
            });            
            // modal.hide(); // モーダルを閉じる
        }
    });

    // キャンセルボタンを押した場合の処理
    document.getElementById("cancel-btn").onclick = function() {
        // alert("キャンセル が押されました。");
        modal.hide(); // モーダルを閉じる
    }

    // モーダル外クリックでの処理
    window.onclick = function(event) {
        if (event.target == modal._element) { 
            modal.hide();
        }
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // モーダル関連の要素
    const inputModal = new bootstrap.Modal(document.getElementById('inputModal')); // Satisfaction Levelモーダルの初期化
    const confirmAddButton = document.getElementById('confirmAddButton');
    const summaryDateInput = document.getElementById('summary-date-input');
    const noteDateInput = document.getElementById('note-date-input');
    let inputType = null; // 'reading_note' か 'satisfaction_level' を格納
    let currentBookCode = null; // 現在の選択された本のコードを格納

    // 今日の日付をデフォルトでセットする
    setDefaultDate();

    // イベントリスナーの設定
    // document.querySelectorAll('.register-reading-note').addEventListener('click', () => openModal('reading_note'));
    // document.querySelectorAll('.register-satisfaction-level').addEventListener('click', () => openModal('satisfaction_level'));
    document.querySelectorAll('.register-reading-note').forEach(button => {
        button.addEventListener('click', () => openModal('reading_note', button));
    });
    
    document.querySelectorAll('.register-satisfaction-level').forEach(button => {
        button.addEventListener('click', () => openModal('satisfaction_level', button));
    });
    
    confirmAddButton.addEventListener('click', handleSubmit);
    // キャンセルボタンをクリックしたときにモーダルを閉じる
    document.getElementById('cancelButton').addEventListener('click', () => inputModal.hide());

    // 日付のデフォルト値をセットする関数
    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        summaryDateInput.value = today;
        noteDateInput.value = today;
    }

    function openModal(type, button) {
        inputType = type;
        currentBookCode = button.getAttribute('data-book-code');
        let bookTitle;
        // トップ画面と詳細画面で処理を分岐
        if (document.querySelector('.book-item')) {
            // トップ画面の場合
            bookTitle = button.closest('.book-item').querySelector('.book-title a').textContent;
        } else {
            // 詳細画面の場合
            bookTitle = document.querySelector('h2').textContent.replace('Details : ', '');
        }
        // const bookTitle = button.closest('.book-item').querySelector('.book-title a').textContent;
        // モーダルのタイトルに本のタイトルを設定
        document.getElementById('modalLabel').textContent = bookTitle;

        if (type === 'reading_note') {
            document.getElementById("register-reading-note-form").style.display = 'block';
            document.getElementById("register-satisfaction-level-form").style.display = 'none';
        } else if (type === 'satisfaction_level') {
            document.getElementById("register-satisfaction-level-form").style.display = 'block';
            document.getElementById("register-reading-note-form").style.display = 'none';
        }
        inputModal.show();
    }

    function handleSubmit() {
        let url = '';
        let formData = new FormData();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (inputType === 'reading_note') {
            const learning = document.getElementById('note-learning-input').value;
            const impression = document.getElementById('note-impression-input').value;
            const noteDate = document.getElementById('note-date-input').value;
            const bookCode = document.querySelector('.register-reading-note').getAttribute('data-book-code');

            url = `/readingnote/${currentBookCode}/`;
            formData.append('learning', learning);
            formData.append('impression', impression);
            formData.append('registration_date', noteDate);
        } else if (inputType === 'satisfaction_level') {
            const satisfactionLevel = document.getElementById('satisfaction-level-input').value;
            const summaryDate = document.getElementById('summary-date-input').value;
            const bookCode = document.querySelector('.register-satisfaction-level').getAttribute('data-book-code');

            url = `/postreading/${currentBookCode}/`;
            formData.append('satisfaction_level', satisfactionLevel);
            formData.append('registration_date', summaryDate);
        }

        formData.append('csrfmiddlewaretoken', csrfToken);
        sendPostRequest(url, formData);
    }

    // サーバーにPOSTリクエストを送信
    function sendPostRequest(url, formData) {
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('登録に失敗しました。');
                showError('登録に失敗しました。再度お試しください。');
            }
        });
    }

    function showError(message) {
        document.getElementById('modal-error-message').textContent = message;
    }
});


// Updateモーダル処理
document.addEventListener('DOMContentLoaded', function() {
    // モーダル関連の要素
    const updateModal = new bootstrap.Modal(document.getElementById('updateModal')); // Updateモーダルの初期化
    const confirmUpdateButton = document.getElementById('confirmUpdateButton');
    let updateType = null; // 'reading_note' か 'satisfaction_level' を格納
    let currentNoteId = null; // 現在の選択されたノートのIDを格納

    // イベントリスナーの設定
    document.querySelectorAll('.update-reading-note').forEach(button => {
        button.addEventListener('click', () => openUpdateModal('reading_note', button));
    });
    
    document.querySelectorAll('.update-satisfaction-level').forEach(button => {
        button.addEventListener('click', () => openUpdateModal('satisfaction_level', button));
    });
    
    confirmUpdateButton.addEventListener('click', handleUpdate);
    // キャンセルボタンをクリックしたときにモーダルを閉じる
    document.getElementById('cancelUpdateButton').addEventListener('click', () => updateModal.hide());

    // モーダルを開くときにデフォルト値を設定
    function openUpdateModal(type, button) {
        updateType = type;
        currentNoteId = button.getAttribute('data-note-id') || button.getAttribute('data-summary-id');

        // モーダルのタイトル取得
        bookTitle = document.querySelector('h2').textContent.replace('Details : ', '');
        // モーダルのタイトルに本のタイトルを設定
        document.getElementById('updateModalLabel').textContent = bookTitle;

        if (type === 'reading_note') {
            const noteElement = button.closest('.list-group-item');
            const impression = noteElement.querySelector('.note-impression').textContent;
            const learning = noteElement.querySelector('.note-learning').textContent;
            const date = noteElement.querySelector('.note-date').textContent;

            // 日付を YYYY-MM-DD 形式に変換
            const formattedDate = formatDateToInput(date);

            document.getElementById('update-note-impression-input').value = impression;
            document.getElementById('update-note-learning-input').value = learning;
            document.getElementById('update-note-date-input').value = formattedDate;

            document.getElementById("update-reading-note-form").style.display = 'block';
            document.getElementById("update-satisfaction-level-form").style.display = 'none';
        } else if (type === 'satisfaction_level') {
            const summaryElement = button.closest('.list-group-item');
            const satisfactionLevel = summaryElement.querySelector('.satisfaction-level').textContent;
            const date = summaryElement.querySelector('.summary-date').textContent;

            // 日付を YYYY-MM-DD 形式に変換
            const formattedDate = formatDateToInput(date);

            document.getElementById('update-satisfaction-level-input').value = satisfactionLevel;
            document.getElementById('update-summary-date-input').value = formattedDate;

            document.getElementById("update-satisfaction-level-form").style.display = 'block';
            document.getElementById("update-reading-note-form").style.display = 'none';
        }

        updateModal.show();
    }

    // 更新ボタンをクリックしたときの処理
    function handleUpdate() {
        let url = '';
        let formData = new FormData();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (updateType === 'reading_note') {
            const learning = document.getElementById('update-note-learning-input').value;
            const impression = document.getElementById('update-note-impression-input').value;
            const noteDate = document.getElementById('update-note-date-input').value;

            url = `/update_reading_note/${currentNoteId}/`;
            formData.append('learning', learning);
            formData.append('impression', impression);
            formData.append('registration_date', noteDate);
        } else if (updateType === 'satisfaction_level') {
            const satisfactionLevel = document.getElementById('update-satisfaction-level-input').value;
            const summaryDate = document.getElementById('update-summary-date-input').value;

            url = `/update_post_reading_summary/${currentNoteId}/`;
            formData.append('satisfaction_level', satisfactionLevel);
            formData.append('registration_date', summaryDate);
        }

        formData.append('csrfmiddlewaretoken', csrfToken);
        sendUpdateRequest(url, formData);
    }

    // サーバーにPOSTリクエストを送信
    function sendUpdateRequest(url, formData) {
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('更新に失敗しました。');
                showError('更新に失敗しました。再度お試しください。');
            }
        });
    }

    function showError(message) {
        document.getElementById('modal-update-error-message').textContent = message;
    }

    // 日付を YYYY-MM-DD 形式に変換する関数
    function formatDateToInput(dateString) {
        // 例: "2024年9月21日" の形式から年、月、日を抽出
        const datePattern = /(\d+)年(\d+)月(\d+)日/;
        const match = dateString.match(datePattern);
    
        if (match) {
            const year = match[1];
            const month = String(match[2]).padStart(2, '0');  // 2桁に揃える
            const day = String(match[3]).padStart(2, '0');    // 2桁に揃える
            return `${year}-${month}-${day}`;
        } else {
            console.error("Invalid date format:", dateString);
            return null;  // フォーマットに合わない場合はnullを返す
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const updateBasicInfoModal = new bootstrap.Modal(document.getElementById('updateBasicInfoModal')); // モーダルの初期化
    // const updateBasicInfoForm = document.getElementById('updateBasicInfoForm');
    let currentBasicInfoId = null;
    const confirmBasicInfoUpdateButton = document.getElementById("confirmBasicInfoUpdateButton");

    confirmBasicInfoUpdateButton.addEventListener('click', handleUpdate);

    // ボタンがクリックされたときにモーダルを開く
    document.querySelectorAll('.update-basic-info').forEach(button => {
        button.addEventListener('click', function() {
            // // モーダルを表示
            // updateBasicInfoModal.show();
            
            currentBasicInfoId = this.getAttribute('data-basic-info-id'); // Basic Info IDを取得

            // モーダルのタイトル取得
            bookTitle = document.querySelector('h2').textContent.replace('Details : ', '');
            // モーダルのタイトルに本のタイトルを設定
            document.getElementById('updateBasicInfoModalLabel').textContent = bookTitle;

            // Basic Informationのデータを取得してフォームに設定
            fetch(`/get_basic_info/${currentBasicInfoId}/`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('id_title').value = data.title;
                    document.getElementById('id_genre').value = data.genre; // 既存のジャンルを設定
                    document.getElementById('id_author').value = data.author;
                    document.getElementById('id_publisher').value = data.publisher;
                    document.getElementById('id_summary').value = data.summary;
                    document.getElementById('id_purpose').value = data.purpose;
                    document.getElementById('id_buy_reason').value = data.buy_reason;

                    // ジャンルの選択肢をクリアしてから設定
                    const genreSelect = document.getElementById('id_genre');
                    genreSelect.innerHTML = '';
                    data.genres.forEach(function(genre) {
                        const option = document.createElement('option');
                        option.value = genre.genre_id;
                        option.textContent = genre.genre_name;
                        genreSelect.appendChild(option);
                    });

                    // 現在のジャンルを選択状態にする
                    genreSelect.value = data.genre;

                    updateBasicInfoModal.show(); // モーダルを表示
                })
                .catch(error => console.error('Error fetching data:', error));
        });
    });

    // 更新ボタンをクリックしたときの処理
    function handleUpdate() {
        let url = '';
        let formData = new FormData();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        const title = document.getElementById('id_title').value;
        const genre = document.getElementById('id_genre').value
        const author = document.getElementById('id_author').value;
        const publisher = document.getElementById('id_publisher').value;
        const summary = document.getElementById('id_summary').value;
        const purpose = document.getElementById('id_purpose').value;
        const buy_reason = document.getElementById('id_buy_reason').value;

        url = `/update_basic_info/${currentBasicInfoId}/`;
        formData.append('title', title);
        formData.append('genre', genre);
        formData.append('author', author);
        formData.append('publisher', publisher);
        formData.append('summary', summary);
        formData.append('purpose', purpose);
        formData.append('buy_reason', buy_reason);

        // console.log('formData',formData);

        formData.append('csrfmiddlewaretoken', csrfToken);
        sendUpdateRequest(url, formData);

    }

    // サーバーにPOSTリクエストを送信
    function sendUpdateRequest(url, formData) {
        console.log('sendUpdateRequest');
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('更新に失敗しました。');
                showError('更新に失敗しました。再度お試しください。');
            }
        });
    }

    function showError(message) {
        document.getElementById('modal-update-error-message').textContent = message;
    }
});


// モーダル表示・非表示の処理
document.addEventListener('DOMContentLoaded', function() {
    const deleteBasicInfoModal = new bootstrap.Modal(document.getElementById('deleteBasicInfoModal')); // Bootstrapのモーダル初期化
    let basicInfoIdToDelete = null; // 削除するBasic InfoのIDを保持
    const confirmBasicInfoDeleteButton = document.getElementById("confirmBasicInfoDeleteButton");

    // モーダルを開く処理
    document.querySelectorAll(".delete-basic-info").forEach(button => {
        button.addEventListener('click', function() {

            basicInfoIdToDelete = this.getAttribute("data-basic-info-id"); // Basic Info IDを取得
            document.getElementById("modal-message").textContent = "このBasic Infoを削除しますか？";
            deleteBasicInfoModal.show();
        });
    });

    // 削除ボタンを押したときの処理
    confirmBasicInfoDeleteButton.addEventListener('click', function() {
        // console.log('Button clicked'); // ボタンがクリックされたことを確認
        if (basicInfoIdToDelete) {
            let url = `/delete_basic_info/${basicInfoIdToDelete}/`; // 削除用のURL

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // CSRFトークンを送信
                }
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/list'; // 成功したらリストページにリダイレクト
                } else {
                    console.error('削除に失敗しました。');
                }
            }).catch(error => {
                console.error('削除に失敗しました。', error);
            });
        }
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
});
