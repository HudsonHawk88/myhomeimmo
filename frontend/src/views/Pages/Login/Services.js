import { Microservices } from "../../../commons/MicroServices";

const loginUrl = window.location.origin + "/api/login";

const adminLoginUrl = window.location.origin + "/api/admin/login";

const tokenUrl = window.location.origin + "/api/token";

const adminTokenUrl = window.location.origin + "/api/admin/token";

const logoutUrl = window.location.origin + "/api/logout";

const adminLogoutUrl = window.location.origin + "/api/admin/logout";

const ingatlanokUrl = window.location.origin + "/api/ingatlanok/aktiv";

export default class Services {

    static login = (user, isAdmin) => {
        const logUrl = isAdmin ? adminLoginUrl : loginUrl;
        let result = Microservices.fetchApi(logUrl, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          },
          body: JSON.stringify(user)
        });
        return result;
    };

    static logout = (token, isAdmin) => {
      const url = isAdmin ? adminLogoutUrl : logoutUrl;
        let result = Microservices.fetchApi(url, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "token": token
            // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          },
        });
        return result;
    };

    static refreshToken = (refreshToken, isAdmin) => {
      const tokUrl = isAdmin ? adminTokenUrl : tokenUrl;
        let result = Microservices.fetchApi(tokUrl, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "refreshToken": refreshToken
            // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          },
        });
        return result;
    };

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
}
