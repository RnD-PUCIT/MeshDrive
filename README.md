
# MeshDrive
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

#### Live Demo
[mohsina.li/showcase/meshdrive/](http://mohsina.li/showcase/meshdrive/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
 1. NodeJS
 2. Mongo DB
 3. Text Editor
 4. Web Browser
```

### Installing & Running up

A step by step series of examples that tell you how to get a development env running
 **First of all clone this repository:**
```sh
$ git clone https://github.com/AIMRL/MeshDrive
```

 1. #### NodeJS
Binaries, installers, and source tarballs are available at [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
```
1. Download the Windows installer from the Nodes.js® web site.
2. Run the installer (the .msi file you downloaded in the previous step.)
3. Follow the prompts in the installer (Accept the license agreement, click the NEXT button a bunch of times and accept the default installation settings).
4. Restart your computer. (optional)
```

 2. #### Mongo DB
Download MongoDB from [https://www.mongodb.com/download-center/community](
https://www.mongodb.com/download-center/community)
```
1. Download the installer
2. Run the installer (the file you downloaded in the previous step.)
3. Follow the prompts in the installer
```
 3. #### Text Editor
You can use [Visual Studio Code](https://code.visualstudio.com/download) or any text editor you likeasd
```
1. Download the installer
2. Run the installer (the file you downloaded in the previous step.)
3. Follow the prompts in the installer
```

 4. #### Web Browser
You can use [Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/download/) or any browser you like
```
1. Download the installer
2. Run the installer (the file you downloaded in the previous step.)
3. Follow the prompts in the installer
```



End with an example of getting some data out of the system or using it for a little demo

## Running the project

### Front-end
Run `cmd` or any terminal then open up project directory and perform following commands

```sh
$ cd meshdrive-frontend/
$ npm i
$ npm start
```
##### Entry Point:
```
meshdrive-frontend/src/App.js
```

### Back-end (API)

3. Open folder where you cloned the repo and go to folder Mesh. This is the folder where API code is
2. Open API working directory in command prompt
3. Run command “npm install” this will add all required packages to the API
4. Run command “node app.js” this will start the API and it will start listening for request on port 8000

## Deployment
### Front-end
Run `cmd` or any terminal then open up project directory and perform following commands
```sh
$ npm run build
```
A folder named `build` will be created in the project directory containing all (html, css, & javascript) files. 

## Configuration Files
### Front-end configuration
1. Front-End routes can be configured in`meshdrive-frontend/src/components/App.js` file
2. Front-End project URL, API base URL and API routes can be configured in `meshdrive-frontend/src/constants/apiConstants.js` file
### Back-end (API)
1. For changing Port on which project is running go to Extras/Globals.js and find variable URL and change port there
2. For changing MongoDb connection in case you have different  go to Extras/Globals.js and find variable DB_URL  and change  it accordingly
## Built With

* [npm](https://www.npmjs.com/) - Dependency Management
* **Front-end:**
* * [React.js](https://reactjs.org/) - The web front-end library used
* * [Redux](https://redux.js.org/) - The app state container used
* * [ReactStrap](https://reactstrap.github.io/) - The user interface library used
* **Back-end (API)**
* * [Node.js](https://nodejs.org/) - The back-end environment used
* * [Express.js](https://expressjs.com/)  - The back-end framework used
* * [MongoDB](https://www.mongodb.com/) - The database used

## Authors
List of  contributors who participated in this project:
* **Mohsin Ali** - *Worked on bootstrapping, theming, developing front-end and api integration* - [github profile](https://github.com/mohsinalipro)
* **Memona Sultan** - *Worked on developing front-end & back-end, api integration* - [github profile](https://github.com/memona008)
* **Shaheryar Tariq** - *Worked on developing front-end, creating middleware api on back-end, api integration and database* - [github profile](https://github.com/shaheryar1)
* **Bilal Yasin** - *Worked on developing back-end, creating middleware api on back-end and database* - [github profile](https://github.com/shaheryar1)
