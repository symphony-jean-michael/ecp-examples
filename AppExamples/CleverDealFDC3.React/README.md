# Demo FDC3

## Clever Deal application

Execute at in the directory 'ecp-examples/AppExamples/CleverDealFDC3.React'

```
npm install
npm start
```

It will start the Clever Deal on [http://localhost:3000](http://localhost:3000) (We will configure it in the configuration file of Finsemble-seed)

## Finsemble-seed application

Finsemble is available here: https://github.com/Finsemble/finsemble-seed
You need to clone the repo
```
git clone https://github.com/finsemble/finsemble-seed
```

Then, you need to update finsemble-seed/public/configs/application/apps.json by adding:

```json
{
  "apps": [
    ...
    {
      "appId": "symphony",
      "name": "Symphony",
      "type": "web",
      "details": {
        "url": "https://st3.symphony.com/apps/client2?embed=true"
      },
      "interop": {
        "intents": {
          "listensFor": {
            "StartChat": {
              "contexts": ["fdc3.chat.initSettings"]
            },
            "SendChatMessage": {
              "contexts": ["fdc3.chat.message"]
            },
            "ViewChat": {
              "contexts": ["fdc3.chat.room", "fdc3.contact", "fdc3.contactList"]
            },
            "ViewMessages": {
               "contexts": ["fdc3.searchCriteria", "fdc3.chat.searchCriteria"]
            }
          },
          "raises": {
            "ViewInstrument":  ["fdc3.instrument"],
            "ViewContact":  ["fdc3.contact"],
            "CreateInteraction":  ["fdc3.interaction"]
          }
        }
      },
      "hostManifests": {
        "Finsemble": {
          "window": {
            "width": 900,
            "height": 750,
            "options": {
              "minWidth": 175
            }
          },
          "foreign": {
            "components": {
              "App Launcher": { "launchableByUser": true },
              "Window Manager": { "FSBLHeader": true, "persistWindowState": true }
            }
          },
          "interop": {
            "selectConnect": [{
              "autoAssociate": {
                "allChildren": true
              }
            }]
          }
        }
      }
    },
    {
      "appId": "cleverdeal",
      "name": "Clever deal",
      "type": "web",
      "details": {
        "url": "http://localhost:3000/"
      },
      "interop": {
        "intents": {
          "raises": {
            "ViewChat":  ["fdc3.chat.room"]
          }
        }
      }
    }

    ...
  ]
}
```

Then do at the root level (finsemble-seed): (Be sure to use node v14 (or higher) )

```
yarn && yarn start
```

# Clever Deal application

This application just aims to show how to integrate ECP into a React application. It relies on fake data and will target some preset steam ids that you can modify in the data folder. 

## Technical React details

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


