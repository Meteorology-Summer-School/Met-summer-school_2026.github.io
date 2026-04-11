# 気象夏の学校 2026 サイト

GitHub Pages の静的配信だけで動くサイトです。  
Jekyll、Gemfile、外部ライブラリ、ビルド手順は使っていません。  
このリポジトリをそのまま GitHub Pages に公開できます。

## 構成

- `index.html` と `*.html`
  各ページ本体です。通常は編集しません。
- `content/*.md`
  各ページの本文です。見出しや説明文はここを編集します。
- `data/*.csv`
  表、カード、お知らせ、FAQ、リンク、フッターなどの表示データです。
- `assets/js/site.js`
  Markdown と CSV の読み込み、表示ルールを管理しています。
- `assets/css/style.css`
  配色、余白、文字サイズ、表やカードの見た目を管理しています。
- `assets/images/`
  ロゴ、人物画像、ポスター、トップ画像などを置く場所です。
- `.nojekyll`
  GitHub Pages で Jekyll を使わず、そのまま静的配信させるためのファイルです。

## 基本ルール

- 通常の更新は `content/` と `data/` だけで行えます。
- `content/*.md` の `::updates::` や `::overview::` のような行は、CSV を差し込むための固定記号です。削除しないでください。
- 表示が崩れやすいページは Markdown 表ではなく CSV から描画するようにしてあります。
- 外部リンクは `https://` から始まる URL を使うと新しいタブで開きます。

## 各ページの編集方法

### ホーム `index.html`

- 本文: `content/home.md`
- お知らせ: `data/updates.csv`
- 開催概要カード: `data/overview.csv`
- ホーム上部の背景画像とヒーロー文言: `data/home_hero.csv`
- ホーム下部の案内リンクとポスター欄: `data/home_promo.csv`, `data/home_social_links.csv`

### 開催概要 `overview.html`

- 本文: `content/overview.md`
- 概要表: `data/overview.csv`

### スケジュール `schedule.html`

- 本文: `content/schedule.md`
- 表データ: `data/schedule.csv`

現状は本文を `準備中` のみ表示する形にしています。表を再開する場合は `content/schedule.md` に `::schedule::` を戻し、`data/schedule.csv` に行を追加してください。

### 会場・アクセス `access.html`

- 本文: `content/access.md`
- 会場情報の表: `data/access_venue.csv`
- 宿泊情報の表: `data/access_lodging.csv`
- Google Maps 埋め込み: `data/access_map.csv`

### 招待講演 `invited.html`

- 本文: `content/invited.md`
- 講演者一覧: `data/invited_talks.csv`

### 一般講演 `general.html`

- 本文: `content/general.md`
- 募集案内の表: `data/general_presentations.csv`

### 参加者一覧 `participants.html`

- 本文: `content/participants.md`
- 参加者・実行委員会一覧: `data/participants.csv`

### 参加申し込み `registration.html`

- 本文: `content/registration.md`
- 現在の案内の表: `data/registration_info.csv`

### 協賛 `sponsors.html`

- 本文: `content/sponsors.md`
- 協賛カード: `data/sponsors.csv`

### FAQ `faq.html`

- 本文: `content/faq.md`
- FAQ 本体: `data/faq.csv`

### リンク `links.html`

- 本文: `content/links.md`
- 外部リンク集: `data/links.csv`

### お問い合わせ `contact.html`

- 本文: `content/contact.md`
- 連絡先の表: `data/contact_info.csv`

## サイト全体の編集場所

- ヘッダー左上のロゴ画像: `data/site_brand.csv`
- 上部バナー: `data/site_banner.csv`
- フッター文言: `data/site_footer.csv`
- ナビゲーションやページ名: `data/page_labels.csv`
- 各ページのヒーロー画像: `data/page_hero_images.csv`

## よく使う編集例

### 1. 基本情報を更新する

開催日程、会場名、開催形式、対象などを変える場合は `data/overview.csv` を編集します。  
ホーム画面の開催概要カードと `開催概要` ページの両方に反映されます。

```csv
item,value,note,link,link_label
日程,2026年9月4日(金)～9月6日(日),合宿形式での開催を予定しています,,
会場,大子町研修センター,所在地や交通案内は会場・アクセスページをご確認ください,access.html,
```

### 2. FAQ を追加する

`data/faq.csv` に 1 行追加します。

```csv
question,answer
発表は必須ですか？,発表は任意です。
```

### 3. スケジュールを更新する

スケジュールを公開する場合は `content/schedule.md` を編集して `::schedule::` を使い、`data/schedule.csv` に各行を追加します。

```csv
day,time,program,details
1日目（9月4日・金）,13:00-14:00,受付,詳細は準備中
```

### 4. 協賛情報を追加する

`data/sponsors.csv` に協賛情報を追加し、必要に応じてロゴ画像を `assets/images/` に置きます。

```csv
category,title,subtitle,text,image,link,link_label
協賛,企業名,紹介文,掲載したい説明文,assets/images/sample-logo.png,https://example.com,企業サイト
```

## 注意

- ローカルで `file://` から直接開くと、ブラウザの制限で Markdown や CSV の読み込みに失敗することがあります。
- 確認するときは GitHub Pages 上で見るか、ローカルサーバー経由で開いてください。
- 見た目を変えたい場合だけ `assets/css/style.css` を編集してください。
- 表示ルールそのものを変えたい場合だけ `assets/js/site.js` を編集してください。

## GitHub Pages で公開する手順

1. このリポジトリを GitHub に push する
2. GitHub の `Settings` → `Pages` を開く
3. `Build and deployment` で `Deploy from a branch` を選ぶ
4. Branch を `main`、Folder を `/ (root)` にする
5. 数分待つと公開 URL が発行される
