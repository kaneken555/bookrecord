# BookRecord
本管理アプリ（読みたい/読んでいる本の登録、読書記録の追加ができる）


## 使用技術一覧

<!-- シールド一覧 -->
<!-- 該当するプロジェクトの中から任意のものを選ぶ-->
<p style="display: inline">
  <!-- バックエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Django-092E20.svg?logo=django&style=for-the-badge">
  <!-- バックエンドの言語一覧 -->
  <img src="https://img.shields.io/badge/-Python-F2C63C.svg?logo=python&style=for-the-badge">
  <!-- ミドルウェア一覧 -->
  <img src="https://img.shields.io/badge/-Nginx-269539.svg?logo=nginx&style=for-the-badge">
  <img src="https://img.shields.io/badge/-MySQL-4479A1.svg?logo=mysql&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Gunicorn-199848.svg?logo=gunicorn&style=for-the-badge&logoColor=white">
  <!-- インフラ一覧 -->
  <img src="https://img.shields.io/badge/-Docker-1488C6.svg?logo=docker&style=for-the-badge">
<!--   <img src="https://img.shields.io/badge/-githubactions-FFFFFF.svg?logo=github-actions&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Amazon%20aws-232F3E.svg?logo=amazon-aws&style=for-the-badge"> -->
</p>


## プロジェクトについて
### 概要
読みたい/読んでいる本を登録した後、読書記録を記録できるWebアプリを作成しました。  
・Google Books APIを用いて素早く本の検索/登録ができます。  
・読書メモを記録することができます。

### 機能
#### メイン機能
本検索（Google Book API）  
<img width="500" alt="image" src="https://github.com/user-attachments/assets/5a298c69-50d1-45a6-8e52-80785edeb905">

本登録　　  
読書記録  
本/読書記録削除  
登録リスト確認  

#### 認証機能
ユーザー登録/ログイン/ログアウト  
ソーシャルログイン（Google、LINE）＊デプロイ未完了  


## システム構成図
準備中

## 画面遷移図
<img width="700" alt="image" src="https://github.com/user-attachments/assets/042ef5cc-5ace-48f6-b4ef-ff751390e503">

## ER図
<img src="https://github.com/user-attachments/assets/dd9ae378-bc8e-406e-b85f-b146854084a5" width="500">

## 今後の展望
lineID連携  
・LINEで本の登録/リストの確認ができる

