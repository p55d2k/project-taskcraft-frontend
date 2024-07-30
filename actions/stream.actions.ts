"use server";

import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

// export const tokenProvider = async (): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, (user) => {
//       console.log("Auth state changed, user:", user); // Debugging line

//       if (!user) {
//         console.error("No user found", user);
//         return reject(new Error("No user found"));
//       }
//       if (!apiKey) {
//         console.error("No Stream API key provided");
//         return reject(new Error("No Stream API key provided"));
//       }
//       if (!apiSecret) {
//         console.error("No Stream secret key provided");
//         return reject(new Error("No Stream secret key provided"));
//       }

//       const client = new StreamClient(apiKey, apiSecret);

//       const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
//       const issued = Math.round(Date.now() / 1000) - 60;

//       const token = client.createToken(user.uid, exp, issued);

//       resolve(token);
//     });
//   });
// };

export const tokenProvider = async (userToken: string): Promise<string> => {
  if (!userToken) throw new Error("No user token found");
  if (!apiKey) throw new Error("No Stream API key provided");
  if (!apiSecret) throw new Error("No Stream secret key provided");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.round(Date.now() / 1000) - 60;

  const token = client.createToken(userToken, exp, issued);

  return token;
};
