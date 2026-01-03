export const mockLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === "admin" && password === "1234") {
                resolve({
                    access_token: "fake-jwt-token-123",
                });
            } else {
                reject("Invalid credentials");
            }
        }, 1000);
    });
};

export const mockRegister = (user) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: "User registered" });
        }, 1000);
    });
};
