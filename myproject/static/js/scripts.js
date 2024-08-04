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
                            <h5>${title}</h5>
                            <p><strong>著者:</strong> ${authors}</p>
                            <p><strong>出版社:</strong> ${publisher}</p>
                            <p><strong>概要:</strong> ${description}</p>
                        </div>
                    </div>
                    <hr>
                </div>
            `;
            searchResultsContainer.innerHTML += bookInfo;
        });
    }
});


