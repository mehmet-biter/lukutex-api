# LuKuTex API Document


## 1. License

Please note, that LuKuTex API license only allows Commercial use of this component. Please contact us at bussiness@lukutex.com.

## 2. Install dependencies

```bash
$ npm install
```

## 3. Run in developement mode

```bash
$ npm run dev
```
This command will also start an api backend on localhost for helping development.
Default local address: http://localhost:4000

## 4. Configuration documentation

Configuration file is located in  `configs/env.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `MYSQL_ENV_HOST`    | IP address of database server `(ex: 192.168.0.1)` |
| `MYSQL_ENV_USER`                | Username login into database `(ex: root)`  |
| `MYSQL_ENV_PASSWORD`     | Password login into database `(ex: 1234)`

## 5. Airdrop API Endpoint
### 5.1. Fetch Airdrops
| Method  | Endpoint   | Descriptition   |
| ------------ | ------------ | ------------ |
| GET |  /airdrop/fetch | Fetch all airdrop  | 
| GET  |  /airdrop/fetch/waiting/page=`{page}`&size=`{size}` | Upcoming airdrop  |
| GET |  /airdrop/fetch/opening/page=`{page}`&size=`{size}` | Ongoing airdrop  |
| GET  |  /airdrop/fetch/delivering/page=`{page}`&size=`{size}` | Airdrop is waiting for distributing  |
| GET |  /airdrop/fetch/delivered/page=`{page}`&size=`{size}` | Airdrop was distributed  |
| GET  |  /airdrop/fetch/`{id}` |     Fetch airdrop with airdrop id|

> Request GET: `http://localhost:4000/airdrop/fetch`

> Response Example:
```json
 {
      "msg": "Fetch successfully!",
      "payload": [
        {
          "airdrop_id": 1,
          "airdrop_name": "LuKuTex Exchange (~ 10 usd)",
          "total_tokens": 1000000,
          "tokens_per_claim": 100,
          "remain_tokens": 767200,
          "token_name": "LKT",
          "max_participants": 10000,
          "start_date": "2020-11-14T00:00:00.000Z",
          "end_date": "2020-12-15T08:00:00.000Z",
          "deliver_date": "2021-02-25T08:00:00.000Z"
        }
      ]
    }
```

### 5.2. Create New Airdrop
#### Method: POST
```json
{
	"airdrop_name": "",
	"total_tokens": 0,
	"tokens_per_claim": 0,
	"remain_tokens": 0,
	"token_name": "",
	"max_participants": 0,
	"start_date": "2021-01-01 00:00:00",
	"end_date": "2021-01-01 00:00:00",
	"deliver_date": "2021-01-01 00:00:00"
}
```

### 5.3 Fetch Claims
| Method  | Endpoint   | Descriptition   |
| ------------ | ------------ | ------------ |
| GET |  /claim//fetch/all/airdrop_id=`{airdrop_id}` | Fetch all claims  | 
| GET  |  /claim/getByAid/`{id}` |     Fetch claims by airdrop id|

### 5.4.  Claim Airdrop
#### Method: POST: /claim/airdrop_id=`airdrop_id`
* Request POST: http://localhost:4000/claim/airdrop_id=1

* Request Body Example:
```json
{
	"user_uid": "",
	"email_user": "",
	"facebook_id": "",
	"twitter_username": "",
	"telegram_username": "",
	"user_ip": ""
}
```

## 6. Withdraw With ETH Fee
### 6.1. Withdraw
#### Method: POST /withdraw
* Request POST: http://localhost:4000/withdraw

* Request Body Example:
```json
{
	"uid": "ID2021",
	"currency": "eth";
	"amount": "0.2";
}
```

### 6.2. Get ETH Fee
#### Method: GET /withdraw/get/eth_fee
* Request GET: http://localhost:4000/withdraw/get/eth_fee

* Response Example:
```json
{
  "msg": "Get ETH fee success",
  "payload": [
    {
      "currency_id": "cap",
      "gas_limit": 70000,
      "gas_price": 84,
      "fee": 0.01588
    },
    {
      "currency_id": "dfe",
      "gas_limit": 70000,
      "gas_price": 84,
      "fee": 0.01588
    },
  ]
}
```
## 7. Events
#### Method: GET /events/fetch
* Request GET: http://localhost:4000/events/fetch

* Response Example:
```json
{
	  "msg": "Fetch event list successfully",
	  "events": [
		{
		  "event_id": 12,
		  "event_name": "Whitex Listing",
		  "description": "Whitex Listing",
		  "image_link": "https://1.bp.blogspot.com/-PtrlDeReidA/YDXFVelN9EI/AAAAAAAAAR8/VU_FUtTrtW8-YsStxPAsroxKfAR8OClQACLcBGAsYHQ/s320/Whitex%2Blisting.png",
		  "ref_link": "https://t.me/lukutex_office/12824",
		  "created_at": "2021-02-24T05:22:08.000Z"
		},
		{
		  "event_id": 11,
		  "event_name": "NIA Trade Competition",
		  "description": "Event starts in  5th Febuary 2021 - 8:00 Singapore Time",
		  "image_link": "https://1.bp.blogspot.com/-jJMl-DvAvqw/YC5mpIJ1c7I/AAAAAAAAAQY/TS5wYhOXW1YmsmXDJ7W-wIe-8o84l6BZwCLcBGAsYHQ/s320/photo_2021-02-18_20-06-41.jpg",
		  "ref_link": "https://t.me/lukutex_office/12570",
		  "created_at": "2021-02-10T05:22:08.000Z"
		}
	]
}
```

## Licensing

This code is open for helping private modification and performing customer demonstration, you can use it for raising capital.
You cannot use it for a live platform without getting a commercial license from us.

Contact us if you'd like to purchase a commercial license.

## Partners

If you would like to fork, we would be happy to setup a partnership program and sell your work provided a revenue sharing.

Made with love from LuKuTex.
