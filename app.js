const express = require('express')
const fetch = require('node-fetch');
const { createEventQRCode } = require('cwa-event-qr-code')

const app = express();
const port = 3000;

app.get('/:citySlug/:rideIdentifier', (request, response) => {
    const citySlug = request.params.citySlug;
    const rideIdentifier = request.params.rideIdentifier;

    const url = 'https://criticalmass.in/api/' + citySlug + '/' + rideIdentifier;
    const settings = { method: 'Get' };

    fetch(url, settings)
        .then(res => res.json())
        .then(async (json) => {
            console.log(json);
            const title = json.title;
            const dateTime = json.date_time;
            const location = json.location;

            const eventQRCode = createEventQRCode({
                locationData: {
                    description: title,
                    address: location
                },
                vendorData: {
                    type: 1,
                    defaultCheckInLengthInMinutes: 180
                }
            });

            await eventQRCode.toPNG('qr.png');

            response.sendfile('./qr.png')
        });


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
