import type { UserWithoutSensitiveInfo } from "./user";

export interface Article {
	articleId: number;
	author: UserWithoutSensitiveInfo;
	articleType: number;
	thumbnail: string;
	title: string;
	body: string;
}
