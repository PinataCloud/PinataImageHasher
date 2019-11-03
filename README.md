# Corroborator Auditor Interface
_Open &amp; Trustless Data Verification_

---

## Table of Contents

- [Overview](#overview)
- [Demo Walkthough](#demo-walkthough)
  - [Installation](#installation)
  - [Data Validation](#data-validation)
  - [Other Validation Tools](#other-validation-tools)
- [Open Source Tools Used](#open-source-tools-used)
- [License](#license)

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

### Installation

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

### Data Validation

1. Download the [Demo Picture](/src/statics/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR.jpeg)
2. Check that the downloaded image CID (`QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR`) matches what you can obtain on an IPFS gateway and/or the IPFS desktop client (See [Open Validation Tools](#open-validation-tools))
    - Use a *gateway* to see the file by CID ([here is one](https://gateway.pinata.cloud/ipfs/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR))
    - Use the *Desktop Client* **files explorer** to add/upload the demo file and cross-verify that the file indeed has the same CID generated as the file viewed at a gateway.
3. Verify the CID was published on the blockchain. The demo file was published [on the rinkeby ethereum testnet ](https://rinkeby.etherscan.io/tx/) (transaction hash: ``)
    - At the bottom of the page, Click to `show more`
    - View the `input data` as `UTF-8`. The CID || picture timestamp || location (in that order)  _should_ be apparent there. You can also validate the timestap of the transaction itself ot cross-check the providance of the recorded data.
  
### Other Validation Tools

Don't this application? You can still use the system and **watch the watchers** with other 3rd party open source tools:

1. Download the [Demo Picture](/src/statics/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR.jpeg)
2. Check that the downloaded image CID (`QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR`) matches what you can obtain on an IPFS gateway and/or the IPFS desktop client (See [Open Validation Tools](#open-validation-tools))
    - Use a *gateway* to see the file by CID ([here is one](https://gateway.pinata.cloud/ipfs/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR))
    - Use the *Desktop Client* **files explorer** to add/upload the demo file and cross-verify that the file indeed has the same CID generated as the file viewed at a gateway.
3. Verify the CID was published on the blockchain. The demo file was published [on the rinkeby ethereum testnet ](https://rinkeby.etherscan.io/tx/) (transaction hash: ``)
    - At the bottom of the page, Click to `show more`
    - View the `input data` as `UTF-8`. The CID || picture timestamp || location (in that order)  _should_ be apparent there. You can also validate the timestap of the transaction itself ot cross-check the providance of the recorded data.

Using **[IPFS](https://ipfs.io)** we are able to *simultaniously obtain and validate the integrity of data*. If you trust that the Finderprint (Content Identifier - CID) of the data is valid, you are able to use a **gateway** online. If you do not, you are able to **cross-validate** the data & figerprint by use of an *IPFS node Client*. Pending needs, you are able to use either or both. (See [Open Validation Tools](#open-validation-tools) for options)

Given the Data's *metadata*, one is able to extract and verify a *signing athority*. This is an **ethereum public key**. Each **corro**borator is assigned one to *sign the data and publish the fingerprint to the ethereum blockain*. Using a *block explorer*, anyone is able to verify:
- The signing athority's key
- The fingerprint published
- The timestamp of the fingerprint addition to the blockchain
(See [Open Validation Tools](#open-validation-tools) for options)

### Open Source Tools Used
- [IPFS](https://ipfs.io/): The [JS node](https://js.ipfs.io/)
- [Atra](https://atra.io/): A Public [Ethereum Blockchain](https://ethereum.org/) Toolset
- [Quasar](https://quasar.dev): A [Vue](https://vuejs.org/) Webapp Framework
