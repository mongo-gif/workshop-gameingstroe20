const google = require('googlethis');

async function test() {
    const res = await google.image('Razer DeathAdder V3 amazon', { safe: false });
    console.log(JSON.stringify(res.slice(0, 3), null, 2));
}

test();
