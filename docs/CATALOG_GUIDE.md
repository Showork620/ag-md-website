# コンポーネントカタログ追加ガイド

新しいコンポーネントを作成した際に、カタログページ（`/catalog`）に追加する手順を説明します。

## 1. ファイルの場所

カタログのデータ定義は以下のファイルで管理されています。

`app/utils/catalog-data.ts`

## 2. 追加手順

### ステップ 1: コンポーネントのインポート

ファイルの先頭で、追加したいコンポーネントをインポートします。

```typescript
import MyNewComponent from '~/components/MyNewComponent.vue'
```

### ステップ 2: ダミーデータの定義（必要な場合）

`Object` や `Array` などの複雑なデータを `props` として受け取るコンポーネントの場合、カタログ表示用のダミーデータを定数として定義します。
**注意:** 定数は `catalogData` 配列の外側（`export const catalogData = [...]` の前）に定義してください。

```typescript
const DUMMY_USER_DATA = {
  id: 1,
  name: 'Sample User',
  role: 'Admin'
}
```

### ステップ 3: カタログデータへの登録

`catalogData` 配列の中に、新しいオブジェクトを追加します。

```typescript
  {
    name: 'MyNewComponent', // コンポーネント名
    category: 'Molecule',    // カテゴリ (Atom, Molecule, Organism)
    component: MyNewComponent, // インポートしたコンポーネント
    description: 'コンポーネントの簡潔な説明文を日本語で記述します。',
    previewInCatalog: true,  // カタログ一覧でプレビューを表示するかどうか
    props: {
      // Propsの定義（次項参照）
    }
  },
```

## 3. Propsの定義方法

`props` オブジェクト内に、各プロパティの設定を記述します。これにより、カタログ詳細ページでインタラクティブに値を変更できるようになります。

### テキスト (String)
```typescript
      label: {
        type: 'text',
        default: 'デフォルトテキスト',
        description: 'ラベルのテキスト'
      }
```

### 選択肢 (Select)
```typescript
      variant: {
        type: 'select',
        options: ['primary', 'secondary', 'danger'],
        default: 'primary',
        description: 'ボタンのスタイルバリエーション'
      }
```

### 真偽値 (Boolean)
```typescript
      disabled: {
        type: 'boolean',
        default: false,
        description: '無効化フラグ'
      }
```

### オブジェクト/JSON (Object/Array)
`type: 'json'` を指定すると、詳細ページでJSONエディタが有効になります。

```typescript
      user: {
        type: 'json',
        default: DUMMY_USER_DATA, // 定義したダミー定数を使用
        description: 'ユーザー情報オブジェクト'
      }
```

## 4. 注意事項

*   **開発環境限定**: カタログページは開発環境（`npm run dev`）でのみアクセス可能です。本番ビルドではトップページにリダイレクトされます。
*   **プレビューフラグ**: レイアウト崩れの原因になる大きなコンポーネント（サイドメニューなど）は、`previewInCatalog: false` に設定することを推奨します。
