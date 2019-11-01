export default class AtraAPI{

  // gets the CIDs in order of most recent to oldest
  static async GetCIDs(){
    const json = await  this.GetAtraRecords();
    const CIDs =[];
    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length-1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
      CIDs.push( record[0]);
    }

    return CIDs;
  }

  static async GetAtraRecords(){
    const resp = await fetch("https://api.atra.io/prod/v1/dtables/records?tableId=4cc77154-536c-42ab-8f1d-53a1231d6667", {
      headers:{
        "x-api-key":"vdssu05AWO6yAG4ojL4Sv6I9RkAGCak19hBhTVpm"
      }
    });
    const json = await resp.json();
   return json;
  }

  // gets the records in order of most recent to oldest
  static async GetCIDsLocationAndDates(){
    const json = await  this.GetAtraRecords();
    const CIDs = [];
    const Dates = [];
    const Locations = [];

    const liveRecords = json["live"];
    let i;
    // start at the end of the list
    for (i = liveRecords.length-1; i >= 0; i--) {
      const record = liveRecords[i]["record"];
      // skip test records
      if (record[0].includes("test"))
        continue;
      CIDs.push( record[0]);
      Dates.push(record[1]);
      Locations.push(record[2]);
    }

    return [CIDs, Dates, Locations];
  }


  // How to use:
  // import AtraAPI from "../components/AtraAPI";
  // async function fillCIDsVariable() {
  //   const cids = await AtraAPI.GetCIDs();
  //   return cids;
  // }
  // const cids = await fillCIDsVariable();

}
//
// "live": [
//   {
//     "0": "0xfe3B5d6D6b2F3969a61432F8Ad10db7009690BfD",
//     "1": [
//       "CIDTest",
//       "1/1/2001",
//       "lat:0, long:0"
//     ],
//     "recordId": "0xfe3B5d6D6b2F3969a61432F8Ad10db7009690BfD",
//     "record": [
//       "CIDTest",
//       "1/1/2001",
//       "lat:0, long:0"
//     ]
//   },
