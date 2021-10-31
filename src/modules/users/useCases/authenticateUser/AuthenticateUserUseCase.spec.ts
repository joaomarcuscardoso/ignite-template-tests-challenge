import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("Should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    const result = await authenticateUserUseCase.execute({ email: user.email, password: "123456"});

    expect(result).toHaveProperty("token");
  });

  it("Should no be able to authenticate an user with wrong password", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      password: "123456",
      email: "test@test.com"
    });

    expect(async () => {
      await authenticateUserUseCase.execute({ email: user.email, password: "1234"})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should no be able to authenticate an invalid user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({ email: "test@test.com", password: "123456"})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
