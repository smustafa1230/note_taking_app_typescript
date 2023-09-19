import { UserService } from "../../service/UserService"; // Adjust the import path
import { UserReturnType, User, UserRequestType } from "../../entities/User"; // Adjust the import path
import { CustomError } from "../../middleware/exception/CustomError"; // Adjust the import path
import { FindOptions, FindOptionsWhere, Repository, Entity } from "typeorm";
import AppDataSource from "./../../config/AppDataSource";
// Import ts-mockito for mocking
import { mock, instance, when, verify } from "ts-mockito";

jest.mock("./../../config/AppDataSource");
const user: UserRequestType = {
  // Define user data here
  first_name: "salman",
  last_name: "mustafa",
  email: "test@mgail.com",
  password: "test",
};
const userObj = new User();
userObj.email = user.email || "email@salmen";
userObj.password = user.password || "123456";
userObj.first_name = user.first_name || "salman";
userObj.last_name = user.last_name || "mustafa";
describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let customError: CustomError;
  let appDataSourceMock: AppDataSource;

  beforeEach(async () => {
    // Create mocks for dependencies
    // userRepository = mock<Repository<User>>();
    userRepository = mock<Repository<User>>();

    customError = mock(CustomError);
    // appDataSource = Container.get(AppDataSource);
    appDataSourceMock = mock(AppDataSource);

    when(appDataSourceMock.getRepo(User)).thenReturn(userRepository);

    // Create an instance of UserService with mocked dependencies
    userService = new UserService(
      instance(appDataSourceMock),
      instance(customError)
    );
    // userRepository = instance(userRepository);
  });

  describe("signup", () => {
    it("should create a new user and return it", async () => {
      // Arrange

      // Mock the findOneBy method to return null (indicating that the user does not exist)

      const findOneBySpy = jest.spyOn(userRepository, "findOneBy");
      findOneBySpy.mockResolvedValue(null); // Mock the behavior

      const createSpy = jest.spyOn(userRepository, "create");
      const saveSpy = jest.spyOn(userRepository, "save");

      // Mock the create and save methods to return the new user
      createSpy.mockReturnValue(userObj);
      saveSpy.mockResolvedValue(userObj);

      // Act
      const result = await userService.signup(user);

      // Assert
      expect(result).toBe(userObj);

      // Verify that the findOneBy method was called with the correct arguments
      expect(findOneBySpy).toHaveBeenCalledWith({ email: user.email });
      expect(createSpy).toHaveBeenCalledWith(userObj);
      expect(saveSpy).toHaveBeenCalledWith(userObj);
    });
    it("should throw an error if the email already exists", async () => {
      const userObj = new User();
      user.email = user.email;
      user.password = user.password;
      user.first_name = user.first_name;
      user.last_name = user.last_name;

      // Mock the findOneBy method to return an existing user
      const findOneBySpy = jest.spyOn(userRepository, "findOneBy");
      findOneBySpy.mockResolvedValue(userObj); // Mock the behavior

      // Act and Assert
      await expect(userService.signup(user)).rejects.toThrowError(
        "Email already exists"
      );
    });
  });

  describe("login", () => {
    // Write tests for the login method in a similar fashion as above
  });
});
