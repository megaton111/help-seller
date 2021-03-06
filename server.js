const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const puppeteer = require( 'puppeteer' ) ;
const cheerio = require( 'cheerio' ) ;

const app = express();
const port = process.env.PORT || 5000;

const https = require( 'https' ) ; 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkPass = async ( name, number ) => {
  const url = `https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm?crkyCn=o220p260j056x276q000c050u0&persEcm=${number}&pltxNm=${name}` ;
  const browser = await puppeteer.launch({ 'args' : [ '--no-sandbox' ] });
  const page = await browser.newPage();
  let pageOption = {
      waitUntil: 'networkidle2',
      timeout : 20000
    } ;

  let response = await page.goto( url, pageOption ) ;
  let html = await response.text() ;
  const $ = cheerio.load( html ) ;
  const result = $('tCnt').text() ;
  await browser.close();
  return result ; 
} ; 

app.post( '/api/unipass', async ( req, res ) => {
  let { name, number } = req.body ; 
  const result = await checkPass( name, number ) ; 
  /* result가 1을 받으면 일치 아니면 불일치 */
  const text = result == '1' ? '일치' : '불일치' ; 
  res.send( text );
}) ;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));