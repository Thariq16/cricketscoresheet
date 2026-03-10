import AWS from "aws-sdk";
import axios from "axios";

const isProd = process.env.REACT_APP_IS_PROD === "true";

//Server URL
export const BASE_URL = isProd
  ? "https://web-backend-lhox.onrender.com/api"
  : "https://fieldr-community-dev.onrender.com/api";

//Web URL
export const WEB_BASE_URL = isProd
  ? "https://community.fieldr.lk"
  : "https://dev-community.fieldr.lk";

export function sendHttpRequest(
  method,
  url,
  params = null,
  data = null,
  contentType = "application/json"
) {
  url = params ? url + "?" + constructUrlWithParams(params) : url;
  var request = axios({
    method: method,
    headers: { "Content-Type": contentType },
    url: BASE_URL + url,
    data: data,
  });
  return request;
}

function constructUrlWithParams(params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
  return query;
}

export function isContactNo(contactNo) {
  const re =
    /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
  return re.test(contactNo);
}

export function isPasswordValid(password) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return passwordPattern.test(password);
}

export function isInputValid(params) {
  var isValid = false;
  if (params === undefined || params === null || params === "") {
    isValid = true;
  }
  return isValid;
}

export function searchPlayer(searchingKeyWord, allPlayers) {
  searchingKeyWord = searchingKeyWord.toLowerCase();

  return allPlayers.filter(
    (player) =>
      player.email?.toLowerCase().includes(searchingKeyWord) ||
      player.contactNo?.toLowerCase().includes(searchingKeyWord) ||
      player.firstName?.toLowerCase().includes(searchingKeyWord) ||
      player.lastName?.toLowerCase().includes(searchingKeyWord)
  );
}

export function uploadToS3(file, type) {
  const fileName =
    type === "payment"
      ? "payments/" + Date.now().toString() + "." + file.name.split(".").pop()
      : Date.now().toString() + "." + file.name.split(".").pop();

  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME_FOR_MEDIA;
  const REGION = process.env.REACT_APP_AWS_REGION_FOR_MEDIA;

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: fileName.toString(),
    Body: file,
  };

  return s3
    .putObject(params)
    .promise()
    .then(() => {
      return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
