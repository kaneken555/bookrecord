```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Browser as ブラウザ
    participant Server as サーバ
    participant DB as データベース

    User->>Browser: 削除ボタンをクリック (Reading Notes/Satisfaction Level)
    Browser->>Browser: モーダルに削除内容をセット
    Browser->>User: モーダル表示 (削除確認)

    alt ユーザーが削除を確認
        User->>Browser: 削除確認ボタンをクリック
        Browser->>Browser: 削除タイプ確認 (Reading Notes/Satisfaction Level)
        Browser->>Server: 削除リクエスト送信 (POST)
        Server->>DB: 対象のデータを削除
        DB-->>Server: 削除完了
        Server-->>Browser: 削除成功のレスポンス
        Browser->>User: ページリロード (削除反映)
    else キャンセルを選択
        User->>Browser: キャンセルボタンをクリック
        Browser->>User: モーダルを閉じる
    end

