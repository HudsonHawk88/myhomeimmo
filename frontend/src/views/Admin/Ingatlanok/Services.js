import { Microservices } from "../../../commons/MicroServices";

const ingatlanokUrl = window.location.origin + "/api/ingatlanok";
const ingatlanokAdminUrl = window.location.origin + "/api/admin/ingatlanok";
const orszagokUrl = window.location.origin + "/api/orszagok";
const telepulesekUrl = window.location.origin + "/api/telepulesek";
const generateXmlUrl = window.location.origin + "/api/ingatlanok/ingatlanokapi"

export default class Services {
  // INGATLANOK START

  static listIngatlanok = () => {
    let result = Microservices.fetchApi(ingatlanokUrl, {
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

  static getIngatlan = (id) => {
    let result = Microservices.fetchApi(ingatlanokAdminUrl, {
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

  static addEIngatlan = (data) => {

    // console.log(data);
    let result = Microservices.fetchApi(ingatlanokAdminUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        // "Content-Type": "multipart/form-data",
        // "Content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
      body: data,
    });
    return result;
  };

  static editIngatlan = (data, id) => {
    let result = Microservices.fetchApi(ingatlanokAdminUrl, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        // "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        id: id,
      },
      body: data,
    });
    return result;
  };

  static deleteIngatlan = (id) => {
    let result = Microservices.fetchApi(ingatlanokAdminUrl, {
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

  // INGATLANOK END

  // ORSZAGOK START

  static listOrszagok = () => {
    let result = Microservices.fetchApi(orszagokUrl, {
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

  static listOrszagokLike = (like) => {
    let result = Microservices.fetchApi(orszagokUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        like: like,
      },
    });

    return result;
  };

  // ORSZAGOK END

  // TELEPÜLÉSEK START

  static listTelepulesek = () => {
    let result = Microservices.fetchApi(telepulesekUrl, {
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

  static getTelepulesById = (id) => {
    let result = Microservices.fetchApi(telepulesekUrl, {
      method: "GET",
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

  static getTelepulesByIrsz = (irsz) => {
    let result = Microservices.fetchApi(telepulesekUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        irsz: irsz,
      },
    });

    return result;
  };

  static listTelepulesekLike = (like) => {
    let result = Microservices.fetchApi(telepulesekUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        like: like,
      },
    });

    return result;
  };

  static generateXml = () => {
    let result = Microservices.fetchApi(generateXmlUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000"
      }
    });

    return result;
  };

  // TELEPÜLÉSEK END
}