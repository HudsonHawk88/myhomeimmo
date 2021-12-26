import { Microservices } from "../../../commons/MicroServices";

const adatkezeleskUrl = window.location.origin + "/api/gdpr";

export default class Services {
  // ADATKEZELES START

  static listAdatkezeles = () => {
    let result = Microservices.fetchApi(adatkezeleskUrl, {
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
 // ADATKEZELES END
}