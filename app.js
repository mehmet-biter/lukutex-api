const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

// Airdrop
const airdropRouter = require("./src/airdrop/router/airdrop");
const claimRouter = require("./src/airdrop/router/claim");
const blockListRouter = require("./src/airdrop/router/blockList");
const distributeRouter = require("./src/airdrop/router/distribute");

// ETH Withdraw
const ethWithdrawRouter = require("./src/eth-withdraw/router/withdraw");

// IEO
const ieoRouter = require("./src/ieo/router/ieo");

// Homepage Event
const eventsRouter = require("./src/events/router/events");

// Trading Competition
const competitionsRouter = require("./src/trading-competition/router/competitions");
const ranksRouter = require("./src/trading-competition/router/ranks");

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());

//To allow cross-origin requests
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Airdrop
app.use("/airdrop", airdropRouter);
app.use("/claim", claimRouter);
app.use("/block", blockListRouter);
app.use("/distribute", distributeRouter);

// ETH Withdraw
app.use("/withdraw", ethWithdrawRouter);

// IEO
app.use("/ieo", ieoRouter);

// Homepage Events
app.use('/events', eventsRouter);

//Trading Competition
app.use('/competitions', competitionsRouter);
app.use('/ranks', ranksRouter);

app.listen(PORT);