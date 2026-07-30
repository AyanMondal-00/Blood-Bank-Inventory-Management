
import { 
  getDashboardStatsModel, 
  getTodayTransactionStatsModel,
  getLowStockCountModel,
  getExpiringSoonCountModel,
  getBloodGroupStatsModel 
} from "../models/dashboardModel.js";

export const getDashboardService = async () => {
  const stats = await getDashboardStatsModel();
  const today = await getTodayTransactionStatsModel();
  const lowStock = await getLowStockCountModel();
  const expiringSoon = await getExpiringSoonCountModel();
  const groupStats = await getBloodGroupStatsModel();

  return {
    ...stats,
    ...today,
    ...lowStock,
    ...expiringSoon,
    groupStats,
  }
};