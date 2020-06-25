# 英語音声で読み上げてくれるBot

[招待リンク](https://discordapp.com/channels/711964290617311232/711964290617311235/725034208367607809)

## 目的

- 話している時に気になった英語をさっと読み上げさせたい

## 動作環境

- ubuntu 18.04
  - nodejs 10.16.3
    - discord.js
    - dropbox 4.0.30
    - request 2.88.0
  - jq
  - Google cloud SDK (CLI)
    - gcloudコマンドでトークンが取得できる様にしておく必要があります。

## 動き概要

1. Discordでボイスチャンネルに入っている人から!peroで始まるメッセージを受け取る
2. Google Cloud Text to Speech APIを呼び出し、音声データ(base64形式)を取得
3. 音声データをbase64デコードし、再生

## 使い方

### 読み上げさせる

```
!pero <読み上げさせたいメッセージ>
```

### ボイスチャンネルから出てってもらう

注意：これをしないと出てってくれません

```
!pero disc
```

## 起動方法

```
# nodejsのインストール
$ git clone https://github.com/creationix/nvm ~/.nvm
$ source ~/.nvm/nvm.sh
$ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
$ nvm install 10.16.3
$ nvm use 10.16.3

# このアプリの起動
$ git clone https://github.com/sakkuntyo/discord-pero
$ cd discord-pero
$ sed "s/<discordtoken>/ここにdiscordのトークンを入れる/g" -i index.js
$ npm install
$ npm start

# デーモンにしたい場合、pm2を使う
$ npm install -g pm2
$ pm2 start index pero
## OSの起動と同時に起動
$ pm2 startup
## 現在のpm2 listの状態を保存
$ pm2 save
```

## [Discord Developer Portal](https://discordapp.com/developers/)でする事

### 1.アプリケーション作成

### 2.Bot設定ページのBUILD-A-BOTにある Add Bot ボタンを押下

今後このページからBot設定を行う

### 3.OAuth2設定ページから招待リンクを作成してBotをチャンネルに追加する

- 必要なスコープ
  - bot
- 必要な権限
  - Send Messages

### 4.tokenはBot設定ページの Click to Reveal Token をクリックして表示される物を使用する


## [Dropbox Developer](https://www.dropbox.com/developers/apps)でする事

## [bitly itlinks](http://bitly.com/a/oauth_apps)でする事
