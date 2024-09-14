```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database

    User->>Browser: ボタンをクリック (Reading Note / Satisfaction Level)
    Browser->>User: モーダルウィンドウを開く
    User->>Browser: フォームにデータを入力
    
    alt Reading Note登録
        User->>Browser: 「Reading Note登録」ボタンをクリック
        Browser->>Server: POST /readingnote/<book_id>/
        Server->>Database: データを保存 (Reading Note)
        Database-->>Server: 保存完了
        Server->>Browser: 200 OK
        Browser->>User: モーダルウィンドウを閉じる
        Browser->>User: ページをリロードし、登録データを表示
    end

    alt Satisfaction Level登録
        User->>Browser: 「Satisfaction Level登録」ボタンをクリック
        Browser->>Server: POST /postreading/<book_id>/
        Server->>Database: データを保存 (Satisfaction Level)
        Database-->>Server: 保存完了
        Server->>Browser: 200 OK
        Browser->>User: モーダルウィンドウを閉じる
        Browser->>User: ページをリロードし、登録データを表示
    end
