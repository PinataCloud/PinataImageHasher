import EXIF from "exif-js"

export default class ImageMetadata {

  static GetMetadata(img) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        if (!img) {
          // console.log("img must be defined");
          reject(new Error("img must be defined"));
        }

        EXIF.getData(img, function() {
          // packaged in user comment now:
          // const gpsError = EXIF.getTag(this, "GPSHPositioningError");
          const gpsLat = EXIF.getTag(this, EXIF.GPSTags["2"]);
          const gpsLong = EXIF.getTag(this, EXIF.GPSTags["4"]);


          // console.log("getting metadata");
          const commentCharIntArray = EXIF.getTag(this, "UserComment");


          if (commentCharIntArray === undefined) {
            // console.log("image contains no metadata");
            reject(new Error("image contains no metadata"));
            return;
          }

          let commentString = "";
          let asciiDefine = "";
          let i;

          // make sure encoding is ASCII
          for (i = 0; i < 5; i++) {
            const commentChar = String.fromCharCode(commentCharIntArray[i]);
            asciiDefine += commentChar;
          }

          if (asciiDefine !== "ASCII") {
            // console.log("only ascii supported");
            reject(new Error("image comment metadata not in ASCII format"));
            return;
          }

          // skip first 8, they define encoding
          for (i = 8; i < commentCharIntArray.length; i++) {
            const commentChar = String.fromCharCode(commentCharIntArray[i]);
            commentString += commentChar;
          }

          try {
            const jsonData = JSON.parse(commentString);
            let date = jsonData["date_stamp"];
            let time = jsonData["time_stamp"];
            delete jsonData["date_stamp"];
            jsonData["time_stamp"] = date + "T" + time + " UTC";
            jsonData["location"] = "lat: " + gpsLat + " long: " + gpsLong;
            // jsonData["GPS Horizontal Error"] = gpsError +" meters";
            // console.log(jsonData);
            resolve(jsonData);
          } catch (e) {
            // console.log("image contains no json metadata");
            reject(new Error("image contains no json metadata"));
          }
        });
      }, 500)
    }))
  }
}
