  // TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress =  "3.212.76.154:3000" //"127.0.0.1:3000";

const authorizeApplication = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};
