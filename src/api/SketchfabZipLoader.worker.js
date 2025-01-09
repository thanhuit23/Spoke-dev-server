// Keep in sync with https://github.com/Hubs-Foundation/hubs/blob/master/src/workers/sketchfab-zip.worker.js
import JSZip from "jszip";

async function fetchZipAndGetBlobs(src) {
  console.log("fetchZipAndGetBlobs", src);

  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to fetch ZIP file: ${response.statusText}`);
  }

  const blob = await response.blob();
  console.log("Blob size:", blob.size);

  if (blob.size === 0) {
    throw new Error("Fetched file is empty");
  }
  if (src.endsWith(".zip") === false) {
    // Parse the GLTF file
    try {
      const gltfJson = JSON.parse(await blob.text());

      const fileMap = {};

      // Handle buffers (if any)
      if (gltfJson.buffers) {
        console.log("Processing buffers...");
        const bufferPromises = gltfJson.buffers.map(async (buffer, index) => {
          if (buffer.uri && !buffer.uri.startsWith("data:")) {
            const bufferResponse = await fetch(new URL(buffer.uri, src).href);
            const bufferBlob = await bufferResponse.blob();
            const bufferUrl = URL.createObjectURL(bufferBlob);
            buffer.uri = bufferUrl;

            // Store the buffer blob in the file map
            fileMap[`buffer_${index}`] = {
              url: bufferUrl,
              size: bufferBlob.size,
              type: bufferBlob.type,
            };
          }
        });

        await Promise.all(bufferPromises);
      }

      // Handle images (if any)
      if (gltfJson.images) {
        console.log("Processing images...");
        const imagePromises = gltfJson.images.map(async (image, index) => {
          if (image.uri && !image.uri.startsWith("data:")) {
            const imageResponse = await fetch(new URL(image.uri, src).href);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            image.uri = imageUrl;

            // Store the image blob in the file map
            fileMap[`image_${index}`] = {
              url: imageUrl,
              size: imageBlob.size,
              type: imageBlob.type,
            };
          }
        });

        await Promise.all(imagePromises);
      }

      // Create a new Blob for the updated GLTF JSON
      const finalBlob = new Blob([JSON.stringify(gltfJson, null, 2)], { type: "model/gltf+json" });
      const finalUrl = URL.createObjectURL(finalBlob);

      // Add the GLTF JSON blob to the file map
      fileMap["scene.gltf"] = {
        url: finalUrl,
        size: finalBlob.size,
        type: finalBlob.type,
      };

      console.log("GLTF file processed successfully:", fileMap);

      return fileMap;
    } catch (error) {
      console.error("Error processing GLTF file:", error.message);
      throw new Error(`Failed to process GLTF file: ${error.message}`);
    }
  } else {
    try {
      const zip = await fetch(src)
        .then(r => r.blob())
        .then(JSZip.loadAsync);

      // Rewrite any url refferences in the GLTF to blob urls
      const fileMap = {};
      const files = Object.values(zip.files);
      const fileBlobs = await Promise.all(files.map(f => f.async("blob")));
      for (let i = 0; i < fileBlobs.length; i++) {
        const name = files[i].name;
        const blob = fileBlobs[i];

        const url = URL.createObjectURL(blob);

        fileMap[name] = {
          url,
          size: blob.size,
          type: blob.type
        };
      }

      const gltfJson = JSON.parse(await zip.file("scene.gltf").async("text"));
      gltfJson.buffers && gltfJson.buffers.forEach(b => (b.uri = fileMap[b.uri].url));
      gltfJson.images && gltfJson.images.forEach(i => (i.uri = fileMap[i.uri].url));

      const blob = new Blob([JSON.stringify(gltfJson, null, 2)], { type: "model/gltf+json" });

      const url = URL.createObjectURL(blob);

      fileMap["scene.gltf"] = {
        url,
        size: blob.size,
        type: blob.type
      };

      return fileMap;
    } catch (error) {
      throw new Error(`Failed to load ZIP: ${error.message}`);
    }
  }


}


self.onmessage = async e => {
  try {
    const fileMap = await fetchZipAndGetBlobs(e.data);
    self.postMessage([true, fileMap]);
  } catch (e) {
    self.postMessage([false, e.message]);
  }
  delete self.onmessage;
};
