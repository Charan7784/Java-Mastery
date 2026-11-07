export interface Account { id: string; fullName: string; email: string; createdAt: string; }
export interface QuizResult { id: string; userId: string; userEmail: string; moduleId: number; topicTitle: string; score: number; totalQuestions: number; attemptedAt: string; }
export interface LearningData { completedTopicIds: string[]; bookmarkedTopicIds: string[]; }
export interface LoginEvent { id: string; userId: string; email: string; loggedAt: string; }
export interface AdminSnapshot { users: Account[]; logins: LoginEvent[]; quizResults: QuizResult[]; }

const USER_TOKEN = "java-mastery-api-user-token";
const ADMIN_TOKEN = "java-mastery-api-admin-token";
const USER_VALUE = "java-mastery-api-user";
const ADMIN_VALUE = "java-mastery-api-admin";
const API = "/api";

async function request<T>(path: string, init: RequestInit = {}, admin = false): Promise<T> {
  const token = sessionStorage.getItem(admin ? ADMIN_TOKEN : USER_TOKEN);
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try { const body = await response.json(); message = body.message || body.detail || body.error || message; } catch { /* use status text */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function hasUsers() { return (await request<{hasUsers:boolean}>("/auth/has-users")).hasUsers; }
export async function registerUser(fullName: string, email: string, password: string): Promise<Account> { return request("/auth/register", { method:"POST", body:JSON.stringify({fullName,email,password}) }); }
export async function loginUser(email: string, password: string): Promise<Account> {
  const session = await request<{token:string;user:Account}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});
  sessionStorage.setItem(USER_TOKEN,session.token);sessionStorage.setItem(USER_VALUE,JSON.stringify(session.user));return session.user;
}
export async function restoreUser(): Promise<Account|null> {
  if(!sessionStorage.getItem(USER_TOKEN))return null;
  try { const user=await request<Account>("/auth/me");sessionStorage.setItem(USER_VALUE,JSON.stringify(user));return user; }
  catch { logoutUser();return null; }
}
export async function logoutUser() { try { await request<void>("/auth/logout",{method:"POST"}); } catch { /* clear this browser session regardless */ } sessionStorage.removeItem(USER_TOKEN);sessionStorage.removeItem(USER_VALUE); }
export async function getLearningData(): Promise<LearningData> { return request("/learning"); }
export async function saveLearningData(_userId: string, learning: LearningData) { return request<LearningData>("/learning",{method:"PUT",body:JSON.stringify(learning)}); }
export async function getQuizResults(_userId: string): Promise<QuizResult[]> { return request("/quiz/results"); }
export async function saveQuizResult(_user: Account,moduleId: number,score: number,totalQuestions: number): Promise<QuizResult> { return request("/quiz/results",{method:"POST",body:JSON.stringify({moduleId,score,totalQuestions})}); }
export async function loginAdmin(adminId: string,password: string): Promise<Account> {
  const session=await request<{token:string;user:Account}>("/admin/login",{method:"POST",body:JSON.stringify({id:adminId,password})});
  sessionStorage.setItem(ADMIN_TOKEN,session.token);sessionStorage.setItem(ADMIN_VALUE,JSON.stringify(session.user));return session.user;
}
export function getAdminSession(): Account|null { try { return sessionStorage.getItem(ADMIN_TOKEN)?JSON.parse(sessionStorage.getItem(ADMIN_VALUE)||"null"):null; } catch { return null; } }
export async function logoutAdmin() { try { await request<void>("/auth/logout",{method:"POST"},true); } catch { /* clear session regardless */ }sessionStorage.removeItem(ADMIN_TOKEN);sessionStorage.removeItem(ADMIN_VALUE); }
export async function getAdminSnapshot(): Promise<AdminSnapshot> { return request("/admin/snapshot",{},true); }
export async function deleteLocalUser(userId: string) { return request<void>(`/admin/users/${encodeURIComponent(userId)}`,{method:"DELETE"},true); }
