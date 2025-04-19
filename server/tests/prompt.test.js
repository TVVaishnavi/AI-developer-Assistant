const openaiController = require("../src/controller/openaiController");
const Prompt = require("../src/models/prompt");
const OpenAI = require("openai");

jest.mock("openai");
jest.mock("../src/models/prompt");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("OpenAI Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateCode", () => {
    it("should generate code and save prompt", async () => {
      const req = {
        body: { prompt: "Create a login form in React" },
      };
      const res = mockRes();
      OpenAI.prototype.chat = {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: "<form>Mock Login Form</form>",
                },
              },
            ],
          }),
        },
      };

      Prompt.create.mockResolvedValue({});

      await openaiController.generateCode(req, res);

      expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalled();
      expect(Prompt.create).toHaveBeenCalledWith({
        userPrompt: "Create a login form in React",
        aiResponse: "<form>Mock Login Form</form>",
      });
      expect(res.json).toHaveBeenCalledWith({
        output: "<form>Mock Login Form</form>",
      });
    });

    it("should return 500 on OpenAI error", async () => {
      const req = { body: { prompt: "test" } };
      const res = mockRes();

      OpenAI.prototype.chat = {
        completions: {
          create: jest.fn().mockRejectedValue(new Error("OpenAI error")),
        },
      };

      await openaiController.generateCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Something went wrong",
      });
    });
  });

  describe("getUserPrompts", () => {
    it("should return user prompts sorted by latest", async () => {
      const req = { user: { id: "user123" } };
      const res = mockRes();

      const mockPrompts = [
        { userPrompt: "Prompt 1", aiResponse: "Resp 1" },
        { userPrompt: "Prompt 2", aiResponse: "Resp 2" },
      ];

      Prompt.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPrompts),
      });

      await openaiController.getUserPrompts(req, res);

      expect(Prompt.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.json).toHaveBeenCalledWith({ prompts: mockPrompts });
    });

    it("should return 500 on DB error", async () => {
      const req = { user: { id: "user123" } };
      const res = mockRes();

      Prompt.find.mockImplementation(() => ({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      }));

      await openaiController.getUserPrompts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
