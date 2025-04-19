const userController = require('../src/controller/user');
const userService = require('../src/service/user');

jest.mock("../src/service/user");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("user controller", ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });

    describe("createUser", ()=>{
        it("should return 400 if required fields are missing", async () => {
            const req = { body: { name: "", email: "", password: "" } };
            const res = mockRes();

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
              message: "Name, email, and password are required",
            });
        });

        it("should return 400 if email already exists", async()=>{
            const req = {
                body:{name: "krish", email: "krish@gmail.com", password: "radha"}
            };
            const res = mockRes();

            userService.getUserByEmail.mockResolvedValue({id: "123"});
            await userController.createUser(req, res);

            expect(userService.getUserByEmail).toHaveBeenCalledWith("krish@gmail.com");
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Email already exists"});
        });

        it("should handle service errors", async () => {
            const req = {
              body: { name: "krish", email: "krish@gmail.com", password: "radha" },
            };
            const res = mockRes();

            userService.getUserByEmail = jest.fn().mockRejectedValue(new Error("Service Error"));

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).not.toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe("login", ()=>{
        it("should return 400 if email or password is missing", async()=>{
            const req = {body: {email: "", password: ""}};
            const res = mockRes();

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Email and password are required"});
        });

        it("should return 401 if login fails", async () => {
            const req = {
                body: { email: "krish@g,mail.com", password: "radha" }
            };
            const res = mockRes();
        
            userService.login.mockRejectedValue(new Error("Invalid credentials"));
            await userController.login(req, res);
        
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });

        it("should return 500 if login service fails", async () => {
            const req = {
                body: { email: "krish@gmail.com", password: "radha" }
            };
            const res = mockRes();
        
            userService.login.mockRejectedValue(new Error("Service Error"));
            await userController.login(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });

        it("should login successfully", async()=>{
            const req = {
                body:{email: "krish@gmail.com", password: "radha"}
            };
            const res = mockRes();

            const userResult = {
                email: "krish@gmail.com",
                name: "krish",
                token: "fake-jwt-token",
            };
            userService.login.mockResolvedValue(userResult);
            await userController.login(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful",
                result: userResult
            });
        });
    });

    describe("refreshToken", ()=>{
        it("should return 400 if token is missing", async()=>{
            const req = {body: {token: ""}};
            const res = mockRes();

            await userController.refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Token is required"});
        });

        it("should return 401 if token is invalid", async () => {
            const req = { body: { token: "invalid-token" } };
            const res = mockRes();
        
            userService.refreshToken.mockRejectedValue(new Error("invalid token"));
            await userController.refreshToken(req, res);
        
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
        });

        it("should return 500 if token refresh service fails", async () => {
            const req = { body: { token: "old-token" } };
            const res = mockRes();
        
            userService.refreshToken.mockRejectedValue(new Error("Service Error"));
            await userController.refreshToken(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });

        it("should return new token on success", async()=>{
            const req = {body: {token: "old-token"}};
            const res = mockRes();

            userService.refreshToken.mockResolvedValue("new-token");
            await userController.refreshToken(req, res);

            expect(res.json).toHaveBeenCalledWith({token: "new-token"});
        });
    });
});
