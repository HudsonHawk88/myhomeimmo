import { Microservices } from "../../../commons/MicroServices";

const ingatlanokUrl = window.location.origin + "/api/ingatlanok/aktiv";
const keresIngatlanokUrl = window.location.origin + "/api/ingatlanok/keres";
const telepulesekUrl = window.location.origin + "/api/telepulesek";
const emailUrl = window.location.origin + '/api/contactmail/ingatlanerd';
const rechaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify?'

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

  static keresesIngatlanok = (kereso) => {
    let result = Microservices.fetchApi(keresIngatlanokUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
      },
      body: JSON.stringify(kereso)
    });

    return result;
  };

  static getIngatlan = (id) => {
    let result = Microservices.fetchApi(ingatlanokUrl, {
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
    let result = Microservices.fetchApi(ingatlanokUrl, {
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

  static editIngatlan = (data, id) => {
    let result = Microservices.fetchApi(ingatlanokUrl, {
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

  static deleteIngatlan = (id) => {
    let result = Microservices.fetchApi(ingatlanokUrl, {
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

  // TELEP??L??SEK START

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

  // TELEP??L??SEK END

  // RECHAPTCHA START
  
  static checkRechaptcha = (keys) => {
    let result = Microservices.fetchApi(rechaptchaUrl + new URLSearchParams(keys), {
      method: "POST"
      // mode: "cors",
      // cache: "no-cache",
      // headers: {
      //   "Content-Type": "application/json"
      // },
      
    });
    return result;
  };

  // RECHAPTCHA END

  // EMAIL START 

  static sendErdeklodes = (emailObj) => {
    let result = Microservices.fetchApi(emailUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://192.168.11.64:3000"
      },
      body: JSON.stringify(emailObj)
    });

    return result;
  };

  // EMAIL END
}