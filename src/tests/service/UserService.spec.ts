import { UserService } from "../../service/UserService"; // Adjust the import path
import { UserReturnType, User, UserRequestType } from "../../entities/User"; // Adjust the import path
import { CustomError } from "../../middleware/exception/CustomError"; // Adjust the import path
import { FindOptions, FindOptionsWhere, Repository } from "typeorm";
import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

// Import ts-mockito for mocking
import { mock, instance, when, verify } from "ts-mockito";

const user: UserRequestType = {
  // Define user data here
  first_name: "salman",
  last_name: "mustafa",
  email: "test@mgail.com",
  password: "test",
};
const mockDS = {
  initialize: jest.fn(),
};

jest.mock("typeorm", () => {
  return {
    DataSource: jest.fn().mockImplementation(() => mockDS),
  };
});
describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let customError: CustomError;

  beforeEach(() => {
    // Create mocks for dependencies
    userRepository = mock(Repository);
    customError = mock(CustomError);

    // Create an instance of UserService with mocked dependencies
    userService = new UserService(instance(customError));
    userService.userRepository = instance(userRepository);
  });

  describe("signup", () => {
    it("should create a new user and return it", async () => {
      // Arrange

      const body: UserReturnType = {
        // Define user data here
        ...user,
      };

      const userObj = new User();
      user.email = user.email;
      user.password = user.password;
      user.first_name = user.first_name;
      user.last_name = user.last_name;
      // Mock the findOneBy method to return null (indicating that the user does not exist)
      when(
        userRepository.findOneBy({
          email: body.email,
        } as FindOptionsWhere<User>)
      ).thenResolve(null);

      // Mock the create and save methods to return the new user
      when(userRepository.create(userObj)).thenReturn();
      when(userRepository.save(instance(userObj))).thenResolve(userObj);

      // Act
      const result = await userService.signup(user);

      // Assert
      expect(result).toBe(user);

      // Verify that the findOneBy method was called with the correct arguments
      verify(
        userRepository.findOneBy({
          email: body.email,
        } as FindOptionsWhere<User>)
      ).once();
      // Verify that the create and save methods were called
      verify(userRepository.create(userObj)).once();
      verify(userRepository.save(instance(userObj))).once();
    });

    it("should throw an error if the email already exists", async () => {
      // Arrange

      const existingUser: UserReturnType = {
        first_name: "salman",
        last_name: "mustafa",
        email: "test@mgail.com",
        password: "test",
      };

      const userObj = new User();
      user.email = user.email;
      user.password = user.password;
      user.first_name = user.first_name;
      user.last_name = user.last_name;

      // Mock the findOneBy method to return an existing user
      when(
        userRepository.findOneBy({
          email: user.email,
        } as FindOptionsWhere<User>)
      ).thenResolve(userObj);

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
