# Personal Archive - GitHub Pages 版

這是一個純 HTML / CSS / JavaScript 的個人網站雛形，可以直接部署到 GitHub Pages。

## 最重要的檔案

- `index.html`：網站骨架
- `assets/css/style.css`：版面與配色
- `assets/js/data.js`：文章、對話、角色時間線等資料
- `assets/js/site.js`：切頁、淡入、聊天、文章、相簿等功能
- `assets/images/`：之後放你的圖片與 GIF

## 新增文章

打開 `assets/js/data.js`，在 `posts` 裡新增一組資料：

```js
{
  id: 'my-post',
  title: '文章標題',
  date: '2026-10-01T20:00:00+08:00',
  summary: '文章列表上顯示的簡介',
  tag: 'DIARY',
  content: '<p>完整文章內容。</p>',
  image: '',
  password: ''
}
```

若 `date` 設為未來時間，頁面會等到訪客裝置時間到達該時間後才顯示，適合做簡單的預約發文。

## 密碼內容注意

若 `password` 填入文字，會顯示前端密碼框。但 GitHub Pages 是靜態網站，密碼和內容都仍存在原始檔中，因此不能用來保護真正敏感或不能外流的內容。

## 本機預覽

最簡單可以直接雙擊 `index.html`。如果瀏覽器限制本機檔案，也可以用 VS Code 的 Live Server。
