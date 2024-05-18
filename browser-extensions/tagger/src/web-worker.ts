import browser from 'webextension-polyfill';
browser.storage.local.get('tags').then((tags) => {
  console.log('Does this have storage?');
  console.log(tags);
});
browser.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled');
  browser.contextMenus.create({
    id: 'testId',
    title: 'this is title',
    type: 'normal',
    contexts: ['selection'],
  });
  browser.contextMenus.onClicked.addListener(async (info) => {
    if (typeof info.selectionText === 'string') {
      const task = new CreateTag(info.selectionText, 'yellow');
      await task.run();
    }
  });
});

class CreateTag {
  text: string;
  color: string;
  constructor(text: string, color: string) {
    this.text = text;
    this.color = color;
  }

  run() {
    console.log('Ran CreateTag');
  }
}
