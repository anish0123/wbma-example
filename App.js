import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <Navigator />
      <StatusBar style="auto" backgroundColor="#8D918D" translucent={true} />
    </>
  );
};

export default App;
