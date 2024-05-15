import { taggerWorker } from './tagger-worker';

describe('taggerWorker', () => {
  it('should work', () => {
    expect(taggerWorker()).toEqual('tagger-worker');
  });
});
