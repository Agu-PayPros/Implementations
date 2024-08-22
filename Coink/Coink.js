const axios = require("axios");
var cryptojs = require("crypto-js");

var CONFIG = {
  mode: cryptojs.mode.ECB,
  padding: cryptojs.pad.Pkcs7,
};

getKeyTripleDES = function (key) {
  let securityKeyArray = cryptojs.MD5(key).toString();
  securityKeyArray += securityKeyArray.substring(0, 16);
  return cryptojs.enc.Hex.parse(securityKeyArray);
};

encryptTripleDES = function (message, key) {
  const toEncryptedArray = cryptojs.enc.Utf8.parse(message);
  const payload = cryptojs.TripleDES.encrypt(toEncryptedArray, getKeyTripleDES(key), CONFIG);
  return payload.ciphertext.toString(cryptojs.enc.Base64);
};

decryptTripleDES = function (message, key) {
  const payload = cryptojs.TripleDES.decrypt(message, getKeyTripleDES(key), CONFIG);
  return payload.toString(cryptojs.enc.Utf8);
};

const myApiKey = "9660b43e-e2e0-4424-8072-d0fd2ebcb9eb";
const myToken = "dm9vB9iH0OruENPrekvGzc4tIAm1zaZf";
const mycipher =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBcGlLZXkiOiI3NzA3NTciLCJWZXJzaW9uIjoiMS4wIn0.X_ubupT4w9HMpQmm55IMtGHlrsTbdALXXsv6O9fkC60";
const url = "https://xc223xnsz1.execute-api.us-east-1.amazonaws.com/dev/v1";

async function request(data, endpoint) {
  try {
    const payload = encryptTripleDES(JSON.stringify(data), mycipher);
    console.log(payload);

    const response = await axios.post(
      `${url}${endpoint}`,
      { payload: JSON.stringify(payload) },
      {
        headers: {
          Authorization: `${myToken}`,
          "x-api-key": myApiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Error en la solicitud:", error.response.data);
  }
}

async function request2(endpoint) {
  try {
    const response = await axios.get(`${url}${endpoint}`, {
      headers: {
        "x-api-key": myApiKey,
        "Content-Type": "application/json",
      },
    });
    console.log("🚀 ~ request2 ~ response.data.payload:", response.data.payload);
    // const decryptedPayload = decryptTripleDES(response.data.payload, mycipher);
    // console.log(decryptedPayload);
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

const REGISTER_DATA = {
  callback: "www.google.com",
  user_info: {
    birthdate: "1999-04-12",
    city_id: "10005",
    device_type_id: 1,
    document_expedition_date: "2020-09-14",
    document_number: "97862342",
    document_type_id: 1,
    email: "john@email.com",
    gender_id: 1,
    imei: "abf1542",
    is_pep: false,
    lastnames: "Doe",
    names: "John",
    person_type: 100,
    phone_number: "573112323834",
    monthly_incomes: 100000,
    assets: 5000000,
  },
  context_id: 4,
};

const ACH_DATA = {
  // transfer_id: uuid.v4(),
  origin_account_id: "c194d1b6-7b01-4bdf-a303-f455c7dc838d",
  subject: "test",
  amount: "10000",
  external_account: {
    account_alias: "TEST1",
    account_number: "039845",
    account_type_id: 20,
    bank_id: 2,
    document_type_id: 1,
    document_number: "109987345",
    names: "John",
    lastnames: "Doe",
  },
};

const PSE_DATA = {
  transfer_id: Math.random().toString(36).substring(2, 8),
  account_number: "573126624934",
  subject: "test",
  amount: "1000000",
  callback_url: "https://www.google.com/",
  external_account: {
    bank_id: 2,
  },
};

const DEPOSIT_DATA = {
  transfer_id: Math.random().toString(36).substring(2, 8),
  account_number: "573126624934",
  amount: "1000000",
  location_id: "407e9d38-0045-48c7-9941-8797280c80be",
};

request2("/dictionaries/countries");
// request(REGISTER_DATA, "/forms/register");
// request(ACH_DATA, "/transactions/ach/send");
// request(PSE_DATA, "/transactions/paygateway/pse");
// request(DEPOSIT_DATA, "/transactions/deposit");
