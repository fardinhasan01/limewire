import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

import { getServerConfig } from "@/lib/config.server";

type UploadRequest = {
  dataUrl?: string;
  folder?: string;
  publicId?: string;
};

function parseCloudinaryUrl() {
  const { cloudinaryUrl } = getServerConfig();
  if (!cloudinaryUrl) return null;

  const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/]+)$/);
  if (!match) return null;

  const [, apiKey, apiSecret, cloudName] = match;
  return { apiKey, apiSecret, cloudName };
}

function sha1(value: string) {
  return createHash("sha1").update(value).digest("hex");
}

export const Route = createFileRoute("/api/cloudinary-upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = (await request.json().catch(() => ({}))) as UploadRequest;
        if (typeof payload.dataUrl !== "string" || !payload.dataUrl.startsWith("data:image/")) {
          return new Response("A base64 image data URL is required", { status: 400 });
        }

        const config = parseCloudinaryUrl();
        if (!config) {
          return new Response("Missing CLOUDINARY_URL", { status: 500 });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = typeof payload.folder === "string" && payload.folder.trim() ? payload.folder.trim() : "epathshala/free-board";
        const publicId = typeof payload.publicId === "string" && payload.publicId.trim() ? payload.publicId.trim() : `board-${timestamp}`;
        const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;
        const signature = sha1(signatureBase);

        const formData = new FormData();
        formData.append("file", payload.dataUrl);
        formData.append("api_key", config.apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("folder", folder);
        formData.append("public_id", publicId);
        formData.append("signature", signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          return new Response(errorText || "Cloudinary upload failed", { status: 500 });
        }

        const result = (await response.json()) as { secure_url?: string };
        if (!result.secure_url) {
          return new Response("Cloudinary did not return a secure URL", { status: 500 });
        }

        return Response.json({ url: result.secure_url });
      },
    },
  },
});
