let lastUrl = '';

const isPulls = (url: string) => new URL(url).pathname.endsWith('/pulls');

const runOrNoop = (url: string, tabId: number) => {
  if (isPulls(url)) {
    chrome.tabs.executeScript(tabId, { file: 'content.js' });
  }
};

// Github内でSSR後で戻る・進むボタン以外のページ遷移を行うと以下のようになる:
//   1. リンクなどをクリック
//   2. ページ遷移開始（この時点ではDOMは書き換わっていない。historyがアップデートされ `url !== lastUrl` となる）
//   3. ページ遷移完了（historyのアップデートが走るが、この時点では `url === lastUrl` となる）
const isStartingPageChange = (url: string) => url !== lastUrl;

// closedなPR一覧へ遷移しようとすると、/issues?q=is:pr is:closedから/pulls?q=is:pr is:closedへリダイレクトされる
const isIssuesPr = (url: string) => {
  if (url === '') {
    // new URLでエラーが送出されるため、無条件でfalse
    return false;
  }
  const u = new URL(url);
  if (!u.pathname.endsWith('/issues')) {
    return false;
  }
  let found = false;
  u.searchParams.forEach((v) => {
    if (v.includes('is:pr')) {
      found = true;
    }
  });
  return found;
};

chrome.webNavigation.onHistoryStateUpdated.addListener(({ url, tabId, transitionQualifiers }) => {
  if (transitionQualifiers.includes('forward_back')) {
    // 戻る・進むボタンでページ遷移を行った場合
    // historyアップデートは1回しか走らないため、ここで実処理を実行
    runOrNoop(url, tabId);
    return;
  }

  if (isPulls(url) && isIssuesPr(lastUrl)) {
    // closedなPR一覧へ遷移しようとする時に発生
    runOrNoop(url, tabId);
    return;
  }

  if (isStartingPageChange(url)) {
    // リンク押下等によるページ遷移を行った場合
    // 1回目のhistoryアップデートでしかURLの変更を検知できないため、ここでlastUrlを更新する
    lastUrl = url;

    // 実処理の実行は2回目のhistoryアップデート時に行う
    return;
  }

  runOrNoop(url, tabId);
});
