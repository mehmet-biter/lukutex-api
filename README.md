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


## Happy trading with OpenDAX BaseApp UI

If you have designed something beautiful with it, we would love to see it!

And if you have any comments, feedback and suggestions - we are happy to hear from you here at GitHub or at https://openware.com

## Licensing

This code is open for helping private modification and performing customer demonstration, you can use it for raising capital.
You cannot use it for a live platform without getting a commercial license from us.

Contact us if you'd like to purchase a commercial license.

## Partners

If you would like to fork, and modify this UI to create a BaseApp theme, we would be happy to setup a partnership program and sell your work provided a revenue sharing.

Made with love from Paris and Kiev.
