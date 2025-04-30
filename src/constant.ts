export const secretKey = 'yourSecretKey';
export const tokenExpiration = '1h'; 

export const SALT_ROUNDS = 10;
export const ERRORS = {
    EMAIL_EXISTS: "Email already registered",
    INVALID_CREDENTIALS: "Invalid email or password",
    LOGIN_FAILED: "Login failed",
    USER_NOT_FOUND: "User not found",
    INVALID_TOKEN: "Invalid token",
};
// constants.ts
export const ERROR_MESSAGES = {
    MISSING_FIELDS: "Name, email, and password are required",
    EMAIL_EXISTS: "Email already exists",
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_CREDENTIALS: "Invalid credentials",
    TOKEN_REQUIRED: "Token is required",
    INVALID_TOKEN: "Invalid token",
  };
  
  export const SUCCESS_MESSAGES = {
    USER_CREATED: "User created successfully",
    LOGIN_SUCCESSFUL: "Login successful",
  };
  

// constants.ts
export const openaiApiKey = process.env.OPENAI_API_KEY || "your-default-api-key"; 
export const openaiModel = "gpt-4o-mini"; 
export const systemRoleContent = "You are a helpful assistant that returns frontend code based on the user's prompt";
export const temperature = 0.7;
