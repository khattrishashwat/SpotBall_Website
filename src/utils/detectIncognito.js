export const detectIncognitoMode = () => {
  return new Promise((resolve) => {
    const userAgent = window.navigator.userAgent;

    // 1️⃣ Test for IndexedDB (Not Available in Some Incognito Modes)
    const dbCheck = new Promise((res) => {
      try {
        const db = indexedDB.open("test");
        db.onerror = () => res(true); // Incognito Mode
        db.onsuccess = () => res(false); // Normal Mode
      } catch (e) {
        res(true); // If IndexedDB Fails, Assume Incognito
      }
    });

    // 2️⃣ Test for FileSystem API (Disabled in Some Incognito Modes)
    const fileSystemCheck = new Promise((res) => {
      if ("webkitRequestFileSystem" in window) {
        window.webkitRequestFileSystem(
          0,
          0,
          () => res(false), // Normal Mode
          () => res(true) // Incognito Mode
        );
      } else {
        res(false); // Assume Normal Mode If API Not Available
      }
    });

    // 3️⃣ Test for Storage Quota (Lower in Incognito)
    const storageQuotaCheck = new Promise((res) => {
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then((estimate) => {
          res(estimate.quota < 120000000); // Incognito Mode if Quota is Low
        });
      } else {
        res(false);
      }
    });

    // 4️⃣ Detect Private Browsing on Safari
    const safariCheck = new Promise((res) => {
      if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
        try {
          window.openDatabase(null, null, null, null);
          res(false); // Normal Mode
        } catch (e) {
          res(true); // Incognito Mode
        }
      } else {
        res(false);
      }
    });

    // 5️⃣ Detect Firefox Private Browsing Mode
    const firefoxCheck = new Promise((res) => {
      if (/Firefox/.test(userAgent)) {
        const db = indexedDB.open("test");
        db.onerror = () => res(true); // Incognito Mode
        db.onsuccess = () => res(false); // Normal Mode
      } else {
        res(false);
      }
    });

    // Run All Checks & Resolve If Any Detects Incognito
    Promise.all([
      dbCheck,
      fileSystemCheck,
      storageQuotaCheck,
      safariCheck,
      firefoxCheck,
    ]).then((results) => {
      resolve(results.some((result) => result === true));
    });
  });
};
