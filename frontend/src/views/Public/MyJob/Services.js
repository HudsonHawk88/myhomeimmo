import { Microservices } from "../../../commons/MicroServices";

const applyJobUrl = window.location.origin + "/api/contactmail/jobApply";

export default class Services {
  // INGATLAN SZOLGALTATASOK START

  static sendJobApply = (emailObj) => {
    let result = Microservices.fetchApi(applyJobUrl, {
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
 // INGATLAN SZOLGALTATASOK END
}