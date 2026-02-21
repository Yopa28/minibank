const transactionService = require("../services/transaction.service");
const AppError = require("../utils/AppError");

// Mock semua repository yang dipakai service
jest.mock("../repositories/account.repository");
jest.mock("../repositories/transaction.repository");
jest.mock("../repositories/audit.repository");

const accountRepository = require("../repositories/account.repository");
const transactionRepository = require("../repositories/transaction.repository");
const auditRepository = require("../repositories/audit.repository");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Withdraw Service", () => {

  test("should withdraw successfully", async () => {
    accountRepository.findById.mockResolvedValue({
      id: 1,
      balance: 100000,
      isFrozen: false
    });

    accountRepository.update.mockResolvedValue();
    transactionRepository.create.mockResolvedValue();
    auditRepository.create.mockResolvedValue();

    const result = await transactionService.withdraw(
      1,
      50000,
      "sandy"
    );

    expect(result.balance).toBe(50000);
    expect(accountRepository.update).toHaveBeenCalled();
    expect(transactionRepository.create).toHaveBeenCalled();
  });

  test("should throw error if insufficient balance", async () => {
    accountRepository.findById.mockResolvedValue({
      id: 1,
      balance: 10000,
      isFrozen: false
    });

    await expect(
      transactionService.withdraw(1, 50000, "sandy")
    ).rejects.toThrow(AppError);
  });

  test("should throw error if account is frozen", async () => {
    accountRepository.findById.mockResolvedValue({
      id: 1,
      balance: 100000,
      isFrozen: true
    });

    await expect(
      transactionService.withdraw(1, 50000, "sandy")
    ).rejects.toThrow(AppError);
  });

});

describe("Transfer Service", () => {

  test("should transfer successfully", async () => {
    accountRepository.findById
      .mockResolvedValueOnce({
        id: 1,
        balance: 100000,
        isFrozen: false
      })
      .mockResolvedValueOnce({
        id: 2,
        balance: 50000,
        isFrozen: false
      });

    accountRepository.update.mockResolvedValue();
    transactionRepository.create.mockResolvedValue();
    auditRepository.create.mockResolvedValue();

    const result = await transactionService.transfer(
      1,
      2,
      50000,
      "sandy"
    );

    expect(result.message).toBe("Transfer successful");
    expect(accountRepository.update).toHaveBeenCalledTimes(2);
    expect(transactionRepository.create).toHaveBeenCalledTimes(2);
  });

  test("should throw error if sender not found", async () => {
    accountRepository.findById.mockResolvedValueOnce(null);

    await expect(
      transactionService.transfer(1, 2, 50000, "sandy")
    ).rejects.toThrow(AppError);
  });

  test("should throw error if insufficient balance", async () => {
    accountRepository.findById
      .mockResolvedValueOnce({
        id: 1,
        balance: 10000,
        isFrozen: false
      })
      .mockResolvedValueOnce({
        id: 2,
        balance: 50000,
        isFrozen: false
      });

    await expect(
      transactionService.transfer(1, 2, 50000, "sandy")
    ).rejects.toThrow(AppError);
  });

  test("should throw error if sender is frozen", async () => {
    accountRepository.findById
      .mockResolvedValueOnce({
        id: 1,
        balance: 100000,
        isFrozen: true
      })
      .mockResolvedValueOnce({
        id: 2,
        balance: 50000,
        isFrozen: false
      });

    await expect(
      transactionService.transfer(1, 2, 50000, "sandy")
    ).rejects.toThrow(AppError);
  });

});