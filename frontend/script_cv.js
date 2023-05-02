const backendIPAddress =  "3.212.76.154:3000";

const authorizeApplication = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};
