const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const url = require("url");
const querystring = require("querystring");
const { default: axios } = require("axios");

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

exports.authApp = (req, res) => {
  res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri,
    });

    const tokenOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };

    const tokenReq = https.request(
      access_token_url,
      tokenOptions,
      (tokenRes) => {
        let tokenData = "";
        tokenRes.on("data", (chunk) => {
          tokenData += chunk;
        });
        tokenRes.on("end", () => {
          const token = JSON.parse(tokenData);
          req.session.token = token;
          console.log(req.session);
          if (token) {
            res.writeHead(302, {
              Location: `http://${process.env.frontendIPAddress}/index.html`,
            });
            res.end();
          }
        });
      }
    );
    tokenReq.on("error", (err) => {
      console.error(err);
    });
    tokenReq.write(postData);
    tokenReq.end();
  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

//Get Profile Info
exports.getProfileInformation = (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      "https://www.mycourseville.com/api/v1/public/users/me",
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

//Get User's Courses
exports.getCourses = async (req, res) => {
  const profileOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  try{
    const CoursesReq = await axios.get("https://www.mycourseville.com/api/v1/public/get/user/courses" ,profileOptions);
    const data = CoursesReq.data.data.student;
    const resData = [];
    for (let i = 0; i < data.length; i++){
      if (data[i].year == "2022" && data[i].semester == "2"){
        resData.push(data[i]);
      }
    }
  
    res.status(200).send(resData);
  }catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

//Get Course Assignments
exports.getCourseAssignments = async (req, res) => {
  const cv_cid = req.params.cv_cid;
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${cv_cid}`,
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
    //console.log(AssignmentReq);
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

exports.getCourseInfo = async (req, res) => {
  const cv_cid = req.params.cv_cid;
  const profileOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };
  try{
    const CoursesReq = await axios.get(`https://www.mycourseville.com/api/v1/public/get/course/info?cv_cid=${cv_cid}` ,profileOptions);
    const data = CoursesReq.data.data;

  
    res.status(200).send(data);
  }catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

//Get Assignment Details
exports.getAssignmentDetail = async (req, res) => {
  const itemid = req.params.item_id;
  const profileOptions = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`,
    },
  };

  try{
    const Detail = await axios.get(`https://www.mycourseville.com/api/v1/public/get/item/assignment?item_id=${itemid}` ,profileOptions);
    res.status(200).send(Detail.data.data);
  }catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect(`http://${process.env.frontendIPAddress}/login.html`);
  res.end();
};
