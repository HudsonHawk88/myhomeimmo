import { Microservices } from "../../../commons/MicroServices";

const kapcsolatUrl = window.location.origin + "/api/kapcsolat";
const sendEmailUrl = window.location.origin + "/api/contactmail/sendfromcontact";

export default class Services {
  // KAPCSOLAT START

  static listKapcsolat = () => {
    let result = Microservices.fetchApi(kapcsolatUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
    });

    return result;
  };

  static sendEmail = (emailObj) => {
    let result = Microservices.fetchApi(sendEmailUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
      body: JSON.stringify(emailObj)
    });

    return result;
  };
 // KAPCSOLAT END
}