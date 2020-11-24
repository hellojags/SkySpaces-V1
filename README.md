# SkySpaces [Hackathon Notes]

Below list of features are added (notes will be updated after submitting project, in few minutes)

1. SkySpaces landing page - https://siasky.net/AAAJohsrhWTRSogCr0GQJOXbprCTYpEBJj6597OJ8H7mpg

2. File Sharing Between Skynet users using Public Key -  https://siasky.net/AAAY2ye7q2VdG229IbGCyF7GA89_JE0u7FknInydEvdkbQ

3. SkySpaces New UX

Static UI - HTML/CSS demo(Light/Dark) - https://siasky.net/AAAxUx7oMl8ZuL-bKOeljbvqU8SdlfMyUWYUeJy8ErsYzg

WebApp/React Implementation(WIP) - https://siasky.net/_AFCeMD_zrRl0kGYNnksguliCMpTK6OJexaSFvJ1Qf-CSw


SkySpaces Hackathon Focus Areas

(1) Skapp - 100% goal acheived 
- SkySpaces Integration with SkyDB. SkySpaces functionality needs Skynet, SkyDB, HNS name and Browser only :)

(2) Professional UI - 90% goal acheived, 10% work will be conmpleted in next 2 days 

(3) Cost effective SkyDB usage - 100% goal acheived. 
- This is new feature and is working on local and will be released with next update in next two days

(4) All Kind of File(Space) Sharing
- Public Space/File sharing (Working)
- File Sharing between Users using public key (need to enable encryption) - please check demo above  
- Password protected file sharing (WIP) 
- 80% goal acheived

(5) "User Discovery" page, "follower and following" page - 50% goal acheived (It will be released post Beta release, should be quick as foundation components are in place)
- UX 100% completed
- design completed
- implemntation in progress

(6) Somthing intresting cooking in my head for few months (since Skynet announcement). Once #1 to 5 is done, I will have intresting updates.

 **** Target timeline for #1 to #5 public release by mid Dec 2020 . #6 in First week of Feb 2021 ****

If you like the project, please follow(star) it. also connect with me in Sia discord (crypto_rocket) for discussion/collaboration.  

NOTE:
1. Code is not deployed on HNS domain yet. It will be done on 25th Nov. You can always run this branch locally and test.

**** I would not recommend storing or sharing any sensitive information using SkySpaces yet.I know couple of bugs I need to fix in next two days. post beta release I will need to cleanup code and then I will atleast get two external devs to review my code for security :) *****

# Introducing "SkySpaces"

https://skyspaces.io [latest code]

Access on Skynet: https://siasky.net/hns/skyhub/ [Codebase gets updated on weekly basis]

SkySpaces is a place where user can create digital Spaces to store and manage Skynet content. 
Skynet content search and discovery can be done using categories, custom tags and metadata. Soon you will be able to share Skynet Spaces with your friends and families like picture galleries, video albums..etc.

Goal of SkySpaces is to give power in hands of users to control their own Private, Personal, Social and Public Spaces in most secure and privacy focused manner. Skynet makes this possible.

SkySpaces v0.1.0-Alpha : MVP Features
- Upload/Download to/from Skynet ( ** NOTE: Skynet encryption is NOT enabled yet, Uploaded content is Public **) 
- Create/Delete/Rename "Spaces"
- Skylink Metadata management  (Category, Tags, Description, filename, file description)
- Skynet content Search in Spaces based on Metadata
- Skynet Portal management
- History Log
- Backup spaces metadata

## Video Demo 

### SkySpaces Feature Demo: https://skynethub.io/AABdoeACo5KQzrgla89QILeTQjuSachXjEZNhhoUe5844A

### Public Sharing Demo: https://skynethub.io/AACx94zAz2W_u0dGJCJ4Qc6-4kJFtX6PJrkIZJkktkntNg

## Features:

1. Upload/Download data using Skynet Public Portals
2. Create/Edit/Delete Spaces to manage your Skylinks
3. Search Spaces/Skylinks
4. Maintain History, Clear History
5. Delete Skylink from Spaces (note: skylink wont be deleted from skynet)

## Key Technologies

Here is a list of technologies we use:

* Skynet: Portal api for uploading and downloading data
* Blockstack: Authentication and Skylink index file storage
* HNS/Namebase: Decentralize DNS (WIP)
* React/Redux: React Framework
* AwesomeFonts: CSS Framework

## Donation

Sia Address: 7dd21ea3c56edb74fa3a7121af32fcc20285b3165a87c974e13e3df80202d1bd20f645e63fb5

ETH Address: 0xc2167fB1dC54d3489b759FC2c2F9366a7dfb67ff

BTC Address: 39Atputc5K1cjHzKVeBfpJPvUPpcp5BxuV

## Feature request: 

* Please create issue below
https://github.com/skynethubio/SkySpaces/issues

* Ping on discord
https://discord.com/invite/w7TWJR

* Contact Us: hello@skyspaces.io

## Run Locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
