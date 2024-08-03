// Type: Entity
export interface User {
	id: number;
	userId: string;
	name: string;
	avater: string;
	introduction: string;
	password: string;
	token: string;
}

// ユーザー情報からセンシティブな情報を除いたもの
export type UserWithoutSensitiveInfo = Omit<User, "password" | "token">;