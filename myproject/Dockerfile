# ベースイメージ
FROM python:3.8-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . /app/

# 環境変数を設定
ENV PYTHONUNBUFFERED=1

# ポートを公開
EXPOSE 8000

# コンテナが起動したときに実行されるコマンド
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
