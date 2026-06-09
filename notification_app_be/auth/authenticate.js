const axios = require("axios");
require("dotenv").config();

const config = require("../config/env");
const { log } = require("../../logging_middleware/logger");

async function runAuthenticate() {
  try {
    await log(
      "backend",
      "info",
      "auth",
      "Starting authentication/authorization process"
    );

    const payload = {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };

    if (
      !payload.email ||
      !payload.name ||
      !payload.rollNo ||
      !payload.accessCode ||
      !payload.clientID ||
      !payload.clientSecret
    ) {
      throw new Error(
        "EMAIL, NAME, ROLL_NO, ACCESS_CODE, CLIENT_ID and CLIENT_SECRET are required in .env"
      );
    }

    const authUrl = `${config.API_BASE_URL}/evaluation-service/auth`;

    console.log(`Sending authentication request to ${authUrl}...`);

    const response = await axios.post(authUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    const token =
      data.access_token ||
      data.accessToken ||
      data.token;

    if (!token) {
      throw new Error(
        `No access token returned.\nResponse: ${JSON.stringify(
          data
        )}`
      );
    }

    await log(
      "backend",
      "info",
      "auth",
      "Authentication successful"
    );

    console.log("\n=================================================");
    console.log("AUTHENTICATION SUCCESSFUL");
    console.log("=================================================");
    console.log("\nACCESS TOKEN:\n");
    console.log(token);
    console.log("\n=================================================");
    console.log(
      "Copy this token into ACCESS_TOKEN inside .env"
    );
    console.log("=================================================\n");

    return token;
  } catch (error) {
    const errorMsg = error.response
      ? `Auth failed with status ${
          error.response.status
        }: ${JSON.stringify(error.response.data)}`
      : error.message;

    try {
      await log(
        "backend",
        "fatal",
        "auth",
        errorMsg
      );
    } catch (_) {}

    console.error("\n[Auth Error]");
    console.error(errorMsg);
    process.exit(1);
  }
}

if (require.main === module) {
  runAuthenticate();
}

module.exports = { runAuthenticate };