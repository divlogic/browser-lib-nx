// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import MainPage from './pages/main-page';
import StylesPage from './pages/styles-page';
import { StylesProvider, TagsProvider } from './providers';

export function App() {
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
              <MainPage />
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
