import "./App.css";
import { Client } from "./Puck.js";

const pageData = {
  content: [
    {
      type: "HeadingBlock",
      props: {
        title: "Edit this page by adding /edit to the end of the URL",
        id: "HeadingBlock-1694032984497",
      },
    },
  ],
  root: { props: { title: "" } },
};

function App() {
  return <Client data={pageData} />;
}

export default App;
