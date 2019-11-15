import Crypto from "./Crypto";

export default class AtraAPI {

  // gets the CIDs in order of most recent to oldest
  static async GetCIDs(key) {
    const json = await this.GetAtraRecords();
    const CIDs = [];
    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length - 1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
      try{
        // console.log(Crypto.Decrypt(record[0],key));
        CIDs.push(Crypto.Decrypt(record[0], key));
      }
      catch(e)
      {
        // console.log(e);
        let unencrytptableMessage = "Unable to decrypt with supplied key";
        CIDs.push(unencrytptableMessage);
      }
    }

    return CIDs;
  }

  static async GetAtraRecords() {
    const tableID = "83769362-85c7-4a0f-bd48-28b5606e29a3";
    const resp = await fetch("https://api.atra.io/prod/v1/dtables/records?tableId=" + tableID + "&txinfo=true", {
      headers: {
        "x-api-key": "vdssu05AWO6yAG4ojL4Sv6I9RkAGCak19hBhTVpm"

      }
    });
    console.log(resp.statusText);
    const json = await resp.json();
    return json;
  }

  // gets the records in order of most recent to oldest
  static async GetCIDsLocationAndDates(key) {
    const json = await this.GetAtraRecords();
    const CIDs = [];
    const Dates = [];
    const Locations = [];
    const BlockTimes = [];
    const StorageLocations = [];

    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length - 1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
      const blockNumber = liveRecords[i]["event"]["blockNumber"];
      // get block time
      const resp = await fetch("https://api-rinkeby.etherscan.io/api?module=block&action=getblockreward&blockno=" + blockNumber);
      const blockJson = await resp.json();
      const blockTimeStamp = blockJson["result"]["timeStamp"];
      // make the date look like the one stored on chain
      let date = new Date(parseInt(blockTimeStamp) * 1000);

      if (!AtraAPI.isValidDate(date)) {
        date = "Pending..."
      } else {
        date = AtraAPI.getFormattedDateString(date);
      }

      BlockTimes.push(date);
      try{
        // console.log(Crypto.Decrypt(record[0],key));
        CIDs.push(Crypto.Decrypt(record[0], key));
        Dates.push(Crypto.Decrypt(record[1], key));
        Locations.push(Crypto.Decrypt(record[2], key));
        StorageLocations.push(Crypto.Decrypt(record[3], key));
      }
      catch(e)
      {
        // console.log(e);
        let unencrytptableMessage = "Unable to decrypt with supplied key";
        CIDs.push(unencrytptableMessage);
        Dates.push(unencrytptableMessage);
        Locations.push(unencrytptableMessage);
        StorageLocations.push(unencrytptableMessage);
      }


    }

    return [CIDs, Dates, Locations, BlockTimes, StorageLocations];
  }

  static isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  static getFormattedDateString(date) {
    // 12 Nov 2019 23:16:01
    const day = date.toLocaleString('default', {
      day: 'numeric',
      timeZone: "UTC"
    });
    const mon = date.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hc: "h24",
      hour12: false,
      timeZone: "UTC"
    }).replace(',', '');

    return day + " " + mon
  }



}
