// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';
import { tagsReducer } from './tags-reducer.OLD';
import { HighlightTags } from '../tagger';
import { tagModel } from './models';
import MainPage from './pages/main-page';
import StylesPage from './pages/styles-page';
import { StylesProvider, TagsProvider } from './providers';

export function App() {
  const [tags, dispatch] = useReducer(tagsReducer, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    tagModel.get()?.then((tags) => {
      dispatch({ type: 'loaded', payload: { data: tags || [] } });
    });
  }, []);

  useEffect(() => {
    try {
      HighlightTags(tags.data);
    } catch (e) {
      // console.error(e);
    }
  }, [tags]);

  return (
    <TagsProvider>
      <StylesProvider>
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
      </StylesProvider>
    </TagsProvider>
  );
}

export default App;
