# SmartChat Application 📱

**SmartChat** application is one-to-one chat mobile application developed with React Native for both iOS and Android.

## 📚 Table of Contents

- [Description](#📋-description)
- [Technologies Used](#🛠️-technologies-used)
- [Requirements](#🗒️-requirements)
- [Installation](#📥-installation)
- [Usage](#🚀-usage)
- [Contribution](#🤝-contribution)
- [Contact](#📧-contact)

## 📋 Description

1. **User Authentication** 🔐:
   - Sign Up: Register with first name, last name, mobile number and password; email and photo are optional.
   - Login: Log in using mobile number and password.
2. **Profile Management** 👤:
   - Users can see and change their profile details except phone number, delete their account, or log out.
3. **Real-Time Messaging** 💬:
   - Send push notifications for new messages when the app is closed or the chat is open.
4. **Unread Messages** 📱:
     - Unread messages appear in the "Unread" tab with a count badge for each chat.
5. **Real-Time Notifications** 🔔:
   - Send push alerts for new messages, even if the app is closed or chat is open.
6. **Contacts and Invitation to the App** 📲:
   - Show contact list and let users invite friends via SMS who are not on the application.



## 🛠️ Technologies Used

- 📱 **React Native (TypeScript):** Framework for building cross-platform mobile apps using native components.
- ⚙️ **Redux:** State management library for predictable app state handling.
- 🧪 **Jest and React Native Testing Library:** Tools for unit and component testing.
- 🌐 **Socket.IO:** Enables real-time, bidirectional communication (used for instant chat).
- 🔔 **Firebase Cloud Messaging (FCM):** Delivers push notifications to user devices.
- 🔄 **GitHub Actions:** CI/CD automation for testing, linting, and deployment workflows.
- 🛠️ **Node.js:** JavaScript runtime for development tooling and scripts.

## 🗒️ Requirements

1. Install [Node.js](https://nodejs.org/en/download) on your system. Make sure that node version > 18 and version of npm > 10.
2. Install react native CLI.
   ```bash
   npm install -g react-native-cli
   ```
3. For complete steps to set up the development environment, please go through this website. [Setup](https://reactnative.dev/docs/set-up-your-environment?platform=ios)

## 📥 Installation

- To clone repository:
  ```bash
  git clone git@github.com:anjanibarlapati/smartchat-frontend.git
  ```
- To install dependencies, run the following command:
  ```bash
  npm install
  ```

## 🚀 Usage

- To run test suites, use below command
  ```bash
  npm run test
  ```
- To run lint, run below command
  ```bash
  npm run lint
  ```
- To run the application 
    - For iOS, open any iOS Simulator and run below command.
      ```bash
      npx react-native run-ios
      ```
    - For Android, open any Android Emulator and run   following command.
      ```bash
      npx react-native run-android
      ```

## 🤝 Contribution:
-   If you'd like to contribute, follow these steps:
- Clone repository:
    ```bash
    git clone git@github.com:anjanibarlapati/smartchat-frontend.git
    ```
- Create a new branch for your feature.
    ```bash
    git checkout -b branch-name
    ```
- Push your branch to GitHub:
    ```bash
    git push origin branch-name
    ```
- Open a Pull Request to *main* branch.

## 📧 Contact:
For any questions or queries, 

please contact, [anjanibarlapati@gmail.com](anjanibarlapati@gmail.com)

### Thank You 😃