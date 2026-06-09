const axios = require("axios");
require("dotenv").config();

const config = require("../config/env");
const { log } = require("../../logging_middleware/logger");

async function runRegister() {
  try {
    await log(
      "backend",
      "info",
      "auth",
      "Starting client registration process"
    );

    const payload = {
      email: process.env.EMAIL,
      name: process.env.NAME,
      mobileNo: process.env.MOBILE_NO,
      githubUsername: process.env.GITHUB_USERNAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
    };

    if (
      !payload.email ||
      !payload.name ||
      !payload.mobileNo ||
      !payload.githubUsername ||
      !payload.rollNo ||
      !payload.accessCode
    ) {
      throw new Error(
        "EMAIL, NAME, MOBILE_NO, GITHUB_USERNAME, ROLL_NO and ACCESS_CODE are required in .env"
      );
    }

    const registerUrl = `${config.API_BASE_URL}/evaluation-service/register`;

    console.log(`Sending registration request to ${registerUrl}...`);
    console.log("Registering client...");

    const response = await axios.post(registerUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    await log(
      "backend",
      "info",
      "auth",
      "Client registered successfully"
    );

    console.log("\n=================================================");
    console.log("REGISTRATION SUCCESSFUL");
    console.log("=================================================");
    console.log("Client ID:");
    console.log(data.clientID || data.clientId);
    console.log("\nClient Secret:");
    console.log(data.clientSecret);
    console.log("=================================================\n");

    console.log("Copy these values into your .env file:\n");

    console.log(
      `CLIENT_ID=${data.clientID || data.clientId}`
    );

    console.log(
      `CLIENT_SECRET=${data.clientSecret}`
    );

    console.log("\nThen run authenticate.js");
  } catch (error) {
    const errorMsg = error.response
      ? `Registration failed with status ${
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

    console.error("\n[Registration Error]");
    console.error(errorMsg);
    process.exit(1);
  }
}

if (require.main === module) {
  runRegister();
}

module.exports = { runRegister };