module.exports = {
  // testEnvironment: "jsdom", // frontend testing
  testEnvironment: "node", // backend testing
  rootDir: process.cwd(), // Explicitly set root directory
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpeg|jpg|png|gif|svg)$": "<rootDir>/client/src/__mocks__/fileMock.js"
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleDirectories: [
    'node_modules',
    'client/src' // Add this to resolve absolute paths
  ]
};