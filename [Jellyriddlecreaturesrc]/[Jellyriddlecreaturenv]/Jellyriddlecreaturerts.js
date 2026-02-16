import { createStackNavigator } from '@react-navigation/stack';

// views
import Jellyriddlecreatureonbrd from '../[Jellyriddlecreaturescrns]/Jellyriddlecreatureonbrd';
import Jellyriddlecreaturehmscrn from '../[Jellyriddlecreaturescrns]/Jellyriddlecreaturehmscrn';
import Jellyriddlecreaturegm from '../[Jellyriddlecreaturescrns]/Jellyriddlecreaturegm';
import Jellyriddlecreaturefd from '../[Jellyriddlecreaturescrns]/Jellyriddlecreaturefd';
import Jellyriddlecreatureabt from '../[Jellyriddlecreaturescrns]/Jellyriddlecreatureabt';
import Jellyriddlecreaturesttngs from '../[Jellyriddlecreaturescrns]/Jellyriddlecreaturesttngs';

const Stack = createStackNavigator();

const Jellyriddlecreaturerts = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Jellyriddlecreatureonbrd"
        component={Jellyriddlecreatureonbrd}
      />
      <Stack.Screen
        name="Jellyriddlecreaturehmscrn"
        component={Jellyriddlecreaturehmscrn}
      />
      <Stack.Screen
        name="Jellyriddlecreaturegm"
        component={Jellyriddlecreaturegm}
      />
      <Stack.Screen
        name="Jellyriddlecreaturefd"
        component={Jellyriddlecreaturefd}
      />
      <Stack.Screen
        name="Jellyriddlecreatureabt"
        component={Jellyriddlecreatureabt}
      />
      <Stack.Screen
        name="Jellyriddlecreaturesttngs"
        component={Jellyriddlecreaturesttngs}
      />
    </Stack.Navigator>
  );
};

export default Jellyriddlecreaturerts;
