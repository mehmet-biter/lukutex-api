exports.getAward = async(req, res, next) => {
    const awards = [{
            award: 5,
            quantity: 100
        },
        {
            award: 10,
            quantity: 50
        },
        {
            award: 20,
            quantity: 15
        },
        {
            award: 40,
            quantity: 5
        }
    ];

    let randomedAward = [];
    for (const i in 4) {
        const randomNumber = Math.floor(Math.random() * 3 + 0);
        randomedAward.push(awards[randomNumber]);
    }

}