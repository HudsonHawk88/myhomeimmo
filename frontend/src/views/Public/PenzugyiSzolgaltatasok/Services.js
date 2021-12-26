import { Microservices } from "../../../commons/MicroServices";

const penzugyiSzolgaltatasokUrl = window.location.origin + "/api/penzugyszolg";

export default class Services {
  // PENZUGYI SZOLGALTATASOK START

  static listPenzugyiSzolgaltatasok = () => {
    let result = Microservices.fetchApi(penzugyiSzolgaltatasokUrl, {
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
 // PENZUGYI SZOLGALTATASOK END
}