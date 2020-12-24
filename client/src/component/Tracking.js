// import { response } from 'express';
import Axios from 'axios';
import React, { useState, useEffect, useReducer } from 'react';
import styled, { css } from 'styled-components' ;
import Loader from 'react-loader-spinner';

/* styled-components로 스타일 관리 - 하나의 js파일 안에서 관리하기 위함 */
const FormBlock = styled.form`` ; 
const InputBlock = styled.div`
  display:flex ; 
` ;
const Input = styled.input`
  display: flex ; 
  flex : 1 ; 
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
  margin-right:5px ; 
` ;
const TrackInfoBlock = styled.div`
  margin-top: 10px ; 
` ; 
const TrackNotice = styled.div`` ; 
const TrackProcess = styled.div`` ; 
const SelectCompany = styled.select`
  display:flex ; 
  flex : 1; 
  padding:0 10px ; 
  height: 40px ; 
  line-height : 40px ; 
  border: 1px solid #333;
  margin-right:5px ; 
` ; 
const TrackListBlock = styled.div`` ;
const TrackListItem = styled.div`
  padding: 5px 0 ; 
  ${ props => props.delivered && css`
    border : 2px solid red ; 
  ` }
  font-size:12px ; 
  span {
    display:inline-flex ; 
    &:first-child { width:160px ; }
  }
` ;
// https://tracker.delivery/guide

const Reducer = ( state, action ) => {
  switch( action.type ) {
    case 'LOADING' : return { ...state, loading : true, data : 'Loading', trackData : [], error : null } ; 
    case 'SUCCESS' : return { ...state, loading : false , data : 'Success', trackData : action.trackData, error : null } ; 
    case 'CHECK' : return { ...state, loading : false , data : action.data, trackData : [], error : null } ; 
    case 'ERROR' : return { ...state, loading : false , data : 'Error!' , trackData : [], error : true } ; 
    default : return state ; 
  }
} ; // end of Reducer

const getTrack = async ( code , number ) => {
  const response = await Axios.get( `https://apis.tracker.delivery/carriers/${code}/tracks/${number}` ) ; 
  return response.data ; 
} ; // end of getTrack

const getCompany = async () => {
  const response = await Axios.get( 'https://apis.tracker.delivery/carriers' ) ; 
  return response.data ; 
} ; // end of getCompany

const Tracking = _ => {
  const 
  [ company, setCompany ]     = useState( '' ) , 
  [ code, setCode ]           = useState( 'kr.cjlogistics' ) , 
  [ number, setNumber ]       = useState( '' ) , 
  [ state, dispatch ] = useReducer( Reducer, {
    loading : false , 
    data : null , 
    error : null ,
    trackData : [] 
  }) ,
  myCompany = [ 'kr.cjlogistics', 'kr.epost' ] ,
  defaultCompany = myCompany[0] ,
  
  fetchTrack = async _ => {
    dispatch({ type : 'LOADING' }) ;

    switch( !0 ) {
      case code === '' : 
        dispatch({ type : 'CHECK' , data : '택배사를 선택하세요'}) ;
        break ; 
      case number === '' : 
        dispatch({ type : 'CHECK', data : '운송장 번호를 입력하세요'}) ;
        break ; 
      default : 
        try {
          const { progresses } = await getTrack( code, number ) ; 
          console.log({ progresses }) ; 
          // const progresses = data.progresses ;
          // console.log({ progresses }) ;
          dispatch({ type : 'SUCCESS' , trackData : progresses }) ;

          console.log({ trackData }) ; 
        } catch ( e ) {
          dispatch({ type : 'ERROR' , error : e }) ;
        }
    }
  } ,

  makeSelectCompany = _ => {
    return (
      <SelectCompany 
        onChange={ e => setCode( e.target.value ) } 
        defaultValue={ defaultCompany }
      >
        {
          company.map(( item, idx ) => <option value={item.id} key={idx}>{item.name}</option> )
        }
      </SelectCompany>
    )
  } ,
  
  makeTrackList = _=> {
    const { trackData } = state ; 
    return (
      <TrackListBlock>
        {
          trackData.map(( item, idx ) => {
            let 
            { time , status , location , description } = item , 
            { name } = location ,                               
            { text , id } = status , 
            today = new Date( time ) , 
            getTime = today.toLocaleDateString( 'ko-KR', { year : 'numeric', month : 'long' , day : 'numeric', hour : 'numeric', minute : 'numeric' } ) , 
            // getTime = `${t.getFullYear()}년 ${(t.getMonth()+1)}월 ${t.getDate()}일 ${t.getHours()}시 ${t.getMinutes()}분` , 
            cName = id === 'delivered' ? true : false ; 

            return (
              <TrackListItem key={ idx } delivered={ cName }>
                <span>{ getTime }</span>
                <span>{ name }</span>
                <span>{ text }</span>
                <span>{ description }</span>
              </TrackListItem>
            )
          })
        }
      </TrackListBlock>
    )
  } , 

  onSubmit = e => {
    e.preventDefault() ; 
    fetchTrack() ; 
  }
  ; 

  useEffect( () => {

    ( async () => {
      const cp = await getCompany() ; 
      const newCp = cp.filter( item => myCompany.includes( item.id ) ) ; 
      setCompany( newCp ) ; 
    })() ; 

  }, []) ;

  const { loading, data : check, trackData , error } = state ; 

  return (
    <FormBlock onSubmit={ onSubmit }>
      <InputBlock>
        { company.length > 0 ? makeSelectCompany() : '' }

        <Input
          onChange={ e => setNumber( e.target.value ) } 
          value={ number }
          placeholder="운송장번호를 입력하세요"
        />

        <Button>확인</Button>
      </InputBlock>
      <TrackInfoBlock>
        {
          loading ? 
          <Loader type="ThreeDots" color="#333" height="20" width="40" /> :
          <TrackNotice>{ check }</TrackNotice>
        }
        <TrackProcess>
          { trackData.length > 0 ? makeTrackList() : '' }
        </TrackProcess>
      </TrackInfoBlock>
    </FormBlock>
  )
}

export default Tracking;