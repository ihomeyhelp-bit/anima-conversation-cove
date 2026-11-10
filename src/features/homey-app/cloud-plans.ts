/** Forfaits Sauvegarde cloud de l'app client (prix proposés, à confirmer par IHOMEY). */
export type CloudDays = 30 | 90 | 180;
export type CloudTier = 'basic' | 'plus';
/** [prix mensuel annuel, prix barré] par durée, pour Basique (1 caméra) puis Plus (illimité). */
export const cloudPrices: Record<CloudDays, [[number, number], [number, number]]> = {
  30: [[2.99, 4.99], [9.99, 16.66]],
  90: [[4.99, 8.33], [19.16, 33.33]],
  180: [[7.99, 13.33], [29.99, 49.99]],
};
export const cloudPlanSummary = (Object.keys(cloudPrices) as unknown as CloudDays[])
  .map((d) => `- ${d} jours : Basique (1 caméra) $${cloudPrices[d][0][0]}/mois ; Plus (caméras illimitées) $${cloudPrices[d][1][0]}/mois`)
  .join('\n');
