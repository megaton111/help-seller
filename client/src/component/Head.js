import React from 'react';
import styled from 'styled-components' ; 

const HeadBlock = styled.header`
  display: flex ; 
  width:100% ; 
  height:50px ; 
  background:#333 ; 
  padding:10px ; 
  font-size: 18px ; 
  font-weight:700 ; 
  color:#fff ; 
  margin-bottom: 20px ; 
  align-items: center ;
  h1 {
    line-height : 1 ; 
  }
  
` ;

const Head = _ => {
  return (
    <HeadBlock>
      <h1>HELP SELLER</h1>
    </HeadBlock>
  
  )
}

export default Head;