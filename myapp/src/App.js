import React, {useState} from 'react';
import './App.css';

function Header() {
  return (
    <header>
      <h1>TEST</h1>
    </header>
  );
}

function Main() {
  return (
    <p>
      test -- normal text
    </p>
  )
}

function App() {

  fetch('getdata').then(
    function(response) {
      console.log(response)
      console.log(response.type)
    }
  )

  return (
    <div className="App">
      <Header></Header>
      <Main></Main>
    </div>
  );
}

export default App;
