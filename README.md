# FoodieTAG#

## gitHub Pages:

網址: https://johnny891202.github.io/FoodieTAG/

範例:

- 如果想要看到 index.html 的畫面要在網址的部分加上 `pages/index.html`

## 套件

1. 自動化格式套件:
   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. bootstrap 版本 "^5.3.2"

## Git 協作:

1. git clone https://github.com/johnny891202/FoodieTAG.git 至自己的本機端
2. 各自 git branch 一個分支，名稱為自己名字
3. 每天習慣 git pull dev 分支上的內容至本機
4. 各自修改完後，各自 git push 到自己的分支
5. 最後將自己的分支合併到 dev 分支
6. 最後再將 dev 分支合併到 main 分支

- 注意: commit 內容統一使用[中文]，使用[動詞＋主詞](例：修改首頁分類標籤, 新增店家頁留言板功能)，要能清楚了解本次 commit 內容，建議處理完一種功能就 commit。

## 命名規則

名稱撰寫方式: 烤串 (order-list, text-white)

## 資料夾放置

1. assets # 靜態資源放置處

   - images # 圖片放置處
   - scss # SCSS 的樣式放置處
     - component #共用元件放置
     - pages #個人頁面樣式放置處
     - utilis #BS 的變數放置處

2. pages # html 頁面放置處
3. js # JavaScript 放置處 檔案可依照個人名稱新增
4. .gitignore 勿刪

- 注意：新增 scss 檔後記得@import 進 all/scss

## 全域變數修改

1. 顏色 - 已修改顏色變數 :
   主色：primary-100 ~ primary-400
   灰階：grey-100 ~ grey-500
2. 間距 - 每個 spacer 已改成 0.25rem (4px) ，數字等於幾個 spacer。
   目前新增至[21]，如要增加請自行新增，並更新本文件，如有負數請用 n(如：n1, n2)
   (例：如果向下距離 32px，可直接寫 mb-8)
3. 字級 - 已經依照設計稿調整
4. 字高 - $line-height-base: 1.2;
5. h1-h6 - 字重已改為 700

## 共用元件

1. import 路徑 - "./scss/component/元件頁面名稱";
2. 如有製作元件，請新增在本區塊...
