window.SITE_DATA = {
  openDate: '2026-09-14',
  posts: [
    {
      id: 'hello',
      title: '第一篇日記',
      date: '2026-09-14T20:00:00+08:00',
      summary: '這裡是 Posting 頁面的文章簡介示意。',
      tag: 'DIARY',
      content: '<p>這是單篇 POST 頁面的內容。</p><p>之後你只需要在 <code>assets/js/data.js</code> 裡新增文章資料即可。</p>',
      image: '',
      password: ''
    },
    {
      id: 'protected-sample',
      title: '密碼文章示意',
      date: '2026-09-20T20:00:00+08:00',
      summary: '尚未到公開時間時不會出現在列表；到時間後會自動顯示。',
      tag: 'PRIVATE',
      content: '<p>這裡是被密碼保護的示意內容。</p>',
      image: '',
      password: 'demo'
    }
  ],
  dialogues: [
    [
      {side:'left', avatar:'A', text:'今天也有更新嗎？'},
      {side:'right', avatar:'B', text:'有一點。只是整理了一些東西。'},
      {side:'left', avatar:'A', text:'那我晚點再來看。'}
    ],
    [
      {side:'right', avatar:'B', text:'你怎麼又點進這裡了？'},
      {side:'left', avatar:'A', text:'只是剛好路過。'},
      {side:'right', avatar:'B', text:'……是嗎。'}
    ],
    [
      {side:'left', avatar:'A', text:'這張照片是什麼時候拍的？'},
      {side:'right', avatar:'B', text:'秘密。'},
      {side:'left', avatar:'A', text:'太狡猾了。'}
    ]
  ],
  characterTimeline: {
    '2024': '2024：早期時間線設定示意。',
    '2025': '2025：中期時間線設定示意。',
    '2026': '2026：目前時間線的設定。'
  }
};
