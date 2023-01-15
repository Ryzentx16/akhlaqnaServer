const DataAccessLayer = require("../DAL/DataAccessLayer");
const shared = require("../shared/shared");
const vl = require("../utils/validation");

async function Signup(response) {
  errors_list = [];
  //check if email in valid format or not
  const validate_res = vl.validation.phone_validation(response.phoneNumber);
  if (!validate_res) {
    errors_list.push("Phone number isn't in valid fromat");
  }

  var password_validate_res = vl.validation.isValidPassword(response.password);
  if (password_validate_res.length > 0) {
    password_validate_res = vl.validation.correct_password_validationMessage(
      password_validate_res
    );
    errors_list = errors_list.concat(password_validate_res);
  }

  // input errors handler
  if (errors_list.length > 0) {
    return {
      success: false,
      message: "invalid input format",
      errors: errors_list,
    };
  }

  // check email already exist in database or not
  const exist_res = await DataAccessLayer.IsExist(
    "select * from " + shared.dbName + ".Users where PhoneNumber = ?",
    [response.phoneNumber]
  );

  if (exist_res) {
    return {
      success: false,
      message: "Already exist in db",
      errors: [response.email + " " + "already exists"],
    };
  }

  response.password = vl.validation.hashPassword(response.password);

  // insert user data in data base

  var query =
    "insert into " +
    shared.dbName +
    ".Users (username,name,password,profileImage,isOtpChecked,PhoneNumber) values (?,?,?,?,?,?)";

  var values = [
    response.userName,
    response.name,
    response.password,
    response.profileImage,
    response.isOtpChecked,
    response.phoneNumber,
  ];

  const signup_query_res = await DataAccessLayer.ExcuteCommand(query, values);

  if (signup_query_res.name === "Error") {
    return {
      success: false,
      message: "db error",
      errors: ["something wrong on the input"],
    };
  }
  if (!signup_query_res) {
    return {
      success: false,
      message: "Already exist in db",
      errors: [response.phoneNumber + " " + "already exists"],
    };
  } else if (signup_query_res) {
    return { success: true, message: "Signup successful" };
  }
}

module.exports = Signup;
