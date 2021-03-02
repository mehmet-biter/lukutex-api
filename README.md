# LuKuTex API Document


## 1. License

Please note, that LuKuTex API license only allows Commercial use of this component. Please contact us at bussiness@lukutex.com.

## 2. Install dependencies

```bash
$ npm install
```
or

```bash
$ yarn install
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

> Request: `http://localhost:4000/airdrop/fetch`

> Response:
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


## Licensing

This code is open for helping private modification and performing customer demonstration, you can use it for raising capital.
You cannot use it for a live platform without getting a commercial license from us.

Contact us if you'd like to purchase a commercial license.

## Partners

If you would like to fork, we would be happy to setup a partnership program and sell your work provided a revenue sharing.

Made with love from LuKuTex.

