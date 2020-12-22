// import { response } from 'express';
import Axios from 'axios';
import React, { useState, useEffect, useReducer } from 'react';
import styled, { css } from 'styled-components' ;
import Loader from 'react-loader-spinner';

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
` ;
// https://tracker.delivery/guide


const Reducer = ( state, action ) => {
  console.log( action.type , ' : ', { state, action }) ; 
  switch( action.type ) {
    case 'LOADING' : return { ...state, loading : true, data : 'Loading', error : null } ; 
    case 'SUCCESS' : return { ...state, loading : false , data : action.data, error : null } ; 
    case 'CHECK' : return { ...state, loading : false , data : action.data, error : null } ; 
    case 'ERROR' : return { ...state, loading : false , data : 'Error!' , error : true } ; 
    default : return state ; 
  }
} ;

const getTrack = async ( code , number ) => {
  const response = await Axios.get( `https://apis.tracker.delivery/carriers/${code}/tracks/${number}` ) ; 
  console.log( response ) ; 
  return response.data ; 
} ;

const Tracking = _ => {
  const 
  [ company, setCompany ]     = useState( '' ) , 
  [ code, setCode ]           = useState( 'kr.cjlogistics' ) , 
  [ number, setNumber ]       = useState( '' ) , 
  [ trackData, setTrackData ] = useState( '' ) ,  
  [ info , setInfo ]          = useState( '' ) , 

  [ state, dispatch ] = useReducer( Reducer, {
    loading : false , 
    data : null , 
    error : null  
  }) ,

  valueCheckHandler = _=> {
    setTrackData( [] ) ;
    setInfo( '조회중입니다...' ) ;

    if( code === '' ) {
      setInfo( '택배사를 선택하세요.' ) ;
    } else if( number === '' ) {
      setInfo( '운송장번호를 입력하세요.' ) ;
    } else {
      fetch( `https://apis.tracker.delivery/carriers/${code}/tracks/${number}` )
      .then( function( res ) {
        return res.json() ; 
      })
      .then( function(json) {
        if( !json.state ) {
          setInfo( json.message ) ; 
          setTrackData( [] ) ;
        } else {
          setTrackData( json.progresses ) ;
          setInfo( '' ) ; 
        }
      })
      .catch(error => console.error('Error:', error)) ; 
    }
  } , 
  
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
          const data = await getTrack( code, number ) ; 
          console.log({ data }) ; 
          dispatch({ type : 'SUCCESS' , data : data.progresses }) ;
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
    const { data } = state ; 
    console.log( '-----> ', data ) ;
    return (
      <TrackListBlock>
        {
          data.map(( item, idx ) => {
            let 
            { time , status , location , description } = item , 
            { name } = location ,                               
            { text , id } = status , 
            t = new Date( time ) , 
            getTime = `${t.getFullYear()}년 ${(t.getMonth()+1)}월 ${t.getDate()}일 ${t.getHours()}시 ${t.getMinutes()}분` , 
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
    console.log( 'submit in', number ) ;
    e.preventDefault() ; 
    // valueCheckHandler() ; 
    fetchTrack() ; 
  }
  ; 

  let myCompany = [ 'kr.cjlogistics', 'kr.epost' ]
  ,   defaultCompany = myCompany[0] 
  ; 

  useEffect(_=> {
    // const data =  getCompany() ; 
    fetch('https://apis.tracker.delivery/carriers')
    .then(function(response) {
      return response.json();
    })
    .then( myJson => {
      const companyData = myJson ;
      const newCompanyData = companyData.filter(( item ) => myCompany.includes( item.id ) ) ; 
      setCompany( newCompanyData ) ; 
    })
  }, [ myCompany ]) ;

  const { loading, data : check , error } = state ; 

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
          { Array.isArray( check ) ? makeTrackList() : '' }
        </TrackProcess>
      </TrackInfoBlock>
    </FormBlock>
  )
}

export default Tracking;