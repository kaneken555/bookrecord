```mermaid
sequenceDiagram
    participant User as ユーザー
    participant View as views.new
    participant DBHelper as db_helpers
    participant Model as Model (Book, BasicInfo, etc.)
    participant API as external_api_helpers (search_books_google_api)
    participant Storage as Media Storage

    User->>View: 新しい本を登録（POST）
    View->>View: バリデーションチェック (BookForm, BasicInfoForm)
    alt バリデーション成功
        View->>DBHelper: create_basic_info(user)
        DBHelper->>Model: BasicInfoインスタンス作成
        Model-->>DBHelper: 新しいBasicInfoを返す
        DBHelper-->>View: 新しいBasicInfoを返す

        View->>Storage: カバー画像URLをダウンロード
        Storage-->>View: カバー画像を保存

        View->>Model: Bookを保存
        Model-->>View: 新しいBookを返す

        View->>DBHelper: create_book_user(user, book, basic_info)
        DBHelper->>Model: BookUserインスタンス作成
        Model-->>DBHelper: 新しいBookUserを返す
        DBHelper-->>View: 新しいBookUserを返す

        View->>DBHelper: add_tags_to_basic_info(basic_info, tags)
        DBHelper->>Model: タグを保存し、BasicInfoに関連付け

        View->>User: 登録完了後、トップページへリダイレクト
    else バリデーション失敗
        View->>User: エラーメッセージを表示
    end

