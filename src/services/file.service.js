import { storageRef } from "../utils/firebase";

export function uploadFile(file, childId) {
  return storageRef.child(childId).put(file);
}

export function downloadFile(childId) {
  let lastLoaded = 0;
  return new Promise((resolve) => {
    storageRef
      .child(childId)
      .getDownloadURL()
      .then((url) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onprogress = (e) => {
          lastLoaded = e.loaded;
        };
        xhr.onload = () => {
          var blob = xhr.response;
          resolve(blob);
        };
        xhr.open("GET", url);
        xhr.send();
      });
  });
}
