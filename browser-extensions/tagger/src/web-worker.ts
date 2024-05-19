import browser from 'webextension-polyfill';
import { TagModel } from './app/models/tag';
import BrowserStorageRepository from './db/browser-storage-repository';

async function initializeDB() {
  const repository = new BrowserStorageRepository();
  await repository.initialize();
  new TagModel(repository);
}
initializeDB().then(() => {
  browser.runtime.onInstalled.addListener(async () => {
    browser.contextMenus.create({
      id: 'tagger-add-tag',
      title: 'Add tag',
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
});

class CreateTag {
  text: string;
  color: string;
  constructor(text: string, color: string) {
    this.text = text;
    this.color = color;
  }

  async run() {
    const tag = new TagModel();
    const id = await tag.add({ text: this.text, color: this.color });

    console.log('Tag added');
  }
}
