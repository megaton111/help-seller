# help-seller
고객명과 개인통관고유부호가 일치하는 지 확인할 수 있는 기능, CJ대한통운, 우체국 택배의 배송조회를 할 수 있는 사이트입니다.  
리엑트를 사용하여 제작하였으며 Rest api, express를 사용했습니다.  
배포는 heroku를 사용하여 배포했습니다.

사이트 보기 : [help-seller](https://help-seller.herokuapp.com)

## 방법론 
### 개인통관고유부호 체크  
개인통관고유부호는 관세청에서 제공하는 API를 사용했다.  
해당 API에 이름과 번호를 넘기면 값이 일치한지 확인해서 결과값을 넘겨주는데 xml 데이터로 넘겨준다.  
xml데이터에서 해당하는 값만 가져오기위해 puppeteer를 사용해서 크롤링해서 값을 가져왔다.

## 설치하기
```shell
npm i 
```

## 로컬에서 띄우기
```shell
npm run client
```

## 빌드 및 배포
```shell
git push heroku master
```

## 리엑트 파일 구조
component  
  ㄴ Head.js  
  ㄴ Section.js  
  ㄴ Tracking.js  
  ㄴ Unipass.js  
App.js

## 서버 파일
server.js



