const {google} = require('googleapis');

let oauth2Client=null;
const setOAuth2Client = (credentials) => {
    oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token:credentials.accessToken,
});
}
const getOAuth2Client = () => {
    return oauth2Client;
}

module.exports = {setOAuth2Client, getOAuth2Client}