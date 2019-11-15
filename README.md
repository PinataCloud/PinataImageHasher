# Corroborator Auditor Interface
_Open &amp; Trustless Data Verification_

---

## Table of Contents

- [Overview](#overview)
- [Demo Walkthough](#demo-walkthough)
  - [Hosted Demo](#hosted-demo)
  - [Local Demo](#local-demo)
- [Data Validation](#data-validation)
- [Other Validation Tools](#other-validation-tools)
- [Open Source Tools Used](#open-source-tools-used)
- [Dev Notes](#dev-notes)
  - [Deploy to Host](#deploy-to-host)



## Overview

**Corro**borator Audtitor allows you to easily *explore and verify* any file issued by our [iOS Image Capture App](https://github.com/Corroborator-Net/Corroborator-iOS):

- **Audit** verified data logged on our system along with metadata
  - View files
  - View metadata
- **Verify** local or remote files issued by our [iOS Image Capture App](https://github.com/Corroborator-Net/Corroborator-iOS)
  - Upload files and cross-validate integrity & provenance

## Demo Walkthrough

Using **Corro**borator Auditor is easy and intuitive for everyone. Here we provide a sample image that we want to audit with our system that you can **run on your machine** - no need to trust us or a hosted service!

---

### Hosted Demo

*If you trust the host, or do not have the ability to download and run the aplication*

We have a publised version avalible for you [at this link]
- https://corroborator-net.github.io/

Open the link above then jump to the [Data Validation](#data-validation) section to contiue the walkthrough.

---

### Local Demo

*If you wish to run or install the application on your own machine, you can!*

#### Browser Only - For Users, No Install Required

1. Clone the static build repo into a directory of your choise:
```bash
#SET YOUR OWN DIRECTORY HERE IN PLACE OF ~:
cd ~
git clone git@github.com:Corroborator-Net/Corroborator-Net.github.io
```

2. Open the `index.html` file browser where the directory you cloned into is.


#### Full Installation - For Developers

Open a `terminal` on lnux and run the following commands:

1. Clone this repo into a directory of your choise:
```bash
#SET YOUR OWN DIRECTORY HERE IN PLACE OF ~:
cd ~
git clone git@github.com:Corroborator-Net/Corroborator-Auditor.git
```

2. Install the application & dependencies:
```bash
npm install
```

3. Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

Then see [Dev Notes](#dev-notes) for more details on deploying and editing the application.


---

### Data Validation

1. Download the [Demo Picture](/src/statics/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR.jpeg)
2. Check that the downloaded image CID (`QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR`) matches what you can obtain on an IPFS gateway and/or the IPFS desktop client (See [Open Validation Tools](#open-validation-tools))
    - Use a *gateway* to see the file by CID ([here is one](https://gateway.pinata.cloud/ipfs/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR))
    - Use the *Desktop Client* **files explorer** to add/upload the demo file and cross-verify that the file indeed has the same CID generated as the file viewed at a gateway.
3. Verify the CID was published on the blockchain. The demo file was published [on the rinkeby ethereum testnet ](https://rinkeby.etherscan.io/tx/) (transaction hash: ``)
    - At the bottom of the page, Click to `show more`
    - View the `input data` as `UTF-8`. The CID || picture timestamp || location (in that order)  _should_ be apparent there. You can also validate the timestap of the transaction itself ot cross-check the providance of the recorded data.

### Other Validation Tools

Don't this application? You can still use the system and **watch the watchers** with other 3rd party open source tools. See the [Corroborator Overview](https://github.com/Corroborator-Net/Corroborator-Overview) for options.

### Open Source Tools Used
- [IPFS](https://ipfs.io/): The [JS node](https://js.ipfs.io/)
- [Atra](https://atra.io/): A Public [Ethereum Blockchain](https://ethereum.org/) Toolset
- [Quasar](https://quasar.dev): A [Vue](https://vuejs.org/) Webapp Framework


## Dev Notes
### Deploy to Host

Open a `terminal` on lnux and run the following commands:

1. Add a `gh-pages` remote to git (for us it is git@github.com:Corroborator-Net/Corroborator-Net.github.io.git)
```bash
git remote add gh-pages git@github.com:Corroborator-Net/Corroborator-Net.github.io.git
```

2. Deploy it to the host:
```bash
npm run deploy
```
