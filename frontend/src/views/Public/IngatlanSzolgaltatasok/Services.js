import { Microservices } from "../../../commons/MicroServices";

const ingatlanSzolgaltatasokUrl = window.location.origin + "/api/ingatlanszolg";

export default class Services {
  // INGATLAN SZOLGALTATASOK START

  static listIngatlanSzolgaltatasok = () => {
    let result = Microservices.fetchApi(ingatlanSzolgaltatasokUrl, {
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
 // INGATLAN SZOLGALTATASOK END
}