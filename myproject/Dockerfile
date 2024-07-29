# Dockerfile

# Pythonの公式イメージをベースにする
FROM python:3.9-slim

# 必要なビルドツールをインストールする
RUN apt-get update && apt-get install -y default-libmysqlclient-dev gcc pkg-config

# 作業ディレクトリを作成する
WORKDIR /app

# 必要なパッケージをインストールする
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# アプリケーションコードをコピーする
COPY . .

# 環境変数を設定してcollectstaticコマンドを実行
ENV DJANGO_SETTINGS_MODULE=myproject.settings
RUN python manage.py collectstatic --noinput

# Gunicornを使ってアプリケーションを起動する
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "120", "myproject.wsgi:application"]
