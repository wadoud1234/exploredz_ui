export type ResponseType<T> = {
  success: true
  message: string;
  data: T;
} | {
  success: false,
  error: string
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type Place = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  description: string;
  wilayaCode: number;
  images: string[];
  createdById: string
}