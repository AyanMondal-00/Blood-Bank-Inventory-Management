
import { 
  getDashboardStatsModel, 
  getTodayTransactionStatsModel,
  getLowStockCountModel,
  getExpiringSoonCountModel,
  getBloodGroupStatsModel,
  getRevisedChargesModel
} from "../models/dashboardModel.js";

export const getDashboardService = async () => {
  const [stats, today, lowStock, expiringSoon, groupStats, revisedCharges] = await Promise.all([
    getDashboardStatsModel(),
    getTodayTransactionStatsModel(),
    getLowStockCountModel(),
    getExpiringSoonCountModel(),
    getBloodGroupStatsModel(),
    getRevisedChargesModel(),
  ]);

  return {
    ...stats,
    ...today,
    ...lowStock,
    ...expiringSoon,
    groupStats,
    revisedCharges,
  };
};