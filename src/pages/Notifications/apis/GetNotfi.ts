import axios from "axios";
import type { Root } from "../interface/notfy";

export async function getNotfi(): Promise<Root> {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/notifications?unread=false&page=1&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function getUnreadCount() {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/notifications/unread-count`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function markAsRead(id: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function markAllAsRead() {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/notifications/read-all`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}