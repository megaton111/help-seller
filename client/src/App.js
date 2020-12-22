import React from 'react';
import './App.css';
import Section from './component/Section' ; 
import Unipass from './component/Unipass' ; 
import Tracking from './component/Tracking' ; 
import Head from './component/Head' ; 

function App(){
  return (
    <div className="App">
      <Head />

      <Section name="개인통관고유부호 확인">
        <Unipass />
      </Section>

      <Section name="택배 운송장 조회">
        <Tracking />
      </Section>

    </div>
  )
}

export default App;