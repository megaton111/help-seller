import React, { Children, useState } from 'react';
import styled from 'styled-components' ; 

const SectionBlock = styled.section`
  width:700px ; 
  padding:10px ; 
  margin:10px ; 
  border:1px solid #333 ; 
  h1 {
    font-size: 16px ; 
  }
` ;

const Section = ({ children, name }) => {
  return (
    <SectionBlock>
      <h1>{ name }</h1>
      { children } 
    </SectionBlock>
  
  )
}

export default Section;