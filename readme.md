# 再生してくれるBot

[招待リンク](https://discord.com/api/oauth2/authorize?client_id=889584860308570113&permissions=3147904&scope=bot)

# お知らせ

新しい Discord.js (14.x) と Nodejs (18.x) 向けに [新しいリポジトリ](https://github.com/sakkuntyo/discord-sktrythmjs2) に移行しました。

恐らくこのリポジトリはもう更新されませんし、このコードを実行しても Discord 側が対応していない様子なので、動作しません。

## 目的

- ?

## 動作環境

- ubuntu 20.04 (Azure VM)
  - nodejs 14.17.6
    - discord.js 12.3.0

## 動き概要

1. Discordでボイスチャンネルに入っている人から!spで始まるメッセージを受け取る
2. 再生する

## 使い方

![](./howtouse.gif)

### 再生

```
!sr (<play> or <p>) (<URL> or <keyword>)
```

### ボイスチャンネルから退出

注意：これをしないと退出しません

```
!sr (<disc> or <d>)
```

### キューを表示

```
!sr (<queue> or <q>)
``` 

### 再生中の曲を表示

```
!sr (<now> or <n>)
``` 

### キューのシャッフル

```
!sr (<shuffle>)
``` 

### 次の曲を再生

```
!sr (<skip> or <s>)
```

### キューの曲を先頭に移動

```
!sr <mv> 3
```
> 3番目の曲が移動されます。

### ループ機能の切り替え

```
!sr loop
```

### キューの曲を削除

```
!sr <rm> 3
```
> 3番目の曲が削除されます。

### プレイリストを検索

```
!sr (<spl>) キーワード
```

### プレイリストを再生

```
!sr (<spl>) (プレイリスト検索番号) キーワード
```

### ヘルプ

使い方ページのリンク、招待リンクを表示します。

```
!sr (<help> or <h>)
```

### バージョン情報

招待リンクやbotのバージョン情報を表示します

```
!sr (<version> or <v>)
```

## 起動方法

```
# nodejsのインストール
$ git clone https://github.com/creationix/nvm ~/.nvm
$ source ~/.nvm/nvm.sh
$ echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
$ nvm install 14.17.6
$ nvm use 14.17.6

# このアプリの起動
$ git clone https://github.com/sakkuntyo/discord-sktrythmjs
$ cd discord-sktrythmjs
$ sed "s/<discordtoken>/ここにdiscordのトークンを入れる/g" -i settings.json
$ sed "s/<iKey>/ここに Application Insights のインストルメンテーションキーを入れる/g" -i settings.json // 必要な場合のみ
$ npm install //失敗します
$ sudo apt install build-essential -y
$ npm install //成功します
$ npm start

# デーモンにしたい場合、pm2を使う
$ npm install -g pm2
$ pm2 start index --name sktrythm
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
  - View Audiot Log
  - Connect
  - Speak
  - Send Messages *任意
  
![image](https://user-images.githubusercontent.com/20591351/85919186-1a15b900-b8a4-11ea-9912-d309c18672c6.png)

### 4.tokenはBot設定ページの Click to Reveal Token をクリックして表示される物を使用する

![image](https://user-images.githubusercontent.com/20591351/85919131-880db080-b8a3-11ea-8a26-79aa1eaf35ad.png)


## learning

- キュー管理
https://github.com/DS-Development/delet/blob/43edee301d51b3e1471cc59d279802ad9cad9d48/music/js/music.js#L195
