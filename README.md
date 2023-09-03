# 동더히로바 정보를 가져올 수 있는 api 입니다~

1. [태고 유저 관련 API](#태고-유저-관련-api)
2. [동더히로바 대회 관련 API](#동더히로바-대회-관련-api)
3. [History](#History)
4. [License](#License)

## 태고 유저 관련 API

### [POST] /donder/id
> 태고 유저가 존재하는지 확인합니다.

#### Body Param JSON
|Name|Type|Length|Remark|
|---|---|---|---|
|id|String|12|북 번호|

#### 반환 JSON 값
|Name|Type|Length|Remark|
|---|---|---|---|
|isUserExist|boolean|-|해당 유저가 존재하는지 확인한다.|

### [POST] /donder/info
> 태고 유저의 곡 기록을 불러옵니다.

#### Body Param JSON
|Name|Type|Length|Remark|
|---|---|---|---|
|id|String|12|북 번호|

#### 반환 JSON 값

- 전체
  
|Name|Type|Length|Remark|
|---|---|---|---|
|userInfo|object|-|유저의 정보를 가져옵니다.|
|songInfo|object|-|곡의 기록을 가져옵니다.|

### [POST] /donder/detail
> 태고 유저의 자세한 곡 기록을 불러옵니다.
> (위 API는 시간이 오래 걸릴 수 있습니다.)

#### Body Param JSON
|Name|Type|Length|Remark|
|---|---|---|---|
|id|String|12|북 번호|

#### 반환 JSON 값
|Name|Type|Length|Remark|
|---|---|---|---|
|userInfo|object|-|유저의 정보를 가져옵니다.|
|songInfo|object|-|곡의 기록을 가져옵니다.|

## 동더히로바 대회 관련 API

### [POST] /competition
> 대회 정보을 불러옵니다.

#### Body Param JSON
|Name|Type|Length|Remark|
|---|---|---|---|
|id|[]|-|대회 번호|

#### 반환 JSON 값
|Name|Type|Length|Remark|
|---|---|---|---|
|competitionInfo|[]|-|대회 정보를 가져옵니다.|

## History
- 2023/09/03 문서 작성

# License
Nest is [MIT licensed](LICENSE).
