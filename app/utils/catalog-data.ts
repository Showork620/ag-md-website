import CAButton from '~/components/CAButton.vue'
import CACard from '~/components/CACard.vue'
import CATag from '~/components/CATag.vue'
import CAInput from '~/components/CAInput.vue'
import CMThemeSwitcher from '~/components/CMThemeSwitcher.vue'
import CMAuthButton from '~/components/CMAuthButton.vue'
import CMPostCard from '~/components/CMPostCard.vue'
import CMPostListItem from '~/components/CMPostListItem.vue'
import CAIcon from '~/components/CAIcon.vue'
import CAIconLabel from '~/components/CAIconLabel.vue'
import CAIconButton from '~/components/CAIconButton.vue'
import COSideMenu from '~/components/COSideMenu.vue'

import { DUMMY_POST_CARD, DUMMY_POST_LIST } from '~/utils/catalog-dummy-data'
import { ICON_NAMES } from '~/utils/icons'

export const catalogData = [
  {
    name: 'CAButton',
    category: 'Atom',
    component: CAButton,
    description: '複数のバリエーションを持つ主要なインタラクション要素です。',
    previewInCatalog: true,
    props: {
      variant: {
        type: 'select',
        options: ['primary', 'accent', 'outline', 'plain'],
        default: 'primary',
        description: 'ボタンのスタイルバリエーション'
      },
      disabled: {
        type: 'boolean',
        default: false,
        description: '無効化状態'
      },
      default: {
        type: 'text',
        default: 'Button Text',
        description: 'ボタンのラベル（スロットコンテンツ）'
      }
    },
    gallery: {
      type: 'variants',
      prop: 'variant',
      items: ['primary', 'accent', 'outline', 'plain']
    }
  },
  {
    name: 'CACard',
    category: 'Atom',
    component: CACard,
    description: '関連するコンテンツをグループ化するためのコンテナです。',
    previewInCatalog: true,
    props: {
      hoverable: {
        type: 'boolean',
        default: false,
        description: 'ホバー時の浮き上がり効果を有効にする'
      },
      default: {
        type: 'text',
        default: '<h3>Card Title</h3><p>Card content goes here.</p>',
        description: 'カードのコンテンツ（スロット）'
      }
    }
  },
  {
    name: 'CATag',
    category: 'Atom',
    component: CATag,
    description: '分類やステータスを表すためのラベルです。',
    previewInCatalog: true,
    props: {
      color: {
        type: 'select',
        options: ['green', 'orange', 'neutral'],
        default: 'neutral',
        description: 'タグのカラーテーマ'
      },
      default: {
        type: 'text',
        default: 'Tag Label',
        description: 'タグのテキスト（スロット）'
      }
    },
    gallery: {
      type: 'variants',
      prop: 'color',
      items: ['green', 'orange', 'neutral']
    }
  },
  {
    name: 'CAInput',
    category: 'Atom',
    component: CAInput,
    description: 'テキストや複数行テキストのための入力フィールドです。',
    previewInCatalog: true,
    props: {
      modelValue: {
        type: 'text',
        default: '',
        description: '入力値 (v-model)'
      },
      placeholder: {
        type: 'text',
        default: 'Enter text...',
        description: 'プレースホルダーテキスト'
      },
      type: {
        type: 'select',
        options: ['text', 'textarea'],
        default: 'text',
        description: '入力タイプ'
      },
      disabled: {
        type: 'boolean',
        default: false,
        description: '入力を無効化する'
      }
    }
  },
  {
    name: 'CMThemeSwitcher',
    category: 'Molecule',
    component: CMThemeSwitcher,
    description: 'ライトモードとダークモードを切り替えるスイッチです。',
    previewInCatalog: true,
    props: {}
  },
  {
    name: 'CMAuthButton',
    category: 'Molecule',
    component: CMAuthButton,
    description: 'Google OAuth認証のログイン/ログアウトボタンです。ユーザーアバターとユーザー名を表示します。',
    previewInCatalog: true,
    props: {},
    notes: '※認証状態に応じて表示が変わります。未ログイン時はログインボタン、ログイン時はユーザー情報とログアウトボタンを表示します。'
  },
  {
    name: 'CMPostCard',
    category: 'Molecule',
    component: CMPostCard,
    description: 'グリッド表示で記事の概要を表示するためのカードコンポーネントです。',
    previewInCatalog: true,
    props: {
      post: {
        type: 'json',
        default: DUMMY_POST_CARD,
        description: '記事データオブジェクト'
      }
    }
  },
  {
    name: 'CMPostListItem',
    category: 'Molecule',
    component: CMPostListItem,
    description: 'リスト表示で記事の概要を表示するためのリストアイテムコンポーネントです。',
    previewInCatalog: true,
    props: {
      post: {
        type: 'json',
        default: DUMMY_POST_LIST,
        description: '記事データオブジェクト'
      }
    }
  },
  {
    name: 'CAIcon',
    category: 'Atom',
    component: CAIcon,
    description: 'SVGアイコンを表示するコンポーネントです。',
    previewInCatalog: true,
    props: {
      name: {
        type: 'select',
        options: ICON_NAMES,
        default: 'home',
        description: 'アイコン名'
      },
      size: {
        type: 'text',
        default: '24px',
        description: 'アイコンサイズ (px, em, etc.)'
      }
    },
    gallery: {
      type: 'icons',
      prop: 'name',
      items: ICON_NAMES
    }
  },
  {
    name: 'CAIconLabel',
    category: 'Molecule',
    component: CAIconLabel,
    description: 'アイコンとテキストラベルを組み合わせたコンポーネントです。',
    previewInCatalog: true,
    props: {
      icon: {
        type: 'select',
        options: ICON_NAMES,
        default: 'home',
        description: 'アイコン名'
      },
      label: {
        type: 'text',
        default: 'Label Text',
        description: 'ラベルテキスト'
      },
      iconPosition: {
        type: 'select',
        options: ['left', 'right'],
        default: 'left',
        description: 'アイコンの位置'
      },
      size: {
        type: 'text',
        default: '',
        description: 'サイズ (inherit by default)'
      }
    }
  },
  {
    name: 'CAIconButton',
    category: 'Atom',
    component: CAIconButton,
    description: 'アイコンのみのボタンコンポーネントです。お気に入りや削除などのアクションボタンに使用します。',
    previewInCatalog: true,
    props: {
      icon: {
        type: 'select',
        options: ICON_NAMES,
        default: 'heart',
        description: 'アイコン名'
      },
      variant: {
        type: 'select',
        options: ['primary', 'danger', 'ghost'],
        default: 'ghost',
        description: 'ボタンのスタイルバリエーション'
      },
      size: {
        type: 'select',
        options: ['small', 'medium', 'large'],
        default: 'medium',
        description: 'ボタンのサイズ'
      },
      title: {
        type: 'text',
        default: 'Icon Button',
        description: 'ツールチップテキスト'
      }
    },
    gallery: {
      type: 'variants',
      prop: 'variant',
      items: ['primary', 'danger', 'ghost']
    }
  },
  {
    name: 'COSideMenu',
    category: 'Organism',
    component: COSideMenu,
    description: '折りたたみ可能なサイドナビゲーションメニューです。',
    previewInCatalog: false,
    props: {}
  }
]
