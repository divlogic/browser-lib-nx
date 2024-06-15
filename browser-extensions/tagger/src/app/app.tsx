// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';
import { tagsReducer } from './form-reducer';
import { tag } from './models/tag';
import { Tag } from '../tagger';
import MainPage from './pages/main-page';
import StylesPage from './pages/styles-page';

export function App() {
  const [tags, dispatch] = useReducer(tagsReducer, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    tag.get()?.then((tags) => {
      dispatch({ type: 'loaded', payload: { data: tags } });
    });
  }, []);

  useEffect(() => {
    try {
      Tag(tags.data);
    } catch (e) {
      // console.error(e);
    }
  }, [tags]);

  return (
    <Tabs orientation="vertical" variant="solid-rounded" width="100%">
      <TabList>
        <Tab>Tags</Tab>
        <Tab>Styles</Tab>
      </TabList>
      <TabPanels width={'100%'}>
        <TabPanel>
          <MainPage dispatch={dispatch} tags={tags} />
        </TabPanel>
        <TabPanel>
          <StylesPage />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default App;
