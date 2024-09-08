```mermaid
sequenceDiagram
    participant User as User
    participant Browser as Browser
    participant Server as Server
    participant Database as Database

    User->>Browser: クリック "Delete" ボタン
    Browser->>Browser: data-note-id, Reading Note詳細を取得し、モーダルにセット
    Browser->>User: モーダル表示

    User->>Browser: モーダルで "OK" ボタンをクリック
    Browser->>Server: Fetchリクエスト (POST /delete_reading_note/${noteIdToDelete}/)
    Server->>Database: ReadingNoteデータの削除リクエスト
    Database->>Server: 削除成功
    Server->>Browser: 削除成功レスポンス
    Browser->>User: ページをリロード
