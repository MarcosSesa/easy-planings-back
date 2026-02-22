import bc from "bcrypt";

export const hash = (data: string) => bc.hash(data, 6);

export const compareHash = async (data: string, hash: string) => await bc.compare(data, hash);