import { Engine } from './lib/engine';
import { Model } from './lib/db';

declare const window: {
  testModel: TestModel;
  Model: Model<unknown>;
  Engine: Engine<unknown>;
};

class TestModel extends Model<{ id?: IDBValidKey; text: string }> {
  store = 'test_model';
}

window.Model = Model;

window.testModel = new TestModel();
window.Engine = Engine;
