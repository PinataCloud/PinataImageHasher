# Corroborator Auditor Interface

_Open & Trustless Data Verification_

* * *

## Table of Contents

-   [Overview](#overview)
-   [Demo Walkthough](#demo-walkthough)
    -   [Hosted Demo](#hosted-demo)
    -   [Local Demo](#local-demo)
-   [Data Validation](#data-validation)
    -   [Alternative Open Source Validation Tools](#alternative-open-source-validation-tools)
-   [Developer Notes](#developer-notes)

## Overview

**Corro**borator Audtitor allows you to easily _explore and verify_ any file issued by our [iOS Image Capture App](https://github.com/Corroborator-Net/Corroborator-iOS):

-   **Audit** verified data logged on our system along with metadata
    -   View files
    -   View metadata
-   **Verify** local or remote files issued by our [iOS Image Capture App](https://github.com/Corroborator-Net/Corroborator-iOS)
    -   Upload files and cross-validate integrity & provenance

## Demo Walkthrough

Using **Corro**borator Auditor is easy and intuitive for everyone. Here we provide a sample image that we want to audit with our system that you can **run on your machine** - no need to trust us or a hosted service!

* * *

### Hosted Demo

_If you trust the host, or do not have the ability to download and run the aplication_

We have a publised version avalible for you [at this link]

-   <https://corroborator-net.github.io/>

Open the link above then jump to the [Data Validation](#data-validation) section to contiue the walkthrough.

* * *

### Local Demo

_If you wish to run or install the application on your own machine, you can!_

**Only a browser required for users**

1.  Download the latest (`corroborator_auditor-X.X.X.zip`) release from the list here: https://github.com/Corroborator-Net/Corroborator-Auditor/releases

2. Move the file to a new file folder / directory and extract the contents of the `.zip` file.

3.  Open `index.html` in a web browser of your choice (right click and `open in...`)


## Data Validation

1.  Download the [Demo Picture](/src/statics/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR.jpeg)
2.  Check that the downloaded image CID (`QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR`) matches what you can obtain on an IPFS gateway and/or the IPFS desktop client (See [Open Validation Tools](#open-validation-tools))
    -   Use a _gateway_ to see the file by CID ([here is one](https://gateway.pinata.cloud/ipfs/QmYXzRsLsWHTg3xTPx7ksEpN7w8JgwpiZ4whnq6phaDrZR))
    -   Use the _Desktop Client_ **files explorer** to add/upload the demo file and cross-verify that the file indeed has the same CID generated as the file viewed at a gateway.
3.  Verify the CID was published on the blockchain. The demo file was published [on the rinkeby ethereum testnet ](https://rinkeby.etherscan.io/tx/) (transaction hash: ``)
    -   At the bottom of the page, Click to `show more`
    -   View the `input data` as `UTF-8`. The CID || picture timestamp || location (in that order)  _should_ be apparent there. You can also validate the timestap of the transaction itself ot cross-check the providance of the recorded data.

### Alternative Open Source Validation Tools

As and alternative to _[Corroborator Auditor](https://github.com/Corroborator-Net/Corroborator-Auditor)_, you can still use _[Corroborator Reporter](https://github.com/Corroborator-Net/Corroborator-Reporter)_ and **watch the watchers** with other 3rd party open source tools:

| Project                                 | Link                                                             | What it Does                                          |
| --------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Ethereum MAINNET Block Explorer         | <https://blockchair.com/>                                        | Figerprint & Data Provenance (Production)             |
| Ethereum RINKEBY TESTNET Block Explorer | <https://rinkeby.etherscan.io/>                                  | Figerprint & Data Provenance (Testing)                |
| IPFS Gateway                            | <https://gateway.pinata.cloud/ipfs/>&lt;PROVIDE_CID_FINGERPRINT> | Fingerprint & Data Validation (online)                |
| IPFS Desktop                            | <https://github.com/ipfs-shipyard/ipfs-desktop>                  | Fingerprint & Data cross-validation Client (download) |
| Text Difference Tool                    | <https://www.diffchecker.com/>                                   | Crosscheck CIDs and Hashes                            |

## Developer Notes

### Installation

Open a `terminal` on lnux and run the following commands:

1.  Clone this repo into a directory of your choise:

```bash
#SET YOUR OWN DIRECTORY HERE IN PLACE OF ~:
cd ~
git clone git@github.com:Corroborator-Net/Corroborator-Auditor.git
```

2.  Install the application & dependencies:

```bash
npm install
```

3.  Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Deploy to a Remote Host

Open a `terminal` on lnux and run the following commands:

1.  Add a `gh-pages` remote to git (for us it is git@github.com:Corroborator-Net/Corroborator-Net.github.io.git)

```bash
git remote add gh-pages git@github.com:Corroborator-Net/Corroborator-Net.github.io.git
```

2.  Build the application:

```bash
npm run build
```

2.  Deploy it to the host:

```bash
npm run deploy
```

## License

GNU Affero General Public License v3.0

### :heart: Open Source Tools Used

-   [IPFS](https://ipfs.io/): The [JS node](https://js.ipfs.io/)
-   [Atra](https://atra.io/): A Public [Ethereum Blockchain](https://ethereum.org/) Toolset
-   [Quasar](https://quasar.dev): A [Vue](https://vuejs.org/) Webapp Framework
