import {
  Button,
  Card,
  Heading,
  Image,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import logo from "./assets/react.svg";

import { Amplify } from "aws-amplify";
import { MouseEventHandler } from "react";
import config from "./aws-exports";
Amplify.configure(config);

function App({ signOut }: { signOut: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App) as () => JSX.Element;
