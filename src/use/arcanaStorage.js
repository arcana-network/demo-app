import { Arcana as StorageProvider } from "@arcana/storage/dist/standalone/storage.umd";
import { useStore } from "vuex";
import { ref, onBeforeMount } from "vue";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;

function useArcanaStorage() {
  const store = useStore();
  const storageInstanceRef = ref(null);

  onBeforeMount(() => {
    if (!storageInstanceRef.value) {
      storageInstanceRef.value = new StorageProvider({
        appId: ARCANA_APP_ID,
        privateKey: store.getters.privateKey,
        email: store.getters.email,
      });
    }
  });

  async function fetchStorageLimits() {
    const access = await storageInstanceRef.value.getAccess();
    const [storageUsed, totalStorage] = await access.getUploadLimit();
    const [bandwidthUsed, totalBandwidth] = await access.getDownloadLimit();

    store.dispatch("updateStorage", {
      totalStorage,
      storageUsed,
    });
    store.dispatch("updateBandwidth", {
      totalBandwidth,
      bandwidthUsed,
    });
  }

  async function fetchMyFiles() {
    store.dispatch("showLoader", "Fetching uploaded files...");
    const myfiles = (await storageInstanceRef.value.myFiles()) || [];
    store.dispatch(
      "updateMyFiles",
      myfiles.map((d) => {
        d["fileId"] = d["did"];
        return d;
      })
    );
    store.dispatch("hideLoader");
  }

  return {
    fetchMyFiles,
    fetchStorageLimits,
  };
}

export default useArcanaStorage;
