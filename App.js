import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <MainProvider>
      <Navigator />
      <StatusBar style="auto" backgroundColor="rgb(0,255,0)" />
    </MainProvider>
  );
};

export default App;
