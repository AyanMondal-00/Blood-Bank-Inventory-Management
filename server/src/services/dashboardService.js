
import { 
  getDashboardStatsModel, 
  getTodayTransactionStatsModel,
  getLowStockCountModel,
  getExpiringSoonCountModel,
  getBloodGroupStatsModel 
} from "../models/dashboardModel.js";

export const getDashboardService = async () => {
  const [stats, today, lowStock, expiringSoon, groupStats] = await Promise.all([
    getDashboardStatsModel(),
    getTodayTransactionStatsModel(),
    getLowStockCountModel(),
    getExpiringSoonCountModel(),
    getBloodGroupStatsModel(),
  ]);

  return {
    ...stats,
    ...today,
    ...lowStock,
    ...expiringSoon,
    groupStats,
  };
};