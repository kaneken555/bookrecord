```mermaid
graph TD
    A[トップページ] -->|クリック| B[本の詳細ページ]
    A -->|新規登録ボタン| C[新規登録ページ]
    A -->|興味ありリスト| E[興味ありリストページ]
    A -->|ログイン| F[ログインページ]
    
    B -->|読書ノート追加| G[読書ノート追加ページ]
    B -->|読了まとめ追加| H[読了まとめ追加ページ]
    B -->|基本情報編集| I[基本情報編集ページ]
    B -->|基本情報削除| J[削除確認ページ]
    
    C -->|登録| A
    
    E -->|詳細表示| B
    F -->|ログイン成功| A
    F -->|新規登録| K[新規登録ページ]

    G -->|保存| B
    H -->|保存| B
    I -->|保存| B
    J -->|削除| A