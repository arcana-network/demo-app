import { useStore } from "vuex";
import { getArcanaAuth } from "../utils/arcana-login";

const successToast = {
  styles: {
    backgroundColor: "green",
  },
  type: "success",
};
const address = "0x73A15a259d1bB5ACC23319CCE876a976a278bE82";

export function useFileMixin(toast) {
  const store = useStore();
  const Arcana = new arcana.Arcana(
    address,
    store.getters.privateKey,
    store.getters.email
  );

  async function download(file) {
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );
    const downloder = await Arcana.getDownloader();
    let did = file.fileId;
    did = did.substring(0, 2) !== "0x" ? "0x" + did : did;
    downloder.download(did);
    downloder.onSuccess = () => {
      toast("All chunks downloaded", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
      store.dispatch("hideLoader");
    };
    downloder.onProgress = (a, b) => {
      store.dispatch("showLoader", `Completed ${a} out of ${b} bytes`);
    };
    // setTimeout(() => {
    //   store.dispatch("showLoader", "Decrypting data and recreating file...");

    //   downloadFile(file.did).then((fileBlob) => {
    //     if (toast) {
    //       toast("All chunks downloaded", successToast);
    //       store.dispatch("showLoader", "Updating transaction on blockchain...");
    //       saveAs(fileBlob, file.name);
    //       const transaction = {
    //         type: "download",
    //         hash: generateId(),
    //         did: file.did,
    //         timestamp: Date.now(),
    //         transactionFee: 0.0001,
    //         status: "File Downloaded",
    //       };
    //       addTx(transaction);
    //       toast(
    //         "Transaction successfully updated in arcana network's blockchain",
    //         successToast
    //       );
    //       store.dispatch("hideLoader");
    //     }
    //   });
    // }, 2000);
  }

  async function share(fileToShare, email) {
    store.dispatch("showLoader", "Sharing file...");
    const arcanaAuth = getArcanaAuth();
    arcanaAuth.getPublicKey("google", email).then(async (publicKey) => {
      store.dispatch(
        "showLoader",
        "Encrypting file data with recipient's public key......"
      );
      const actualPublicKey =
        "0x04" + publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
      console.log(actualPublicKey, email, fileToShare);
      const access = await Arcana.getAccess();
      let did = fileToShare.fileId;
      did = did.substring(0, 2) != "0x" ? "0x" + did : did;
      store.dispatch("showLoader", `Sharing file with ${email}`);

      await access.share([did], [actualPublicKey], [1000000]);
      toast(`Shared file successfully with ${email}`, successToast);
      store.dispatch("hideLoader");

      // const file = Object.assign({}, fileToShare);
      // file.ref = generateId();
      // let user;
      // findUser(actualPublicKey).then((snapshot) => {
      //   if (snapshot.exists) {
      //     user = snapshot.data();
      //     user.sharedWithMe.push(file);
      //   } else {
      //     user = {
      //       address: actualPublicKey,
      //       totalStorage: bytes("25GB"),
      //       storageUsed: 0,
      //       myFiles: [],
      //       sharedWithMe: [file],
      //       trash: [],
      //     };
      //   }
      //   saveUser(user).then(() => {
      //     toast("File shared with the recipient", successToast);
      //     store.dispatch(
      //       "showLoader",
      //       "Updating transaction on blockchain......"
      //     );
      //     const tx = {
      //       type: "share",
      //       hash: file.ref,
      //       did: file.did,
      //       fileMeta: {
      //         size: file.size,
      //       },
      //       timestamp: Date.now(),
      //       transactionFee: 0.0001,
      //       status: "File Shared",
      //     };
      //     addTx(tx);
      //     toast(
      //       "Transaction successfully updated in arcana network's blockchain",
      //       successToast
      //     );
      //     store.dispatch("hideLoader");
      //   });
      // });
    });
  }

  function remove() {}

  async function upload(fileToUpload) {
    store.dispatch("showLoader", "Encrypting file...");
    const publicKey = store.getters.publicKey;
    const uploader = await Arcana.getUploader();
    store.dispatch("showLoader", "Uploading file to distributed storage...");

    const did = uploader.upload(fileToUpload);
    uploader.onProgress = (uploaded, total) => {
      store.dispatch("showLoader", `Uploaded ${uploaded} out of ${total}`);
    };
    uploader.onSuccess = () => {
      toast("Upload Success", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
      store.dispatch("hideLoader");
    };

    // findUser(publicKey).then((snapshot) => {
    //   setTimeout(() => {
    //     const user = snapshot.data();
    //     const uploadTask = uploadFile(fileToUpload, did);
    //     uploadTask.on(
    //       "state_changed",
    //       () => {
    //         //State change handler
    //       },
    //       () => {
    //         //Error handler
    //       },
    //       () => {
    //         //Success handler
    //         const hash = generateId();
    //         user.myFiles.push({
    //           type: "file",
    //           fileId: did,
    //           name: fileToUpload.name,
    //           size: fileToUpload.size,
    //           fileType: fileToUpload.type,
    //           createdAt: Date.now(),
    //           did: did,
    //           ref: hash,
    //         });
    //         saveUser(user);
    //         const tx = {
    //           type: "upload",
    //           hash,
    //           did,
    //           fileMeta: {
    //             size: fileToUpload.size,
    //           },
    //           timestamp: Date.now(),
    //           transactionFee: 0.0035,
    //           status: "File Uploaded",
    //         };
    //         addTx(tx);
    //       }
    //     );
    //   }, 1000);
    // });
  }

  return {
    download,
    remove,
    upload,
    share,
  };
}
