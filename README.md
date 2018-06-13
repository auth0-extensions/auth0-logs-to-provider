# Auth0 - Logs to AWS Cloudwatch Logs

## Install Extension

This extension will take all of your Auth0 logs and export them to CloudWatch. to install go to your management dashboard - https://manage.auth0.com/#/extensions and click on Create Extension and enter the url for this github repo.


## Deploy to Webtask.io

### Configure Webtask

If you haven't configured Webtask on your machine run this first:
```
npm i -g wt-cli
wt init
```





### Pre reqs:

> To get a client_id and secret use the client credentials setup and grant a client "read:logs" scope on API V2 and you can use that Client Id/Secret for AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET in the script below.
> You will need to create a cloud watch log group and log group stream and use the values for CLOUDWATCH_LOG_GROUP_NAME and CLOUDWATCH_LOG_STREAM_NAME
> Get the AWS Access, Secret Key and Region for AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, AWS_REGION

### Create Cron

To run it on a schedule (run every 5 minutes for example):

```bash
wt cron schedule --profile "wt_profile" --name auth0-logs-2-cloudwatch \
--secret AUTH0_DOMAIN="x.au/eu.auth0.com" \
--secret AUTH0_CLIENT_ID="client_id with read logs permissions on API V2" \
--secret AUTH0_CLIENT_SECRET="<client_secret>" --secret LOG_LEVEL="0,1,2,3,4" \
--secret LOG_TYPES="s,seacft,feacft,f,w,du,fu,fp,fc,fco,con,coff,fcpro,ss,fs,cs,cls,sv,fv,scp,fcp,sce,fce,scu,fcu,scpn,fcpn,svr,fvr,scpr,fcpr,fn,limit_wc,limit_ui,api_limit,sdu,fdu" \
--secret CLOUDWATCH_LOG_GROUP_NAME="logGroupName" --secret CLOUDWATCH_LOG_STREAM_NAME="logStreamName" \
--secret AWS_ACCESS_KEY_ID="aws_access_key" --secret AWS_SECRET_KEY="aws_secret_key" \
--secret AWS_REGION="<aws_region>" --secret BATCH_SIZE=100 "*/5 * * * *" build/bundle.js
```



## Usage

Go to [CoudWatch] to inspect logs

## Filters

The `LOG_LEVEL` can be set to (setting it to a value will also send logs of a higher value):

 - `1`: Debug messages
 - `2`: Info messages
 - `3`: Errors
 - `4`: Critical errors

The `LOG_TYPES` filter can be set to:

- `s`: Success Login (level: 1)
- `seacft`: Success Exchange (level: 1)
- `feacft`: Failed Exchange (level: 3)
- `f`: Failed Login (level: 3)
- `w`: Warnings During Login (level: 2)
- `du`: Deleted User (level: 1)
- `fu`: Failed Login (invalid email/username) (level: 3)
- `fp`: Failed Login (wrong password) (level: 3)
- `fc`: Failed by Connector (level: 3)
- `fco`: Failed by CORS (level: 3)
- `con`: Connector Online (level: 1)
- `coff`: Connector Offline (level: 3)
- `fcpro`: Failed Connector Provisioning (level: 4)
- `ss`: Success Signup (level: 1)
- `fs`: Failed Signup (level: 3)
- `cs`: Code Sent (level: 0)
- `cls`: Code/Link Sent (level: 0)
- `sv`: Success Verification Email (level: 0)
- `fv`: Failed Verification Email (level: 0)
- `scp`: Success Change Password (level: 1)
- `fcp`: Failed Change Password (level: 3)
- `sce`: Success Change Email (level: 1)
- `fce`: Failed Change Email (level: 3)
- `scu`: Success Change Username (level: 1)
- `fcu`: Failed Change Username (level: 3)
- `scpn`: Success Change Phone Number (level: 1)
- `fcpn`: Failed Change Phone Number (level: 3)
- `svr`: Success Verification Email Request (level: 0)
- `fvr`: Failed Verification Email Request (level: 3)
- `scpr`: Success Change Password Request (level: 0)
- `fcpr`: Failed Change Password Request (level: 3)
- `fn`: Failed Sending Notification (level: 3)
- `limit_wc`: Blocked Account (level: 4)
- `limit_ui`: Too Many Calls to /userinfo (level: 4)
- `api_limit`: Rate Limit On API (level: 4)
- `sdu`: Successful User Deletion (level: 1)
- `fdu`: Failed User Deletion (level: 3)

So for example, if I want to filter on a few events I would set the `LOG_TYPES` filter to: `sce,fce,scu,fcu`.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
