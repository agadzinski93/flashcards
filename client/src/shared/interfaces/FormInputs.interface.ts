type LoginInputs = {
    username: string;
    password: string;
};

type RegisterInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type { LoginInputs, RegisterInputs };