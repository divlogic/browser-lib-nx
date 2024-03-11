import { Model } from './lib/db';

declare const window: {
  testModel: TestModel;
  Model: Model;
};

class TestModel extends Model<{ id?: IDBValidKey; text: string }> {
  store = 'test_model';
}

window.Model = Model;

window.testModel = new TestModel();
