import EXIF from "exif-js"

export default class ImageMetadata{

  static GetMetadata(img){
    return new Promise(((resolve, reject) => {
      setTimeout(()=>{
        if (!img) reject (new Error("img must be defined"));

        EXIF.getData(img, function(){
          // console.log("getting metadata");
          const commentCharIntArray =  EXIF.getTag(this, "UserComment");

          let commentString = "";
          let asciiDefine = "";
          let i;

          // make sure encoding is ASCII
          for (i = 0;i <  5; i++) {
            const commentChar = String.fromCharCode(commentCharIntArray[i]);
            asciiDefine += commentChar;
          }

          if (asciiDefine !== "ASCII"){
            console.log("only ascii supported");
            reject( new Error( "image comment metadata not in ASCII format"));
          }

          // skip first 8, they define encoding
          for (i = 8;i <  commentCharIntArray.length; i++) {
            const commentChar = String.fromCharCode(commentCharIntArray[i]);
            commentString += commentChar;
          }

          const jsonData = JSON.parse(commentString);
          // console.log(jsonData);
          resolve(jsonData);
        });
      }, 500)

    }))
  }



}
