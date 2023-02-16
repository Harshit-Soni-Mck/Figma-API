import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { TextField } from "@mui/material";
import axios from "axios";
import { fetchTargetAsReflect } from "@design-sdk/figma-remote/.";
const figmaToken = "figd_g0YPGxZWFjzIwpTnTJZ76pYcNe7wu2xb_rN4faKe";

// use the component in your app!

function App() {
  const [url, setUrl] = useState("");
  const [figmaData, setData] = useState({});
  const [figmaObject, setFigmaObject] = useState({
    fileKey: "",
    nodeKey: "",
  });
  const getTreeData = () => {
    console.log(figmaObject.fileKey);

    axios
      .get(`https://api.figma.com/v1/files/${figmaObject.fileKey}`, {
        headers: { "X-Figma-Token": figmaToken },
      })
      .then((res: any) => {
        console.log("figma response", res);
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const parseFigma = () => {
    const default_config = {
      with_components: true,
    };
    const args = {
      file: figmaObject.fileKey,
      node: figmaObject.nodeKey,
      auth: {
        personalAccessToken: figmaToken,
      },
      config: default_config,
    };
    const response = fetchTargetAsReflect({ ...args }).then((res) => {
      console.log(res);

      console.log(response);
    });
  };
  const parseUrl = (url: string) => {
    setUrl(url);
    if (url.includes("https://www.figma.com/file/")) {
      setFigmaObject({
        ...figmaObject,
        fileKey: url.split("/")[4],
      });
    } else {
      window.alert(
        `figma file url must contain "https://www.figma.com/file/". the givven was ${url}, which we cannot extract file id from it.`
      );
    }
  };
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          alignItems: "center",
        }}
      >
        <TextField
          style={{ margin: "2em 0" }}
          value={url}
          onChange={(e) => parseUrl(e.target.value)}
          id="filled-basic"
          label="Figma Url"
          variant="outlined"
        />
        <button style={{ margin: "2em 0" }} onClick={() => getTreeData()}>
          fetchData
        </button>
      </div>
      <div style={{ display: "flex", width: "60%", alignItems: "center", justifyContent: "space-evenly" }}>
        <TextField
          style={{ margin: "2em 0" }}
          value={figmaObject.fileKey}
          onChange={(e) =>
            setFigmaObject({
              ...figmaObject,
              fileKey: e.target.value,
            })
          }
          id="filled-basic"
          label="figma file key"
          variant="outlined"
        />
        <TextField
          style={{ margin: "2em 0" }}
          value={figmaObject.nodeKey}
          onChange={(e) =>
            setFigmaObject({
              ...figmaObject,
              nodeKey: e.target.value,
            })
          }
          id="filled-basic"
          label="figma node key"
          variant="outlined"
        />
        <button style={{ margin: "2em 0" }} onClick={() => parseFigma()}>
          parseFigma
        </button>
      </div>
      <div className="uidl"></div>
    </div>
  );
}

export default App;
