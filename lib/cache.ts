import NodeCache from "node-cache";

// Cache disimpan selama 300 detik (5 menit)
export const stockCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
