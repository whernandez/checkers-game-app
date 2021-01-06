import React, { useEffect, useState } from "react";
// App Components
import { Components, Context, getBoardData } from "core";
import { Checkers } from "./modules/checkers";
import "./App.css";

const {
  Layout,
  Labels: { Title },
} = Components;

function App() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    setBoard(getBoardData());
  }, []);

  return (
    <Context.CheckersProvider>
      <div className="App">
        <header className="App-header">
          <Title title={"Checkers Board"} size={"h3"} />
          <Layout.AppContainer>
            <Checkers refreshBoard={setBoard} />
          </Layout.AppContainer>
        </header>
      </div>
    </Context.CheckersProvider>
  );
}

export default App;
