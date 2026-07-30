
import { getDashboardStatsModel, getTodayTransactionStatsModel,getLowStockCountModel,getExpiringSoonCountModel } from "../models/dashboardModel.js";

export const getDashboardService = async () => {
    const stats = await getDashboardStatsModel();
  const today = await getTodayTransactionStatsModel();
  const lowStock = await getLowStockCountModel();
  const expiringSoon = await getExpiringSoonCountModel();

  return {
    ...stats,
    ...today,
    ...lowStock,
    ...expiringSoon,
  }
};