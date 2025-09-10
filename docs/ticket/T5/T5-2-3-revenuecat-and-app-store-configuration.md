# T5-2-3: RevenueCat と各アプリストアの設定

## 概要

RevenueCat の管理画面と、App Store Connect / Google Play Console でアプリ内課金アイテムの設定を行います。これはコーディング作業ではなく、各プラットフォームでの設定作業です。

## 目的

- アプリ内で購入可能なサブスクリプション商品を定義する。
- RevenueCat を介して各ストアの課金アイテムを管理できるようにする。

## 依存関係

- **依存タスク**: `T5-2-2`
- **担当領域**: ストア設定, プロダクト管理

## 設定手順

### 1. RevenueCat の設定

1.  RevenueCat にサインアップ/ログインし、新しいプロジェクトを作成します。
2.  アプリ (iOS/Android) をプロジェクトに追加し、指示に従って App Store Connect / Google Play Console との連携設定を行います。
3.  **Entitlement の作成**:
    - `premium` という名前の Entitlement を作成します。
4.  **Offerings と Packages の作成**:
    - `default` という名前の Offering を作成します。
    - `default` Offering 内に、`monthly`, `annual`, `trial` のような名前で Package を作成します。

### 2. App Store Connect (iOS) の設定

1.  `アプリ` > `App 内課金` > `サブスクリプション` に移動します。
2.  サブスクリプショングループを作成します。
3.  3 つのサブスクリプションアイテムを作成します（月額、年額、トライアル付き年額）。
    - それぞれに製品 ID (例: `com.yourapp.monthly`)、価格、期間を設定します。
    - トライアルプランには無料トライアル期間（3 日間）を設定します。

### 3. Google Play Console (Android) の設定

1.  `すべてのアプリ` > `（対象アプリ）` > `収益化` > `定期購入` に移動します。
2.  3 つの定期購入アイテムを作成します（月額、年額、トライアル付き年額）。
    - それぞれに商品 ID (例: `monthly_sub`)、価格、期間を設定します。
    - トライアルプランには無料トライアル期間（3 日間）を設定します。

### 4. RevenueCat との紐付け

- RevenueCat の `Products` に、各ストアで作成した製品 ID を登録します。
- 各 Product を、作成した `premium` Entitlement に紐付けます。
- 各 Product を、`default` Offering の対応する Package に紐付けます。

### 5. API キーの設定

- RevenueCat プロジェクトの API キー（Public API Key）を取得します。
- このキーを、アプリの環境変数 (e.g., `.env` ファイル) に保存します。

## 完了条件

- [ ] RevenueCat にプロジェクトとアプリが設定されている。
- [ ] App Store Connect に 3 つのサブスクリプションアイテムが設定されている。
- [ ] Google Play Console に 3 つの定期購入アイテムが設定されている。
- [ ] RevenueCat に Entitlement, Offering, Packages が設定され、各ストアのアイテムと紐付けられている。
- [ ] RevenueCat の API キーが取得できている。

## 次のタスク

- **T5-3-1**: 購入情報 Context の作成
