const awsExports = {
  aws_project_region: "ap-south-1",
  aws_cognito_region: "ap-south-1",
  aws_user_pools_id: "ap-south-1_VZldR4LlF",
  aws_user_pools_web_client_id: "70du6bglll997hgetcbbfpsc22",
  aws_cognito_identity_pool_id: "",
  aws_cognito_username_attributes: ["email"],
  aws_cognito_signup_attributes: ["email"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: ["REQUIRES_LOWERCASE", "REQUIRES_UPPERCASE", "REQUIRES_NUMBERS", "REQUIRES_SYMBOLS"]
  },
  aws_cognito_verification_mechanisms: ["email"],
  oauth: {},
  Auth: {
    authenticationFlowType: 'USER_SRP_AUTH'
  }
};

export default awsExports;