import AXIOS_API from "./axios";
import handleError from "./handleError";

class Api {
  async LOGIN(email, password) {
    try {
      return await AXIOS_API.post("/api/auth/login", {
        email,
        password,
      });
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async VERIFY_EMAIL(token) {
    try {
      return await AXIOS_API.post(
        "/api/auth/verifyEmail",
        {},
        { headers: { authorization: token } }
      );
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async FORGET_PASSWORD(email) {
    try {
      return await AXIOS_API.post("/api/auth/forgetPassword", { email });
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async LOGOUT() {
    try {
      return await AXIOS_API.post("/api/auth/logout");
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async SIGNUP(email, password, name, designation, empId, telephone) {
    try {
      return await AXIOS_API.post("/api/user", {
        email,
        password,
        name,
        designation,
        empId,
        telephone,
      });
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async GET_USER() {
    try {
      return await AXIOS_API.get("/api/user");
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async ACL(action, formData = {}, limit = 10, filter = "") {
    try {
      return await AXIOS_API.post(
        `/api/user/acl?action=${action}&limit=${limit}&filter=${filter}`,
        formData
      );
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async GET_ALL_ADMIN(limit = 10, filter = "") {
    try {
      return await AXIOS_API.get(
        `/api/user/getAllAdmin?limit=${limit}&filter=${filter}`
      );
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async UPDATE_USER_PROFILE(formData, token) {
    try {
      return await AXIOS_API.put("/api/user", formData, {
        headers: { [token ? "authorization" : ""]: token },
      });
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async CREATE_PASS(formData) {
    try {
      return await AXIOS_API.post("/api/service/createPass", formData);
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async GET_ALL_PASS(state, limit = 10, filter = "", type = "") {
    try {
      return await AXIOS_API.get(
        `/api/service/getAllPass?state=${state}&limit=${limit}&filter=${filter}&type=${type}`
      );
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async GET_APPROVER(id) {
    try {
      return await AXIOS_API.get(`/api/service/getApprover?id=${id}`);
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async GET_PASS(id) {
    try {
      return await AXIOS_API.get(`/api/service/getPass?id=${id}`);
    } catch (err) {
      new handleError()._handleError(err);
    }
  }

  async UPDATE_STATE(id, action) {
    try {
      return await AXIOS_API.post("/api/service/updateState", { id, action });
    } catch (err) {
      new handleError()._handleError(err);
    }
  }
}

export default new Api();
