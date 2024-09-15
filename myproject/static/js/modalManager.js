// modalManager.js
export function initDeleteModalManager() {
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
}


export function initRegisterModalManager() {
// document.addEventListener('DOMContentLoaded', function() {
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
// });
}