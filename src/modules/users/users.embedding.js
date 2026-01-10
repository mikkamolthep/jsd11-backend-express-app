import {
  embedText,
  GEMINI_EMBEDDING_DIMS,
} from "../../services/gemini.client.js";
import { User } from "./users.model.js";

const buildUserEmbeddingText = (userDoc) => {
  const username = userDoc?.username?.toString().trim() ?? "";
  const email = userDoc?.email?.toString().trim() ?? "";
  const role = userDoc?.role?.toString().trim() ?? "";

  return [
    `User profile:`,
    `Username: ${username}`,
    `Email: ${email}`,
    `Role: ${role}`,
  ].join("\n");
};

const embedUserById = async (userId) => {
  if (!userId) {
    const error = new Error("userId is required.");
    error.name = "ValidationError";
    error.status = 400;
    throw error;
  }

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "embedding.status": "PROCESSING",
        "embedding.lastAttemptAt": new Date(),
      },
      $inc: { "embedding.attempts": 1 },
    },
    { new: false }
  );

  try {
    const user = await User.findById(userId).select(
      "username email role embedding.status"
    );

    if (!userId) {
      const error = new Error("User not found.");
      error.name = "NotFoundError";
      error.status = 404;
      throw error;
    }

    const text = buildUserEmbeddingText(user);
    const vector = await embedText({ text });

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "embedding.status": "READY",
          "embedding.vector": vector,
          "embedding.dims": GEMINI_EMBEDDING_DIMS,
          "embedding.updatedAt": new Date(),
          "embedding.lastError": null,
        },
      },
      { new: false }
    );

    return { ok: true };
  } catch (error) {
    const message = error?.message ?? "Embedding failed";

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "embedding.status": "FAILED",
          "embedding.lastError": message,
        },
      },
      {
        new: false,
      }
    );

    return {
      ok: false,
      error: message,
    };
  }
};

export const queueEmbedUserById = (userId) => {
  setImmediate(async () => {
    try {
      await embedUserById(userId);
    } catch (error) {
      console.error("Async user embedding failed.", { userId, error });
    }
  });
};

/* 
const queueEmbedUserById = (userId) => {
  setImmediate(() => {
    embedUserById(userId).catch((error) =>
      console.error("Async user embedding failed.", {
        userId,
        message: error?.message,
      })
    );
  });
}; 
*/
