import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import Home from './views/Home';

const App = () => {
  return (
    <>
      <Navigator />
      <StatusBar style="auto" />
    </>
  );
};

export default App;
