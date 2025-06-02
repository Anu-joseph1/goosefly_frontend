const awsExports = {
  aws_project_region: "ap-south-1",
  aws_cognito_region: "ap-south-1",
  aws_user_pools_id: "ap-south-1_VZldR4LlF",
  aws_user_pools_web_client_id: "70du6bglll997hgetcbbfpsc22",
  
  // Add your API configuration
  aws_appsync_graphqlEndpoint: "", // If using AppSync
  aws_appsync_region: "ap-south-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  
  // For REST API configuration
  aws_cloud_logic_custom: [
    {
      name: "api", // This should match what you use in your API calls
      endpoint: "YOUR_API_GATEWAY_ENDPOINT", // Replace with your actual endpoint
      region: "ap-south-1"
    }
  ],
  
  // Rest of your existing configuration
  aws_cognito_identity_pool_id: "",
  aws_cognito_username_attributes: [""],
  aws_cognito_signup_attributes: [""],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: ["REQUIRES_LOWERCASE", "REQUIRES_UPPERCASE", "REQUIRES_NUMBERS", "REQUIRES_SYMBOLS"]
  },
  aws_cognito_verification_mechanisms: [""],
  oauth: {}
};

export default awsExports;
