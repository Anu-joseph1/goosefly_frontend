const awsExports = {
  aws_project_region: "ap-south-1",
  aws_cognito_region: "ap-south-1",
  aws_user_pools_id: "ap-south-1_VZldR4LlF",
  aws_user_pools_web_client_id: "70du6bglll997hgetcbbfpsc22",
  
  aws_cloud_logic_custom: [
    {
      name: "api",
      endpoint: "http://172.16.11.53:8000", // Update this to your actual endpoint
      region: "ap-south-1"
    }
  ],
  
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: ["REQUIRES_LOWERCASE", "REQUIRES_UPPERCASE", "REQUIRES_NUMBERS"]
  },
  oauth: {}
};

export default awsExports;