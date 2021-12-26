import { Microservices } from "../../../commons/MicroServices";

const gdprUrl = window.location.origin + "/api/gdpr";
const gdprAdminUrl = window.location.origin + "/api/admin/gdpr";


export default class Services {
  // GDPR START

  static listGdpr = () => {
    let result = Microservices.fetchApi(gdprUrl, {
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

  static getGdpr = (id) => {
    let result = Microservices.fetchApi(gdprAdminUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        "Content-Type": "application/json",
        id: id,
      },
    });

    return result;
  };

  static addGdpr = (data) => {
    let result = Microservices.fetchApi(gdprAdminUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
      body: JSON.stringify(data),
    });
    return result;
  };

  static editGdpr = (data, id) => {
    let result = Microservices.fetchApi(gdprAdminUrl, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        id: id,
      },
      body: JSON.stringify(data),
    });
    return result;
  };

  static deleteGdpr = (id) => {
    let result = Microservices.fetchApi(gdprAdminUrl, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        id: id,
      },
    });
    return result;
  };

  // GDPR END
}