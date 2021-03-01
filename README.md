# LuKuTex API Document


## License

Please note, that LuKuTex API license only allows Commercial use of this component. Please contact us at bussiness@lukutex.com.

## Install dependencies

```bash
$ npm install
```
or

```bash
$ yarn install
```

## Run in developement mode

```bash
$ npm run dev
```
This command will also start an api backend on localhost for helping development.
Default local address: http://localhost:4000

## Configuration documentation

Configuration file is located in  `configs/env.js`


| Argument                 | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `MYSQL_ENV_HOST`    | IP address of database server `(ex: 192.168.0.1)` |
| `MYSQL_ENV_USER`                | Username login into database `(ex: root)`  |
| `MYSQL_ENV_PASSWORD`     | Password login into database `(ex: 1234)`

## Airdrop API Endpoint
| Method  | Endpoint   | Descriptition   |
| ------------ | ------------ | ------------ |
| GET  |  /airdrop/fetch | Fetch all airdrop  | 
| GET  |  /airdrop/waiting/page={page}&size={size} |   |
| GET  |  /airdrop/fetch |   |
| GET  | /airdrop/fetch  |   |