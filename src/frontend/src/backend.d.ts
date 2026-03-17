import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Post {
    id: bigint;
    coverImageUrl?: string;
    title: string;
    body: string;
    createdAt: Time;
    authorName: string;
    category: Category;
}
export interface Score {
    score: bigint;
    playerName: string;
}
export interface PostInput {
    coverImageUrl?: string;
    title: string;
    body: string;
    authorName: string;
    category: Category;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    clothes = "clothes",
    technology = "technology",
    phone_accessories = "phone_accessories",
    fashion = "fashion"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addScore(playerName: string, score: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(input: PostInput): Promise<bigint>;
    deletePost(id: bigint): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: bigint): Promise<Post | null>;
    getPostsByCategory(category: Category): Promise<Array<Post>>;
    getTopScores(): Promise<Array<Score>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePost(id: bigint, input: PostInput): Promise<void>;
}
