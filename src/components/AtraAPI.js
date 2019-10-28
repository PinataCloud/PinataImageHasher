export default class AtraAPI{

  static async GetCIDs(){
    const resp = await fetch("https://api.atra.io/prod/v1/dtables/records?tableId=4cc77154-536c-42ab-8f1d-53a1231d6667", {
      headers:{
        "x-api-key":"vdssu05AWO6yAG4ojL4Sv6I9RkAGCak19hBhTVpm"
      }
    });
    const json = await resp.json();
    const CIDs =[];
    const liveRecords = json["live"];
    let i;
    for (i = 0; i < liveRecords.length; i++) {
      // console.log(liveRecords[i]["record"][0]);
      CIDs.push( liveRecords[i]["record"][0]);
    }

    return CIDs;
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
