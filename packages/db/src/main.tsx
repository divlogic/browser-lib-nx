import { Model } from './lib/db';

declare const window: {
  testModel: TestModel;
};

class TestModel extends Model<{ text: string }> {
  store = 'test_model';
}

window.testModel = new TestModel();
