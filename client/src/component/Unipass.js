import Axios from 'axios';
import React, { useReducer, useState } from 'react';
import Loader from 'react-loader-spinner';
import styled, { css } from 'styled-components' ;

/* styled-components로 스타일 관리 - 하나의 js파일 안에서 관리하기 위함 */
const FormBlock = styled.form`` ; 
const InputBlock = styled.div`
  display:flex ; 
` ;
const Input = styled.input`
  display:flex ; 
  flex : 1; 
  min-width:240px ; 
  padding: 0 10px ; 
  height: 40px ; 
  line-height : 40px ; 
  background-color : #fff ; 
  border: 1px solid #333; 
  margin-right:5px ; 
` ; 
const Button = styled.button`
  display:flex ; 
  width:100px ; 
  height:40px ; 
  background-color:#1287A5 ; 
  border: 0 ; 
  color:#fff ; 
  font-weight:700 ; 
  cursor:pointer ; 
  align-items:center ; 
  justify-content:center ; 
  border:1px solid #47535E; 
` ; 
const TextBlock = styled.div`
  display: flex ; 
  min-height:60px ; 
  margin-top: 10px ; 
  justify-content:center ; 
  align-items:center ; 
` ; 
const TextResult = styled.div`
  font-weight: 700 ; 
  font-size: 16px ; 
  ${ props => props.result == '불일치' && css`
    color : red ; 
  `}
` ; 

const Reducer = ( state, action ) => {
  console.log( action.type , ' : ', { state, action }) ; 
  switch( action.type ) {
    case 'LOADING' : return { ...state, loading : true, data : 'Loading', error : null } ; 
    case 'SUCCESS' : return { ...state, loading : false , data : action.data, error : null } ; 
    case 'CHECK' : return { ...state, loading : false , data : action.data, error : null } ; 
    case 'ERROR' : return { ...state, loading : false , data : 'Error!' , error : true } ; 
    default : return state ; 
  }
} // end of Reducer

const getUnipass = async ( name, number ) => {
  const response = await Axios.post( '/api/unipass', {
    name : name ,
    number : number 
  }) ; 
  return response.data ; 
} // end of getUnipass

const Unipass = _ => {

  const 
  [ name, setName ] = useState( '' ) ,
  [ number, setNumber ] = useState( '' ) ,
  [ state, dispatch ] = useReducer( Reducer, {
    loading : false , 
    data : null , 
    error : null  
  }) ,
  
  onSubmit = e => {
    console.log({ name, number }) ;
    e.preventDefault() ; 
    fetchUnipass() ; 
  } , // end of onSubmit

  fetchUnipass = async _ => {

    dispatch({ type : 'LOADING' }) ; 

    switch( !0 ) {
      case name == '' : 
        dispatch({ type : 'CHECK', data : '이름을 입력하세요 '}) ; 
        break ;
      case number == '' :
        dispatch({ type : 'CHECK', data : '개인통관고유부호를 입력하세요 '}) ; 
        break ;
      default : 
        try {
          const data = await getUnipass( name, number ) ;
          dispatch({ type : 'SUCCESS' , data : data }) ;
        } catch ( e ) {
          dispatch({ type : 'ERROR' , error : e }) ;
        }
    }
  } // end of fetchUnipass
  ;

  const { loading, data : check , error } = state ; 
  
  return (
    <FormBlock onSubmit={ onSubmit }>
      <InputBlock>
        <Input 
          placeholder="이름을 입력하세요"
          name="username"
          onChange={ e => setName( e.target.value ) }
          value={ name }
        />
        <Input 
          placeholder="개인통관고유부호를 입력하세요"
          name="usernumber" 
          onChange={ e => setNumber( e.target.value ) }
          value={ number }
        />
        <Button>확인</Button>
      </InputBlock>
      <TextBlock>
        {
          loading ? 
          <Loader type="ThreeDots" color="#333" height="20" width="40" /> :
          <TextResult result={ check }>{ check }</TextResult>
        }
      </TextBlock>
    </FormBlock>
  )
} // end of Unipass

export default Unipass;