![Lynxii](res/lynxii.svg)

***Intelligent Devices for the Masses** - Fully Programmable Smart Device Network*

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/VevoxDigital/Lynxii/master.svg?label=stable&style=for-the-badge)
![License](https://img.shields.io/badge/license-GNU_GPLv3-green.svg?style=for-the-badge)

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/VevoxDigital/Lynxii/develop.svg?label=latest&style=for-the-badge)
![Travis (.org)](https://img.shields.io/travis/VevoxDigital/Lynxii.svg?style=for-the-badge)
![Code Climate coverage](https://img.shields.io/codeclimate/coverage/VevoxDigital/Lynxii.svg?style=for-the-badge)

# Introduction
Lynxii is a powerful tool for creating dynamic and programmable networks of devices that all integrate together. We aim to create a standardized way for "smart" devices to communicate with one-another that can be updated on the fly and even automated completely, all without needing any programming knowledge. This allows users to insert control logic between their devices to actually make the whole network "smart", for real.

While it works great for it, this isn't just for homes either. Lynxii is designed to be able work with multiple large networks at once, allowing it to be used easily for small businesses, large offices, and even factory floors: any environment where automation could be utilized.

# Installation
**Right now, Lynxii is in an unstable development state and is not ready for production.**  
If you wish to experiment with it for yourself, by all means go for it. We would love to hear your feedback.

You will need `git`, `nodejs` v11 or later, and `yarn`.

Start by getting the server ready.
```
  # Clone the repository and move to the directory
  git clone https://github.com/VevoxDigital/Lynxii
  cd Lynxii

  # Install dependencies
  yarn

  # Start the server
  yarn start:server

  # Or, start the client
  yarn start:client
```

# About
## Data Security
Traffic *within* your local network is encrypted over SSL, the same proven technology your browser uses to secure your information on most websites you visit. Additonally, neither Lynxii itself nor any of its included blocks will access the open Internet in any way once installed; the whole thing works with its link to the outside world disabled. The same can't be said about user-installed block libraries, however, and you should check with the authors of those libraries to see what they need.

Bear in mind as well, Lynxii is a powerful tool and has securities in place to safeguard your data, but it is only as smart as its user. Keep your passwords safe and secure; anyone who can sign in (whether you want them to or not) has full access to edit, delete, and/or monitor both your maps and the data that moves around in them. Furthermore, only add blocks you know and trust: blocks are harmless in the lobby, but adding them to the map gives them access to the map's information and any information you connect them to.

## Contributing
Lynxii is still in a very early development stage, so we're eager to hear your feedback. If you want to make some changes of your own to send to us, read over our [contribution guidelines](doc/contributing.md) then submit a pull request!

----

Designed and Developed by [@CynicalBusiness](https://github.com/CynicalBusiness) with [Vevox Digital](https://vevox.io)  
[GNU General Public License v3.0](/LICENSE)


*Myra ta Hayzel; Pal, Kifitae te Entra en na Loka*  
