# Personal Archive - GitHub Pages v5

這版參考日系／韓系個人部落格的低飽和、留白、小字排版節奏重新調整，並移除 MENU 項目之間的線條。

## USER 頭貼
目前使用：`assets/images/user-icon.png`

要自己更換時，只要把新的圖片放到 `assets/images/`，並命名成 `user-icon.png` 覆蓋原檔即可。
建議使用正方形圖片；網站會自動以 62×62 px 顯示並裁切。

如果想保留不同檔名，修改 `index.html` 內：

```html
<img src="assets/images/user-icon.png" alt="USER 頭貼">
```

把 `user-icon.png` 改成你的檔名即可。

## 更新 GitHub Pages
將本資料夾中的 `index.html`、`assets/`、`.nojekyll` 等內容直接上傳到 repository 根目錄並 Commit。
